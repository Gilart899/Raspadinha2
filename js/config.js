/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Configurações Gerais
========================================================== */

const CONFIG = {

    /* ======================================================
       SISTEMA
    ====================================================== */

    nome: "Raspadinha da Amizade",

    versao: "2.0.0",

    ambiente: "producao",

    /* ======================================================
       CANVAS
    ====================================================== */

    canvas: {

        largura: 320,

        altura: 320,

        raio: 22,

        porcentagemRevelar: 60

    },

    /* ======================================================
       ANIMAÇÕES
    ====================================================== */

    animacoes: {

        velocidadeTrevos: 1,

        quantidadeConfetes: 120

    },

    /* ======================================================
       CAMINHOS
    ====================================================== */

    imagens: {

        logo: "img/logo.png",

        ferro: "img/ferro.png",

        liquidificador: "img/liquidificador.png",

        perdeu: "img/perdeu.png"

    },

    sons: {

        raspar: "sounds/raspar.mp3",

        vitoria: "sounds/vitoria.mp3",

        derrota: "sounds/perdeu.mp3",

        abertura: "sounds/abertura.mp3"

    }

};

export default CONFIG;
