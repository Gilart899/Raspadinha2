// =====================================================
// RASPADINHA.JS V2 PROFISSIONAL
// Canvas + Firebase + Camada Real
// Projeto Raspadinha2
// =====================================================



let canvas;

let ctx;


let raspando = false;


let terminou = false;


let percentualRaspado = 0;


let numeroParticipante = null;



let camada = new Image();



let eventosAtivos = false;



// Sons

const somRaspar = new Audio(
"sounds/raspar.mp3"
);


const somVitoria = new Audio(
"sounds/vitoria.mp3"
);


const somPerdeu = new Audio(
"sounds/perdeu.mp3"
);





// =====================================================
// INICIAR RASPADINHA
// =====================================================


function iniciarRaspadinha(numero){


numeroParticipante = numero;


canvas =
document.getElementById(
"raspadinha"
);



ctx =
canvas.getContext(
"2d"
);



terminou=false;

percentualRaspado=0;



carregarCamada();



if(!eventosAtivos){

adicionarEventos();

eventosAtivos=true;

}



}







// =====================================================
// CARREGAR CAMADA REAL
// =====================================================


function carregarCamada(){



camada.onload=function(){


ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);



ctx.drawImage(

camada,

0,

0,

canvas.width,

canvas.height

);



};



camada.src =
"img/camada-raspadinha.png";



}






// =====================================================
// EVENTOS
// =====================================================


function adicionarEventos(){



canvas.addEventListener(

"mousedown",

iniciarRaspagem

);



canvas.addEventListener(

"mousemove",

raspar

);



canvas.addEventListener(

"mouseup",

pararRaspagem

);




canvas.addEventListener(

"touchstart",

iniciarRaspagem

);



canvas.addEventListener(

"touchmove",

raspar

);



canvas.addEventListener(

"touchend",

pararRaspagem

);



}





// =====================================================
// COMEÇAR
// =====================================================


function iniciarRaspagem(e){


if(terminou)return;



raspando=true;



somRaspar.currentTime=0;


somRaspar.play()
.catch(()=>{});



}





// =====================================================
// RASPAGEM
// =====================================================


function raspar(e){



if(!raspando)return;


if(terminou)return;



let pos =
obterPosicao(e);



ctx.globalCompositeOperation =

"destination-out";



ctx.beginPath();



ctx.arc(

pos.x,

pos.y,

22,

0,

Math.PI*2

);



ctx.fill();



calcularArea();



}




// =====================================================
// POSIÇÃO DO TOQUE
// =====================================================


function obterPosicao(e){



let rect =
canvas.getBoundingClientRect();



let x;

let y;



if(e.touches){



x =
e.touches[0].clientX
-
rect.left;



y =
e.touches[0].clientY
-
rect.top;



}else{



x =
e.clientX
-
rect.left;



y =
e.clientY
-
rect.top;


}



return {

x:x,

y:y

};



}



// CONTINUA NA PARTE 2

// =====================================================
// PARAR RASPAGEM
// =====================================================


function pararRaspagem(){


raspando=false;



if(percentualRaspado >= 60){


revelarResultado();


}



}





// =====================================================
// CALCULAR ÁREA RASPADA
// =====================================================


function calcularArea(){


let pixels =

ctx.getImageData(

0,

0,

canvas.width,

canvas.height

).data;



let transparentes = 0;



for(

let i = 3;

i < pixels.length;

i += 4

){


if(pixels[i] === 0){

transparentes++;

}


}



percentualRaspado =

(

transparentes /

(pixels.length / 4)

)

*

100;



}





// =====================================================
// CONSULTAR FIREBASE
// =====================================================


async function revelarResultado(){



if(terminou)return;



terminou=true;



try{


const resultado =

await RaspadinhaFirebase.revelarRaspadinha(

numeroParticipante

);



mostrarResultado(resultado);



}

catch(erro){



terminou=false;


alert(

erro.message

);



}



}





// =====================================================
// MOSTRAR RESULTADO
// =====================================================


function mostrarResultado(resultado){



const area =

document.getElementById(

"resultado"

);



if(!area)return;





if(resultado.ganhou){



somVitoria.play()
.catch(()=>{});



let imagem="";



if(
resultado.premio
.includes("Ferro")
){


imagem="img/ferro.png";


}



if(
resultado.premio
.includes("Liquidificador")
){


imagem="img/liquidificador.png";


}




area.innerHTML = `

<div class="vitoria">

🎉 PARABÉNS! 🎉

<br><br>

Você ganhou:

<br><br>

<img src="${imagem}" width="120">

<br><br>

<b>${resultado.premio}</b>


</div>

`;




}else{



somPerdeu.play()
.catch(()=>{});



area.innerHTML = `


<div class="derrota">


<img src="img/perdeu.png" width="120">


<br><br>


😔 Não foi dessa vez.


<br>


Continue participando!


</div>


`;



}




}



// =====================================================
// LIMPAR
// =====================================================


function resetarRaspadinha(){



ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);



percentualRaspado=0;


terminou=false;



}





// =====================================================
// EXPORTAR
// =====================================================


window.Raspadinha = {


iniciarRaspadinha,

resetarRaspadinha


};
