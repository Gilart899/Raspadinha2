/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Controle da Raspadinha
========================================================== */

import { iniciarCanvas } from "./canvas.js";
import { realizarSorteio } from "./sorteio.js";

let modal = null;
let btnFechar = null;

/* ==========================================================
   INICIAR
========================================================== */

export function iniciarRaspadinha() {

    modal = document.getElementById("modalRaspadinha");
    btnFechar = document.getElementById("btnFecharRaspadinha");

    if (!modal) {

        console.error("Modal não encontrado.");

        return;

    }

    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharRaspadinha
        );

    }

}

/* ==========================================================
   ABRIR
========================================================== */

export async function abrirRaspadinha() {

    // Escolhe o resultado (por enquanto é teste)
    await realizarSorteio();

    // Abre o modal
    modal.classList.remove("hidden");

    // Desenha o prêmio e a camada
    iniciarCanvas();

}

/* ==========================================================
   FECHAR
========================================================== */

export function fecharRaspadinha() {

    if (!modal) return;

    modal.classList.add("hidden");

}
