/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   MOTOR DE SORTEIO
========================================================== */

import { CONFIG } from "../config.js";

import {
    validarParticipacao,
    registrarResultado,
    registrarVencedor,
    registrarEstatistica,
    buscarPremios
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
        numero === undefined
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

    numeroAtual =
        valor.padStart(4, "0");

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
        participante.numero
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

        /* --------------------------------------------------
           DEFINIR NÚMERO
        -------------------------------------------------- */

        if (numero !== null) {

            definirNumero(numero);

        }

        if (!numeroAtual) {

            throw new Error(
                "Número da rifa não informado."
            );

        }

        /* --------------------------------------------------
           MODO TESTE
        -------------------------------------------------- */

        if (CONFIG.modoTeste === true) {

            resultadoAtual =
                realizarSorteioTeste();

            definirResultado(
                resultadoAtual
            );

            return resultadoAtual;

        }

        /* --------------------------------------------------
           VALIDAR PARTICIPAÇÃO
        -------------------------------------------------- */

        const validacao =
            await validarParticipacao(
                numeroAtual
            );

        if (
            !validacao.permitido
        ) {

            console.warn(

                "Participação bloqueada:",

                validacao.motivo

            );

            participanteAtual =
                validacao.participante;

            throw new Error(
                validacao.motivo
            );

        }

        /* --------------------------------------------------
           GUARDAR PARTICIPANTE
        -------------------------------------------------- */

        participanteAtual =
            validacao.participante;

        /* --------------------------------------------------
           REALIZAR SORTEIO
        -------------------------------------------------- */

        resultadoAtual =
            await sortearPremio();

        /* --------------------------------------------------
           DEFINIR RESULTADO
        -------------------------------------------------- */

        definirResultado(
            resultadoAtual
        );

        /* --------------------------------------------------
           REGISTRAR PARTICIPANTE
        -------------------------------------------------- */

        await registrarResultado(

            numeroAtual,

            resultadoAtual

        );

        /* --------------------------------------------------
           REGISTRAR VENCEDOR
        -------------------------------------------------- */

        if (
            resultadoAtual !==
            "perdeu"
        ) {

            await registrarVencedor(

                numeroAtual,

                resultadoAtual,

                participanteAtual

            );

        }

        /* --------------------------------------------------
           ESTATÍSTICAS
        -------------------------------------------------- */

        await registrarEstatistica(

            resultadoAtual

        );

        return resultadoAtual;

    } catch (erro) {

        console.error(

            "Erro no sorteio:",

            erro

        );

        /*
         * IMPORTANTE:
         * Se houve erro de validação/Firebase,
         * não vamos transformar silenciosamente
         * o erro em uma derrota.
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
   SORTEIO DO PRÊMIO
========================================================== */

async function sortearPremio() {

    const premios =
        await buscarPremios();

    /*
     * Se o Firebase tiver estoque configurado,
     * verificamos a disponibilidade.
     */

    const ferro =
        obterEstoquePremio(
            premios,
            "ferro"
        );

    const liquidificador =
        obterEstoquePremio(
            premios,
            "liquidificador"
        );

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

    const sorteio =
        Math.random();

    /*
     * Ferro
     */

    if (
        ferro > 0 &&
        sorteio < chanceFerro
    ) {

        return "ferro";

    }

    /*
     * Liquidificador
     */

    if (
        liquidificador > 0 &&
        sorteio <
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
   ESTOQUE DO PRÊMIO
========================================================== */

function obterEstoquePremio(
    premios,
    id
) {

    if (!premios) {

        /*
         * Caso a estrutura de prêmios
         * ainda não tenha estoque,
         * consideramos disponível.
         */

        return 1;

    }

    const premio =
        premios[id];

    if (!premio) {

        return 1;

    }

    /*
     * Aceita diferentes formatos:
     *
     * quantidade
     * estoque
     * disponivel
     */

    const estoque =
        premio.quantidade ??
        premio.estoque ??
        premio.disponivel;

    if (
        estoque === undefined
    ) {

        return 1;

    }

    return Number(estoque) || 0;

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
            CONFIG.probabilidades
                ?.liquidificador ||
            0.002
        );

    const numero =
        Math.random();

    if (
        numero <
        chanceFerro
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
   LIMPAR
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

}

/* ==========================================================
   FIM DO SORTEIO
========================================================== */
