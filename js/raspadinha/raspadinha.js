// =====================================================
// RASPADINHA.JS
// Canvas + Firebase Raspadinha2
// =====================================================


let canvas;
let ctx;

let raspando = false;

let terminou = false;

let percentualRaspado = 0;


let numeroParticipante = null;



// =====================================================
// INICIAR RASPADINHA
// =====================================================

function iniciarRaspadinha(numero){


numeroParticipante = numero;


canvas = document.getElementById("raspadinha");


ctx = canvas.getContext("2d");



desenharCobertura();



adicionarEventos();



}



// =====================================================
// DESENHAR COBERTURA
// =====================================================

function desenharCobertura(){


ctx.fillStyle = "#b8b8b8";


ctx.fillRect(

0,

0,

canvas.width,

canvas.height

);



// efeito texto

ctx.fillStyle="#555";


ctx.font="bold 25px Arial";


ctx.textAlign="center";


ctx.fillText(

"RASPE AQUI",

canvas.width/2,

canvas.height/2

);



}



// =====================================================
// EVENTOS
// =====================================================


function adicionarEventos(){


canvas.addEventListener(
"mousedown",
iniciar
);


canvas.addEventListener(
"mousemove",
raspar
);


canvas.addEventListener(
"mouseup",
finalizar
);



canvas.addEventListener(
"touchstart",
iniciar
);


canvas.addEventListener(
"touchmove",
raspar
);


canvas.addEventListener(
"touchend",
finalizar
);



}




// =====================================================
// INICIAR RASPAGEM
// =====================================================


function iniciar(e){


if(terminou)return;


raspando=true;


}



// =====================================================
// RASPAR
// =====================================================


function raspar(e){


if(!raspando)return;


let rect =
canvas.getBoundingClientRect();



let x;

let y;



if(e.touches){


x=e.touches[0].clientX-rect.left;

y=e.touches[0].clientY-rect.top;


}else{


x=e.clientX-rect.left;

y=e.clientY-rect.top;


}



ctx.globalCompositeOperation =
"destination-out";



ctx.beginPath();


ctx.arc(

x,

y,

20,

0,

Math.PI*2

);



ctx.fill();



calcularRaspado();



}



// =====================================================
// FINALIZAR
// =====================================================


function finalizar(){


raspando=false;



if(percentualRaspado >= 60){

revelarResultado();

}



}




// =====================================================
// CALCULAR ÁREA
// =====================================================


function calcularRaspado(){


let pixels =
ctx.getImageData(

0,

0,

canvas.width,

canvas.height

).data;



let transparentes=0;


for(let i=3;i<pixels.length;i+=4){


if(pixels[i]===0){

transparentes++;

}


}



percentualRaspado =

(transparentes / (pixels.length/4))*100;



}



// =====================================================
// CHAMAR FIREBASE
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


alert(
erro.message
);


}



}




// =====================================================
// MOSTRAR RESULTADO
// =====================================================


function mostrarResultado(resultado){



let elemento =

document.getElementById(
"resultado"
);



if(resultado.ganhou){



elemento.innerHTML =

"🎉 PARABÉNS!<br><br>" +

"Você ganhou:<br>" +

resultado.premio;



}else{


elemento.innerHTML =

"😔 Não foi dessa vez.<br><br>" +

"Continue participando!";


}



}


// Exportar

window.Raspadinha = {


iniciarRaspadinha

};
