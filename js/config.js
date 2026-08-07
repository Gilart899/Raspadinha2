/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   CONFIGURAÇÕES GERAIS
========================================================== */

export const CONFIG = {

    /* ======================================================
       SISTEMA
    ====================================================== */

    sistema: {

        nome: "Raspadinha da Amizade",

        versao: "6.0",

        desenvolvedor: "GilArt",

        ambiente: "producao"

    },

    /* ======================================================
       RASPADINHA
    ====================================================== */

    raspadinha: {

        largura: 380,

        altura: 380,

        raioRaspagem: 25,

        porcentagemRevelacao: 70,

        camada: "img/camada-raspadinha.png",

        animacao: true

    },

    /* ======================================================
       PRÊMIOS
    ====================================================== */

    premios: {

        perdeu: "img/perdeu.png",

        ferro: "img/ferro.png",

        liquidificador: "img/liquidificador.png"

    },

    /* ======================================================
       SONS
    ====================================================== */

    sons: {

        raspar: "sounds/raspar.mp3",

        ganhou: "sounds/vitoria.mp3",

        perdeu: "sounds/perdeu.mp3",

        click: "sounds/click.mp3"

    },

    /* ======================================================
       FIREBASE
    ====================================================== */

    firebase: {

        campanha: "Campanha01",

        participantes: "participantes",

        vencedores: "vencedores",

        premios: "premios",

        estatisticas: "estatisticas",

        sistema: "sistema"

    }

};

/* ==========================================================
   FIM DO CONFIG
========================================================== */
