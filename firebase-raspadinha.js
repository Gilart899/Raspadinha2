// ======================================================
// FIREBASE RASPADINHA - VERSÃO PROFISSIONAL
// Firebase como autoridade do sorteio
// ======================================================


// Referência Firebase

const db = firebase.database();


// Nós do banco

const participantesRef = db.ref("participantes");

const premiosRef = db.ref("premios");

const vencedoresRef = db.ref("vencedores");

const estatisticasRef = db.ref("estatisticas");




// ======================================================
// BUSCAR PARTICIPANTE
// ======================================================

async function buscarParticipante(numero){


const snap = await participantesRef
.child(numero)
.once("value");


return snap.val();


}





// ======================================================
// VALIDAR PARTICIPANTE
// ======================================================

async function validarParticipante(numero){


const participante = await buscarParticipante(numero);



if(!participante){

throw new Error(
"Número não encontrado."
);

}



if(!participante.comprado){

throw new Error(
"Este número ainda não possui pagamento confirmado."
);

}



if(
participante.raspadinha &&
participante.raspadinha.realizada
){

throw new Error(
"Esta raspadinha já foi utilizada."
);

}



return participante;


}





// ======================================================
// REVELAR RASPADINHA
// ======================================================

async function revelarRaspadinha(numero){


await validarParticipante(numero);



const premiosSnap =
await premiosRef.once("value");


const premios =
premiosSnap.val();



let premioEncontrado = null;

let chavePremio = null;



for(const chave in premios){


const premio = premios[chave];



if(
premio.numeroPremiado === numero &&
premio.disponivel === true
){


premioEncontrado = premio;

chavePremio = chave;


break;


}


}




let resultado = "Não ganhou";



if(premioEncontrado){


resultado = premioEncontrado.nome;



// Bloquear prêmio

await premiosRef
.child(chavePremio)
.update({

disponivel:false

});




// Registrar vencedor

await vencedoresRef.push({

numero:numero,

premio:resultado,

data:new Date()
.toISOString()

});


}




// Atualizar participante

await participantesRef
.child(numero)
.child("raspadinha")
.update({

realizada:true,

premio:resultado

});





// Atualizar estatística

await estatisticasRef
.child("raspadinhasRealizadas")
.transaction(

valor => (valor || 0) + 1

);





return {


numero:numero,

premio:resultado,

ganhou:!!premioEncontrado


};



}





// ======================================================
// LIBERAR RASPADINHA
// ======================================================

async function liberar(numero){


await validarParticipante(numero);


await participantesRef
.child(numero)
.child("raspadinha")
.update({

liberada:true

});


return true;


}





// ======================================================
// EXPORTAR
// ======================================================


window.RaspadinhaFirebase = {


buscarParticipante,

validarParticipante,

liberar,

revelarRaspadinha


};
