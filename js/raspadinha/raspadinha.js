/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
========================================================== */

let modal = null;
let btnFechar = null;

export function iniciarRaspadinha() {
   import { iniciarCanvas } from "./canvas.js";

    modal = document.getElementById("modalRaspadinha");
    btnFechar = document.getElementById("btnFecharRaspadinha");

    alert("iniciarRaspadinha executou");

    if (!modal) {
        alert("Modal NÃO encontrado");
        return;
    }

    if (btnFechar) {
        btnFechar.addEventListener("click", fecharRaspadinha);
    }

}

export function abrirRaspadinha() {

    alert("abrirRaspadinha executou");

    if (!modal) {

        alert("Modal é NULL");

        modal = document.getElementById("modalRaspadinha");

    }

    if (!modal) {

        alert("Modal continua NULL");

        return;

    }

    modal.classList.remove("hidden");

}

export function fecharRaspadinha() {

    if (!modal) return;

    modal.classList.add("hidden");

}
