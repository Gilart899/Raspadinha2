/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   CONFIGURAÇÕES GERAIS
========================================================== */

export const CONFIG = {

    sistema: {

        nome: "Raspadinha da Amizade",

        versao: "6.0",

        empresa: "GilFest",

        desenvolvedor: "GilArt"

    },

    campanha: {

        nome: "Campanha01",

        titulo: "Raspadinha da Amizade",

        premioPrincipal: "Ferro Elétrico",

        premioSecundario: "Liquidificador"

    },

    raspadinha: {

        largura: 380,

        altura: 380,

        raioRaspagem: 28,

        porcentagemRevelacao: 70,

        imagemCobertura: "img/camada-raspadinha.png"

    },

    premios: {

        perdeu: "img/perdeu.png",

        ferro: "img/ferro.png",

        liquidificador: "img/liquidificador.png"

    },

    probabilidades: {

        ferro: 0.001,

        liquidificador: 0.002

    },

    sons: {

        raspar: "sounds/raspar.mp3",

        ganhou: "sounds/vitoria.mp3",

        perdeu: "sounds/perdeu.mp3",

        click: "sounds/click.mp3"

    },

    firebase: {

        participantes: "participantes",

        premios: "premios",

        vencedores: "vencedores",

        sistema: "sistema",

        campanha: "campanha",

        estatisticas: "estatisticas",

        teste: "teste"

    },

    modoTeste: false

};

/* ==========================================================
   FIM
========================================================== */
