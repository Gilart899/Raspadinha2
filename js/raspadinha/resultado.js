/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   RESULTADO
   Controle central do prêmio da raspadinha
========================================================== */

import { CONFIG } from "../config.js";


/* ==========================================================
   ESTADO
========================================================== */

let resultadoAtual = "perdeu";


/* ==========================================================
   NORMALIZAR RESULTADO
========================================================== */

function normalizarResultado(resultado) {

    if (
        resultado === null ||
        resultado === undefined
    ) {

        return "perdeu";

    }


    const valor =
        String(resultado)
            .trim()
            .toLowerCase();


    /* ======================================================
       PERDEU
    ====================================================== */

    if (
        valor === "perdeu" ||
        valor === "não ganhou" ||
        valor === "nao ganhou" ||
        valor === "não ganhou desta vez" ||
        valor === "nao ganhou desta vez"
    ) {

        return "perdeu";

    }


    /* ======================================================
       FERRO
    ====================================================== */

    if (
        valor === "ferro" ||
        valor === "ferro elétrico" ||
        valor === "ferro eletrico"
    ) {

        return "ferro";

    }


    /* ======================================================
       LIQUIDIFICADOR
    ====================================================== */

    if (
        valor === "liquidificador"
    ) {

        return "liquidificador";

    }


    /* ======================================================
       RESULTADO DESCONHECIDO
    ====================================================== */

    console.warn(
        "Resultado desconhecido:",
        resultado
    );


    return "perdeu";

}


/* ==========================================================
   DEFINIR RESULTADO
========================================================== */

export function definirResultado(resultado) {

    resultadoAtual =
        normalizarResultado(resultado);


    console.log(
        "Resultado definido:",
        resultadoAtual
    );


    return resultadoAtual;

}


/* ==========================================================
   OBTER RESULTADO
========================================================== */

export function obterResultado() {

    return resultadoAtual;

}


/* ==========================================================
   VERIFICAR SE GANHOU
========================================================== */

export function ganhouPremio() {

    return (
        resultadoAtual !== "perdeu"
    );

}


/* ==========================================================
   OBTER IMAGEM DO RESULTADO
========================================================== */

export function obterImagemResultado() {

    switch (resultadoAtual) {

        case "ferro":

            return CONFIG.premios.ferro;


        case "liquidificador":

            return CONFIG.premios.liquidificador;


        case "perdeu":

        default:

            return CONFIG.premios.perdeu;

    }

}


/* ==========================================================
   OBTER NOME DO PRÊMIO
========================================================== */

export function obterNomePremio() {

    switch (resultadoAtual) {

        case "ferro":

            return "Ferro Elétrico";


        case "liquidificador":

            return "Liquidificador";


        case "perdeu":

        default:

            return "Não ganhou desta vez";

    }

}


/* ==========================================================
   OBTER ID DO PRÊMIO
========================================================== */

export function obterIdPremio() {

    return resultadoAtual;

}


/* ==========================================================
   LIMPAR RESULTADO
========================================================== */

export function limparResultado() {

    resultadoAtual =
        "perdeu";

}


/* ==========================================================
   STATUS DO RESULTADO
========================================================== */

export function obterStatusResultado() {

    return {

        resultado:
            resultadoAtual,

        ganhou:
            ganhouPremio(),

        premio:
            obterNomePremio(),

        premioId:
            obterIdPremio(),

        imagem:
            obterImagemResultado()

    };

}


/* ==========================================================
   CONFIGURAÇÃO DO PRÊMIO
========================================================== */

export function obterPremioAtual() {

    switch (resultadoAtual) {

        case "ferro":

            return {

                id: "ferro",

                nome: "Ferro Elétrico",

                imagem:
                    CONFIG.premios.ferro

            };


        case "liquidificador":

            return {

                id: "liquidificador",

                nome: "Liquidificador",

                imagem:
                    CONFIG.premios.liquidificador

            };


        default:

            return {

                id: "perdeu",

                nome:
                    "Não ganhou desta vez",

                imagem:
                    CONFIG.premios.perdeu

            };

    }

}


/* ==========================================================
   FIM DO RESULTADO 6.0
========================================================== */
