/* ==========================================================
   RASPADINHA DA AMIZADE 3.0
   Controle da Raspadinha
========================================================== */

import { iniciarCanvas } from "./canvas.js";
import { realizarSorteio } from "./sorteio.js";
import { obterImagemResultado } from "./resultado.js";

let modal = null;
let btnFechar = null;
let imagemPremio = null;

/* ==========================================================
   INICIAR
========================================================== */

export function iniciarRaspadinha() {

    modal = document.getElementById("modalRaspadinha");

    btnFechar = document.getElementById("btnFecharRaspadinha");

    imagemPremio = document.getElementById("imagemPremio");

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

    await realizarSorteio();

    if (imagemPremio) {

        imagemPremio.src = obterImagemResultado();

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
