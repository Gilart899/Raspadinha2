// =====================================================
// FIREBASE RASPADINHA 2.0
// Compatível com firebase-inicial-completo.json
// =====================================================


// Referências Firebase

const db = firebase.database();


// Caminhos

const participantesRef = db.ref("participantes");

const premiosRef = db.ref("premios");

const vencedoresRef = db.ref("vencedores");

const estatisticasRef = db.ref("estatisticas");

const campanhaRef = db.ref("campanha");



// =====================================================
// BUSCAR PARTICIPANTE
// =====================================================

async function buscarParticipante(numero){


const snap = await participantesRef
.child(numero)
.once("value");


return snap.val();


}



// =====================================================
// VALIDAR PARTICIPANTE
// =====================================================

async function validarParticipante(numero){


const participante = await buscarParticipante(numero);



if(!participante){

throw new Error(
"Participante não encontrado."
);

}



if(!participante.comprado){

throw new Error(
"Pagamento não confirmado."
);

}



return participante;



}



// =====================================================
// LIBERAR RASPADINHA
// =====================================================

async function liberarRaspadinha(numero){


await validarParticipante(numero);



await participantesRef
.child(numero)
.child("raspadinha")
.update({

liberada:true

});



return true;


}




// =====================================================
// VERIFICAR PRÊMIOS DISPONÍVEIS
// =====================================================


async function buscarPremios(){


const snap = await premiosRef.once("value");


return snap.val();


}




// =====================================================
// SORTEIO DO PRÊMIO
// =====================================================

async function sortearPremio(numero){


const participante =
await validarParticipante(numero);



if(
participante.raspadinha &&
participante.raspadinha.realizada
){

throw new Error(
"Raspadinha já utilizada."
);

}




const premios =
await buscarPremios();



let disponiveis=[];



if(
premios.ferro &&
premios.ferro.disponivel
){

disponiveis.push("ferro");

}



if(
premios.liquidificador &&
premios.liquidificador.disponivel
){

disponiveis.push("liquidificador");

}



if(disponiveis.length===0){

throw new Error(
"Não existem prêmios disponíveis."
);

}



// Sorteio

const escolhido =
disponiveis[
Math.floor(
Math.random()*disponiveis.length
)
];





// Dados do prêmio

let nomePremio="";


if(escolhido==="ferro"){

nomePremio="Ferro elétrico";

}


if(escolhido==="liquidificador"){

nomePremio="Liquidificador";

}




// Salvar vencedor

await vencedoresRef
.push({

numero:numero,

premio:nomePremio,

data:new Date()
.toISOString()

});




// Atualizar participante

await participantesRef
.child(numero)
.child("raspadinha")
.update({

realizada:true,

premio:nomePremio

});




// Retirar prêmio do estoque

await premiosRef
.child(escolhido)
.update({

disponivel:false

});




// Estatística

await estatisticasRef
.child("raspadinhasRealizadas")
.transaction(
(valor)=>(valor||0)+1
);



return {

numero:numero,

premio:nomePremio

};


}



// =====================================================
// EXPORTAR
// =====================================================

window.RaspadinhaFirebase = {


buscarParticipante,

validarParticipante,

liberarRaspadinha,

sortearPremio


};
