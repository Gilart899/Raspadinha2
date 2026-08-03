/* ==========================================================
   RASPADINHA DA AMIZADE 3.0
   CONTROLE DO RESULTADO
========================================================== */

import { CONFIG } from "../config.js";

/* ==========================================================
   RESULTADO ATUAL
========================================================== */

let resultadoAtual = "perdeu";

/* ==========================================================
   DEFINIR RESULTADO
========================================================== */

export function definirResultado(resultado) {

    resultadoAtual = resultado;

}

/* ==========================================================
   OBTER RESULTADO
========================================================== */

export function obterResultado() {

    return resultadoAtual;

}

/* ==========================================================
   VERIFICAR RESULTADO
========================================================== */

export function ganhouPremio() {

    return resultadoAtual !== "perdeu";

}

/* ==========================================================
   OBTER IMAGEM
========================================================== */

export function obterImagemResultado() {

    switch (resultadoAtual) {

        case "ferro":

            return CONFIG.premios.ferro;

        case "liquidificador":

            return CONFIG.premios.liquidificador;

        default:

            return CONFIG.premios.perdeu;

    }

}

/* ==========================================================
   REINICIAR
========================================================== */

export function limparResultado() {

    resultadoAtual = "perdeu";

}
