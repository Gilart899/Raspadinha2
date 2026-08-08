/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   CONFIGURAÇÕES GERAIS
========================================================== */

export const CONFIG = {

    /* ======================================================
       SISTEMA
    ====================================================== */

    sistema: {

        nome: "Raspadinha da Amizade",

        versao: "6.0",

        empresa: "GilFest",

        desenvolvedor: "GilArt"

    },


    /* ======================================================
       CAMPANHA
    ====================================================== */

    campanha: {

        nome: "Campanha01",

        titulo: "Raspadinha da Amizade",

        subtitulo:
            "Raspe e descubra se você ganhou!",

        premioPrincipal:
            "Ferro Elétrico",

        premioSecundario:
            "Liquidificador"

    },


    /* ======================================================
       RASPADINHA
    ====================================================== */

    raspadinha: {

        largura: 380,

        altura: 380,

        raioRaspagem: 28,

        porcentagemRevelacao: 70,

        imagemCobertura:
            "img/camada-raspadinha.png"

    },


    /* ======================================================
       PRÊMIOS
    ====================================================== */

    premios: {

        perdeu:
            "img/perdeu.png",

        ferro:
            "img/ferro.png",

        liquidificador:
            "img/liquidificador.png"

    },


    /* ======================================================
       PROBABILIDADES
       
       OBS:
       O sorteio oficial será controlado pelo Firebase.
       Estes valores servem apenas para modo de teste.
    ====================================================== */

    probabilidades: {

        ferro: 0.001,

        liquidificador: 0.002

    },


    /* ======================================================
       SONS
    ====================================================== */

    sons: {

        raspar:
            "sounds/raspar.mp3",

        ganhou:
            "sounds/vitoria.mp3",

        perdeu:
            "sounds/perdeu.mp3",

        click:
            "sounds/click.mp3"

    },


    /* ======================================================
       FIREBASE
    ====================================================== */

    firebase: {

        participantes:
            "participantes",

        premios:
            "premios",

        vencedores:
            "vencedores",

        sistema:
            "sistema",

        campanha:
            "campanha",

        estatisticas:
            "estatisticas"

    },


    /* ======================================================
       BANCO
    ====================================================== */

    banco: {

        totalNumeros: 1000,

        numeroMinimo: 1,

        numeroMaximo: 1000

    },


    /* ======================================================
       MODO DE TESTE
       
       FALSE = SORTEIO REAL
       TRUE  = TESTE LOCAL
    ====================================================== */

    modoTeste: false

};


/* ==========================================================
   FUNÇÃO AUXILIAR
========================================================== */

export function obterConfiguracao() {

    return CONFIG;

}


/* ==========================================================
   FIM DO CONFIG
========================================================== */
