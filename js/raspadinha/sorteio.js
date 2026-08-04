/* ==========================================================
   SORTEIO ENGINE 5.0
========================================================== */

import { CONFIG } from "../config.js";
import { definirResultado } from "./resultado.js";

/* ==========================================================
   ESTADO
========================================================== */

let resultadoAtual = "perdeu";

let participanteAtual = null;

let modoTeste = CONFIG?.modoTeste ?? false;

/* ==========================================================
   INICIAR
========================================================== */

export function iniciarSorteio() {

    resultadoAtual = "perdeu";

    participanteAtual = null;

}

/* ==========================================================
   DEFINIR PARTICIPANTE
========================================================== */

export function definirParticipante(participante) {

    participanteAtual = participante;

}

/* ==========================================================
   REALIZAR SORTEIO
========================================================== */

export async function realizarSorteio() {

    try {

        if (modoTeste) {

            resultadoAtual = realizarSorteioTeste();

        } else {

            resultadoAtual =
                await realizarSorteioFirebase();

        }

        definirResultado(resultadoAtual);

        return resultadoAtual;

    } catch (erro) {

        console.error(

            "Erro no sorteio:",

            erro

        );

        resultadoAtual = "perdeu";

        definirResultado("perdeu");

        return "perdeu";

    }

}

/* ==========================================================
   SORTEIO DE TESTE
========================================================== */

function realizarSorteioTeste() {

    const premios = CONFIG.premios.filter(

        premio => premio.id !== "perdeu"

    );

    const numero = Math.random();

    const chanceFerro =
        CONFIG?.raspadinha?.chanceFerro ?? 0.001;

    const chanceLiquidificador =
        CONFIG?.raspadinha?.chanceLiquidificador ?? 0.002;

    if (numero <= chanceFerro && premios.length > 0) {

        return premios.find(p => p.id === "ferro")?.id
            || "ferro";

    }

    if (numero <= chanceLiquidificador && premios.length > 1) {

        return premios.find(
            p => p.id === "liquidificador"
        )?.id || "liquidificador";

    }

    return "perdeu";

}

/* ==========================================================
   FIREBASE
========================================================== */

async function realizarSorteioFirebase() {

    /*
        Esta função será implementada na próxima etapa,
        utilizando firebase-raspadinha.js.

        Fluxo previsto:

        1 - Validar participante
        2 - Verificar pagamento
        3 - Verificar se já raspou
        4 - Verificar disponibilidade dos prêmios
        5 - Registrar vencedor
        6 - Atualizar estoque de prêmios
        7 - Retornar resultado
    */

    return "perdeu";

}

/* ==========================================================
   GETTERS
========================================================== */

export function obterResultadoAtual() {

    return resultadoAtual;

}

export function obterParticipanteAtual() {

    return participanteAtual;

}

export function alterarModoTeste(valor) {

    modoTeste = Boolean(valor);

}

export function estaEmModoTeste() {

    return modoTeste;

}
