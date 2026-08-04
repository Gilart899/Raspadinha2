/* ==========================================================
   RASPADINHA SOLIDÁRIA 5.0
   Controlador Principal
========================================================== */

import CanvasEngine from "./canvas.js";

import { realizarSorteio } from "./sorteio.js";

import { obterImagemResultado } from "./resultado.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

let modal = null;

let btnFechar = null;

let imagemPremio = null;

/* ==========================================================
   MOTOR
========================================================== */

let canvasEngine = null;

/* ==========================================================
   ESTADO
========================================================== */

let inicializado = false;

let aberta = false;

/* ==========================================================
   INICIAR
========================================================== */

export async function iniciarRaspadinha() {

    if (inicializado) return;

    modal =
        document.getElementById(
            "modalRaspadinha"
        );

    btnFechar =
        document.getElementById(
            "btnFecharRaspadinha"
        );

    imagemPremio =
        document.getElementById(
            "imagemPremio"
        );

    if (!modal) {

        throw new Error(
            "Modal da raspadinha não encontrado."
        );

    }

    canvasEngine =
        new CanvasEngine(
            "canvasRaspadinha"
        );

    await canvasEngine.iniciar();

    registrarEventos();

    inicializado = true;

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

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

    if (!inicializado) {

        await iniciarRaspadinha();

    }

    await realizarSorteio();

    atualizarImagemPremio();

    await canvasEngine.reiniciar();

    modal.classList.remove(
        "hidden"
    );

    aberta = true;

}

/* ==========================================================
   IMAGEM
========================================================== */

function atualizarImagemPremio() {

    if (!imagemPremio) return;

    imagemPremio.src =
        obterImagemResultado();

}

/* ==========================================================
   FECHAR
========================================================== */

export function fecharRaspadinha() {

    if (!modal) return;

    modal.classList.add("hidden");

    aberta = false;

}

/* ==========================================================
   REINICIAR
========================================================== */

export async function reiniciarRaspadinha() {

    if (!canvasEngine) return;

    await canvasEngine.reiniciar();

}

/* ==========================================================
   STATUS
========================================================== */

export function raspadinhaAberta() {

    return aberta;

}

export function raspadinhaInicializada() {

    return inicializado;

}

export function obterCanvasEngine() {

    return canvasEngine;

}

/* ==========================================================
   DESTRUIR
========================================================== */

export function destruirRaspadinha() {

    if (canvasEngine) {

        canvasEngine.destruir();

        canvasEngine = null;

    }

    aberta = false;

    inicializado = false;

}

/* ==========================================================
   UTILITÁRIOS
========================================================== */

export function mostrarModal() {

    if (!modal) return;

    modal.classList.remove("hidden");

    aberta = true;

}

export function ocultarModal() {

    if (!modal) return;

    modal.classList.add("hidden");

    aberta = false;

}

/* ==========================================================
   GETTERS
========================================================== */

export function obterStatusRaspadinha() {

    return {

        inicializado,

        aberta,

        porcentagem: canvasEngine
            ? canvasEngine.porcentagem
            : 0,

        finalizado: canvasEngine
            ? canvasEngine.finalizado
            : false

    };

}

/* ==========================================================
   FIM DO CONTROLADOR
=========================
