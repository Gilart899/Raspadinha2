/* ==========================================================
   RASPADINHA DA AMIZADE 3.0
   Canvas Definitivo
========================================================== */

import { obterImagemResultado } from "./resultado.js";

let canvas;
let ctx;

let camadaCanvas;
let camadaCtx;

let raspando = false;
let eventosRegistrados = false;

// Imagens
const imagemPremio = new Image();
const imagemCamada = new Image();

/* ==========================================================
   INICIAR
========================================================== */

export async function iniciarCanvas() {

    canvas = document.getElementById("canvasRaspadinha");

    if (!canvas) {
        console.error("Canvas não encontrado.");
        return;
    }

    ctx = canvas.getContext("2d");

    canvas.width = 380;
    canvas.height = 380;

    camadaCanvas = document.createElement("canvas");
    camadaCanvas.width = canvas.width;
    camadaCanvas.height = canvas.height;

    camadaCtx = camadaCanvas.getContext("2d");

    await carregarImagens();

    desenharTudo();

    if (!eventosRegistrados) {

        registrarEventos();

        eventosRegistrados = true;

    }

}

/* ==========================================================
   CARREGAR IMAGENS
========================================================== */

async function carregarImagens() {

    imagemPremio.src = obterImagemResultado();

    imagemCamada.src = "/Raspadinha2/img/camada-raspadinha.png";

    await Promise.all([
        carregar(imagemPremio),
        carregar(imagemCamada)
    ]);

}

function carregar(img) {

    return new Promise((resolve, reject) => {

        if (img.complete && img.naturalWidth > 0) {

            resolve();

            return;

        }

        img.onload = resolve;

        img.onerror = reject;

    });

}

/* ==========================================================
   DESENHAR
========================================================== */

function desenharTudo() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Desenha o prêmio

    ctx.drawImage(
        imagemPremio,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Prepara a camada metálica

    camadaCtx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    camadaCtx.drawImage(
        imagemCamada,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Coloca a camada por cima

    ctx.drawImage(
        camadaCanvas,
        0,
        0
    );

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    // Mouse

    canvas.addEventListener("mousedown", iniciar);

    canvas.addEventListener("mousemove", moverMouse);

    canvas.addEventListener("mouseup", parar);

    canvas.addEventListener("mouseleave", parar);

    // Touch

    canvas.addEventListener(
        "touchstart",
        iniciarTouch,
        { passive: false }
    );

    canvas.addEventListener(
        "touchmove",
        moverTouch,
        { passive: false }
    );

    canvas.addEventListener(
        "touchend",
        parar
    );

}

/* ==========================================================
   CONTROLE
========================================================== */

function iniciar() {

    raspando = true;

}

function iniciarTouch(e) {

    e.preventDefault();

    raspando = true;

}

function parar() {

    raspando = false;

}

/* ==========================================================
   MOUSE
========================================================== */

function moverMouse(e) {

    if (!raspando) return;

    const rect = canvas.getBoundingClientRect();

    raspar(

        e.clientX - rect.left,

        e.clientY - rect.top

    );

}

/* ==========================================================
   TOUCH
========================================================== */

function moverTouch(e) {

    if (!raspando) return;

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const toque = e.touches[0];

    raspar(

        toque.clientX - rect.left,

        toque.clientY - rect.top

    );

}

/* ==========================================================
   RASPAR
========================================================== */

function raspar(x, y) {

    // Apaga apenas a camada metálica

    camadaCtx.globalCompositeOperation = "destination-out";

    camadaCtx.beginPath();

    camadaCtx.arc(
        x,
        y,
        25,
        0,
        Math.PI * 2
    );

    camadaCtx.fill();

    camadaCtx.globalCompositeOperation = "source-over";

    // Redesenha tudo

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Prêmio

    ctx.drawImage(
        imagemPremio,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Camada raspada

    ctx.drawImage(
        camadaCanvas,
        0,
        0
    );

}
