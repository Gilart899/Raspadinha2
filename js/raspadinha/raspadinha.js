/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
========================================================== */

import { iniciarCanvas } from "./canvas.js";

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

        btnFechar.addEventListener("click", fecharRaspadinha);

    }

}

/* ==========================================================
   ABRIR
========================================================== */

export function abrirRaspadinha() {

    if (!modal) {

        modal = document.getElementById("modalRaspadinha");

    }

    modal.classList.remove("hidden");

    iniciarCanvas();

}

/* ==========================================================
   FECHAR
========================================================== */

export function fecharRaspadinha() {

    if (!modal) return;

    modal.classList.add("hidden");

}
