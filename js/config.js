/* ==========================================================
   RIFA SOLIDÁRIA 3.0
   Configuração Geral
========================================================== */

export const CONFIG = {

    // ======================================================
    // CAMPANHA
    // ======================================================

    campanha: {

        nome: "Raspadinha da Amizade",

        descricao:
            "Concorra a prêmios incríveis.",

        beneficiada: "Dona Bené",

        valor: 10.00,

        moeda: "R$"

    },

    // ======================================================
    // RIFA
    // ======================================================

    rifa: {

        quantidadeNumeros: 1000,

        numerosPorCartela: 100

    },

    // ======================================================
    // PRÊMIOS
    // ======================================================

    premios: [

        {
            id: "ferro",
            nome: "Ferro Elétrico",
            imagem: "/Raspadinha2/img/ferro.png",
            quantidade: 1
        },

        {
            id: "liquidificador",
            nome: "Liquidificador",
            imagem: "/Raspadinha2/img/liquidificador.png",
            quantidade: 1
        },

        {
            id: "perdeu",
            nome: "Não foi desta vez",
            imagem: "/Raspadinha2/img/perdeu.png",
            quantidade: 998
        }

    ],

    // ======================================================
    // RASPADINHA
    // ======================================================

    raspadinha: {

        largura: 380,

        altura: 380,

        raioRaspagem: 25,

        porcentagemRevelacao: 70,

        camada: "/Raspadinha2/img/camada-raspadinha.png"

    },

    // ======================================================
    // FIREBASE
    // ======================================================

    firebase: {

        campanhaAtiva: "campanha01"

    }

};
