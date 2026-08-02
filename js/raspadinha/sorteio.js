/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Motor de Sorteio
========================================================== */

import { definirResultado } from "./resultado.js";

/* ==========================================================
   SORTEIO
========================================================== */

export async function realizarSorteio() {

    // Temporário para testes.
    // Depois este resultado virá do Firebase.

    definirResultado("perdeu");

    return "perdeu";

}
