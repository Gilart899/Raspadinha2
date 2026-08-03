/* ==========================================================
   RASPADINHA DA AMIZADE 3.0
   Canvas Engine
========================================================== */

import { CONFIG } from "../config.js";
import {
    obterImagemResultado
} from "./resultado.js";

/* ==========================================================
   VARIÁVEIS
========================================================== */

let canvas;
let ctx;

let camadaCanvas;
let camadaCtx;

let largura;
let altura;

let raspando = false;
let finalizado = false;

let porcentagem = 0;

let eventosRegistrados = false;

/* ==========================================================
   IMAGENS
========================================================== */

const imagemPremio = new Image();
const imagemCamada = new Image();

/* ==========================================================
   INICIAR
========================================================== */

export async function iniciarCanvas() {

    canvas = document.getElementById(
        "canvasRaspadinha"
    );

    if (!canvas) {

        console.error(
            "Canvas não encontrado."
        );

        return;

    }

    ctx = canvas.getContext("2d");

    largura = CONFIG.raspadinha.largura;
    altura = CONFIG.raspadinha.altura;

    canvas.width = largura;
    canvas.height = altura;

    camadaCanvas = document.createElement(
        "canvas"
    );

    camadaCanvas.width = largura;
    camadaCanvas.height = altura;

    camadaCtx = camadaCanvas.getContext("2d");

    await carregarImagens();

    desenharCamada();

    atualizarCanvas();

    if (!eventosRegistrados) {

        registrarEventos();

        eventosRegistrados = true;

    }

}

/* ==========================================================
   DESENHAR CAMADA
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

    ctx.clearRect(

        0,

        0,

        largura,

        altura

    );

    // Desenha o prêmio

    ctx.drawImage(

        imagemPremio,

        0,

        0,

        largura,

        altura

    );

    // Desenha a camada metálica

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

    // Mouse

    canvas.addEventListener(

        "mousedown",

        iniciarRaspagem

    );

    canvas.addEventListener(

        "mousemove",

        moverMouse

    );

    canvas.addEventListener(

        "mouseup",

        finalizarRaspagem

    );

    canvas.addEventListener(

        "mouseleave",

        finalizarRaspagem

    );

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

        finalizarRaspagem

    );

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

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    raspar(x, y);

}

/* ==========================================================
   TOUCH
========================================================== */

function moverTouch(e) {

    if (!raspando || finalizado) return;

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const toque = e.touches[0];

    const x = toque.clientX - rect.left;

    const y = toque.clientY - rect.top;

    raspar(x, y);

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

        CONFIG.raspadinha.raioRaspagem,

        0,

        Math.PI * 2

    );

    camadaCtx.fill();

    camadaCtx.globalCompositeOperation = "source-over";

    atualizarCanvas();

    verificarPorcentagem();

}

/* ==========================================================
   VERIFICAR PORCENTAGEM RASPADA
========================================================== */

function verificarPorcentagem() {

    if (finalizado) return;

    const imagem = camadaCtx.getImageData(

        0,

        0,

        largura,

        altura

    );

    const pixels = imagem.data;

    let transparentes = 0;

    const total = largura * altura;

    for (

        let i = 3;

        i < pixels.length;

        i += 4

    ) {

        if (pixels[i] === 0) {

            transparentes++;

        }

    }

    porcentagem = Math.round(

        (transparentes / total) * 100

    );

    if (

        porcentagem >=

        CONFIG.raspadinha.porcentagemRevelacao

    ) {

        revelarPremio();

    }

}
