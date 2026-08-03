/* ==========================================================
   RIFA SOLIDÁRIA 3.0
   Motor de Sorteio
========================================================== */

import { CONFIG } from "../config.js";
import { definirResultado } from "./resultado.js";

/* ==========================================================
   REALIZAR SORTEIO
========================================================== */

export async function realizarSorteio() {

    try {

        // ==================================================
        // MODO TESTE
        // ==================================================
        // Depois será substituído pelo Firebase.
        // Basta alterar "perdeu" para:
        //
        // "ferro"
        // "liquidificador"
        // "perdeu"
        // ==================================================

        const resultado = "perdeu";

        definirResultado(resultado);

        console.log(
            "Resultado da raspadinha:",
            resultado
        );

        return resultado;

    } catch (erro) {

        console.error(
            "Erro no sorteio:",
            erro
        );

        definirResultado("perdeu");

        return "perdeu";

    }

}

/* ==========================================================
   SORTEIO ALEATÓRIO (TESTES)
========================================================== */

export function sorteioTeste() {

    const premios = CONFIG.premios.filter(

        premio => premio.id !== "perdeu"

    );

    const numero = Math.random();

    if (numero < 0.001) {

        return premios[0].id;

    }

    if (numero < 0.002) {

        return premios[1].id;

    }

    return "perdeu";

}
