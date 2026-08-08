/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   RESULTADO
   Controle central do prêmio da raspadinha
========================================================== */

import { CONFIG } from "../config.js";

/* ==========================================================
   ESTADO
========================================================== */

let resultadoAtual = "perdeu";

/* ==========================================================
   DEFINIR RESULTADO
========================================================== */

export function definirResultado(resultado) {

    if (!resultado) {

        resultadoAtual = "perdeu";

        return resultadoAtual;

    }

    const resultadoNormalizado =
        String(resultado)
            .trim()
            .toLowerCase();

    const resultadosValidos = [

        "perdeu",

        "ferro",

        "liquidificador"

    ];

    if (
        !resultadosValidos.includes(
            resultadoNormalizado
        )
    ) {

        console.warn(

            "Resultado inválido:",
            resultado

        );

        resultadoAtual = "perdeu";

        return resultadoAtual;

    }

    resultadoAtual =
        resultadoNormalizado;

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

        resultadoAtual !==
        "perdeu"

    );

}

/* ==========================================================
   OBTER IMAGEM DO RESULTADO
========================================================== */

export function obterImagemResultado() {

    switch (
        resultadoAtual
    ) {

        case "ferro":

            return CONFIG.premios.ferro;

        case "liquidificador":

            return CONFIG.premios
                .liquidificador;

        case "perdeu":

        default:

            return CONFIG.premios
                .perdeu;

    }

}

/* ==========================================================
   OBTER NOME DO PRÊMIO
========================================================== */

export function obterNomePremio() {

    switch (
        resultadoAtual
    ) {

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
   LIMPAR RESULTADO
========================================================== */

export function limparResultado() {

    resultadoAtual =
        "perdeu";

}

/* ==========================================================
   STATUS
========================================================== */

export function obterStatusResultado() {

    return {

        resultado:
            resultadoAtual,

        ganhou:
            ganhouPremio(),

        premio:
            obterNomePremio(),

        imagem:
            obterImagemResultado()

    };

}

/* ==========================================================
   FIM DO RESULTADO
========================================================== */
