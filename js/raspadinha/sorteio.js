/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   MOTOR DE SORTEIO
   Firebase = autoridade do resultado
========================================================== */

import { CONFIG } from "../config.js";

import {
    validarParticipante,
    revelarRaspadinha
} from "../firebase/firebase-raspadinha.js";

import {
    definirResultado
} from "./resultado.js";


/* ==========================================================
   ESTADO
========================================================== */

let resultadoAtual = "perdeu";

let participanteAtual = null;

let numeroAtual = null;

let executando = false;


/* ==========================================================
   INICIAR
========================================================== */

export function iniciarSorteio() {

    resultadoAtual = "perdeu";

    participanteAtual = null;

    numeroAtual = null;

    executando = false;

}


/* ==========================================================
   DEFINIR NÚMERO
========================================================== */

export function definirNumero(numero) {

    if (
        numero === null ||
        numero === undefined ||
        numero === ""
    ) {

        numeroAtual = null;

        return null;

    }


    const valor =
        String(numero)
            .replace(/\D/g, "");


    if (!valor) {

        numeroAtual = null;

        return null;

    }


    /*
     * Mantemos o número sem zeros à esquerda
     * para coincidir com as chaves do Firebase.
     */

    numeroAtual =
        String(
            Number(valor)
        );


    return numeroAtual;

}


/* ==========================================================
   OBTER NÚMERO
========================================================== */

export function obterNumero() {

    return numeroAtual;

}


/* ==========================================================
   DEFINIR PARTICIPANTE
========================================================== */

export function definirParticipante(
    participante
) {

    participanteAtual =
        participante || null;


    if (
        participante &&
        participante.numero !== undefined
    ) {

        definirNumero(
            participante.numero
        );

    }


    return participanteAtual;

}


/* ==========================================================
   OBTER PARTICIPANTE
========================================================== */

export function obterParticipanteAtual() {

    return participanteAtual;

}


/* ==========================================================
   REALIZAR SORTEIO
========================================================== */

export async function realizarSorteio(
    numero = null
) {

    if (executando) {

        throw new Error(
            "Um sorteio já está em andamento."
        );

    }


    executando = true;


    try {

        /* ==================================================
           DEFINIR NÚMERO
        ================================================== */

        if (numero !== null) {

            definirNumero(numero);

        }


        if (!numeroAtual) {

            throw new Error(
                "Número da rifa não informado."
            );

        }


        /* ==================================================
           MODO DE TESTE
        ================================================== */

        if (CONFIG.modoTeste === true) {

            resultadoAtual =
                realizarSorteioTeste();


            definirResultado(
                resultadoAtual
            );


            return resultadoAtual;

        }


        /* ==================================================
           VALIDAR PARTICIPANTE
        ================================================== */

        participanteAtual =
            await validarParticipante(
                numeroAtual
            );


        if (!participanteAtual) {

            throw new Error(
                "Participante não encontrado."
            );

        }


        /* ==================================================
           RESULTADO OFICIAL
           
           O Firebase decide.
        ================================================== */

        const resultado =
            await revelarRaspadinha(
                numeroAtual
            );


        if (!resultado) {

            throw new Error(
                "Firebase não retornou resultado."
            );

        }


        /* ==================================================
           NORMALIZAR RESULTADO
        ================================================== */

        if (
            resultado.ganhou === true
        ) {

            resultadoAtual =
                resultado.premio;

        } else {

            resultadoAtual =
                "perdeu";

        }


        /* ==================================================
           DEFINIR RESULTADO
        ================================================== */

        definirResultado(
            resultadoAtual
        );


        console.log(
            "Resultado oficial:",
            resultadoAtual
        );


        return resultadoAtual;

    } catch (erro) {

        console.error(
            "Erro no sorteio:",
            erro
        );


        /*
         * NÃO transformar erro de Firebase
         * silenciosamente em prêmio ou resultado.
         */

        resultadoAtual =
            "perdeu";


        definirResultado(
            "perdeu"
        );


        throw erro;

    } finally {

        executando = false;

    }

}


/* ==========================================================
   SORTEIO DE TESTE
========================================================== */

export function realizarSorteioTeste() {

    const chanceFerro =
        Number(
            CONFIG.probabilidades?.ferro ||
            0.001
        );


    const chanceLiquidificador =
        Number(
            CONFIG.probabilidades?.liquidificador ||
            0.002
        );


    const numero =
        Math.random();


    if (
        numero < chanceFerro
    ) {

        return "ferro";

    }


    if (
        numero <
        (
            chanceFerro +
            chanceLiquidificador
        )
    ) {

        return "liquidificador";

    }


    return "perdeu";

}


/* ==========================================================
   MODO TESTE
========================================================== */

export function alterarModoTeste(
    valor
) {

    CONFIG.modoTeste =
        Boolean(valor);

}


/* ==========================================================
   VERIFICAR EXECUÇÃO
========================================================== */

export function sorteioEmAndamento() {

    return executando;

}


/* ==========================================================
   RESULTADO
========================================================== */

export function obterResultadoAtual() {

    return resultadoAtual;

}


/* ==========================================================
   LIMPAR SORTEIO
========================================================== */

export function limparSorteio() {

    resultadoAtual =
        "perdeu";

    participanteAtual =
        null;

    numeroAtual =
        null;

    executando =
        false;


    definirResultado(
        "perdeu"
    );

}


/* ==========================================================
   FIM DO MOTOR
========================================================== */
