/* ==========================================================
   RIFA SOLIDÁRIA 3.0
   Controle de Resultado
========================================================== */

import { CONFIG } from "../config.js";

let resultadoAtual = "perdeu";

/* ==========================================================
   DEFINIR RESULTADO
========================================================== */

export function definirResultado(idPremio) {

    resultadoAtual = idPremio;

}

/* ==========================================================
   OBTER RESULTADO
========================================================== */

export function obterResultado() {

    return resultadoAtual;

}

/* ==========================================================
   OBTER DADOS DO PRÊMIO
========================================================== */

export function obterPremio() {

    return CONFIG.premios.find(

        premio => premio.id === resultadoAtual

    );

}

/* ==========================================================
   OBTER IMAGEM
========================================================== */

export function obterImagemResultado() {

    const premio = obterPremio();

    if (!premio) {

        return CONFIG.premios.find(

            p => p.id === "perdeu"

        ).imagem;

    }

    return premio.imagem;

}

/* ==========================================================
   VERIFICAR SE GANHOU
========================================================== */

export function ganhou() {

    return resultadoAtual !== "perdeu";

}

/* ==========================================================
   RESETAR
========================================================== */

export function resetarResultado() {

    resultadoAtual = "perdeu";

}
