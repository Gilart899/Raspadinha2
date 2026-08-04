/* ==========================================================
   RASPADINHA DA AMIZADE
   Canvas Engine 4.0
========================================================== */

import { CONFIG } from "../config.js";
import { obterImagemResultado } from "./resultado.js";

/* ==========================================================
   VARIÁVEIS
========================================================== */

let canvas = null;
let ctx = null;

let camadaCanvas = null;
let camadaCtx = null;

let imagemPremio = null;
let imagemCamada = null;

let largura = 380;
let altura = 380;

let raspando = false;
let finalizado = false;
let porcentagem = 0;

let eventosRegistrados = false;

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

export async function iniciarCanvas() {

    canvas = document.getElementById("canvasRaspadinha");

    if (!canvas) {
        throw new Error("Canvas não encontrado.");
    }

    ctx = canvas.getContext("2d");

    largura = CONFIG?.raspadinha?.largura || 380;
    altura = CONFIG?.raspadinha?.altura || 380;

    canvas.width = largura;
    canvas.height = altura;

    camadaCanvas = document.createElement("canvas");
    camadaCanvas.width = largura;
    camadaCanvas.height = altura;

    camadaCtx = camadaCanvas.getContext("2d");

    await carregarImagens();

    desenharPremio();

    desenharCamada();

    atualizarCanvas();

    if (!eventosRegistrados) {

        registrarEventos();

        eventosRegistrados = true;

    }

}

/* ==========================================================
   CARREGAR IMAGENS
========================================================== */

async function carregarImagens() {

    imagemPremio = new Image();

    imagemCamada = new Image();

    imagemPremio.src = obterImagemResultado();

    imagemCamada.src = "img/camada-raspadinha.png";

    await Promise.all([

        carregarImagem(imagemPremio),

        carregarImagem(imagemCamada)

    ]);

}

function carregarImagem(img) {

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
   DESENHAR PRÊMIO
========================================================== */

function desenharPremio() {

    ctx.clearRect(

        0,

        0,

        largura,

        altura

    );

    ctx.drawImage(

        imagemPremio,

        0,

        0,

        largura,

        altura

    );

}

/* ==========================================================
   CAMADA RASPÁVEL
========================================================== */

function desenharCamada() {

    camadaCtx.clearRect(

        0,

        0,

        largura,

        altura

    );

    camadaCtx.drawImage(

        imagemCamada,

        0,

        0,

        largura,

        altura

    );

}

/* ==========================================================
   ATUALIZAR CANVAS
========================================================== */

function atualizarCanvas() {

    desenharPremio();

    ctx.drawImage(

        camadaCanvas,

        0,

        0

    );

}

/* ==========================================================
   REGISTRAR EVENTOS
========================================================== */

function registrarEventos() {

    canvas.addEventListener("mousedown", iniciarRaspagem);
    canvas.addEventListener("mousemove", moverMouse);
    canvas.addEventListener("mouseup", finalizarRaspagem);
    canvas.addEventListener("mouseleave", finalizarRaspagem);

    canvas.addEventListener("touchstart", iniciarTouch, {
        passive: false
    });

    canvas.addEventListener("touchmove", moverTouch, {
        passive: false
    });

    canvas.addEventListener("touchend", finalizarRaspagem);

}

/* ==========================================================
   CONTROLE
========================================================== */

function iniciarRaspagem() {

    if (finalizado) return;

    raspando = true;

}

function iniciarTouch(e) {

    if (finalizado) return;

    e.preventDefault();

    raspando = true;

}

function finalizarRaspagem() {

    raspando = false;

}

/* ==========================================================
   MOUSE
========================================================== */

function moverMouse(e) {

    if (!raspando || finalizado) return;

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

    if (!raspando || finalizado) return;

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

    camadaCtx.globalCompositeOperation = "destination-out";

    camadaCtx.beginPath();

    camadaCtx.arc(

        x,

        y,

        CONFIG.raspadinha.raioRaspagem || 25,

        0,

        Math.PI * 2

    );

    camadaCtx.fill();

    camadaCtx.globalCompositeOperation = "source-over";

    atualizarCanvas();

}

/* ==========================================================
   REINICIAR
========================================================== */

export async function reiniciarCanvas() {

    raspando = false;

    finalizado = false;

    porcentagem = 0;

    await carregarImagens();

    desenharCamada();

    atualizarCanvas();

}

/* ==========================================================
   STATUS
========================================================== */

export function obterStatusCanvas() {

    return {

        largura,

        altura,

        porcentagem,

        raspando,

        finalizado

    };

}
