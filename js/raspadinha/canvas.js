/* ==========================================================
   RASPADINHA DA AMIZADE 3.0
   Canvas Definitivo
========================================================== */

import { obterImagemResultado } from "./resultado.js";

let canvas;
let ctx;

let raspando = false;
let eventosRegistrados = false;

// Imagens
const imagemPremio = new Image();
const imagemCamada = new Image();

// Canvas auxiliar para a camada raspável
let camadaCanvas;
let camadaCtx;
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

function carregar(img){

    return new Promise((resolve,reject)=>{

        if(img.complete && img.naturalWidth>0){

            resolve();

            return;

        }

        img.onload=resolve;

        img.onerror=reject;

    });

}

/* ==========================================================
   DESENHAR CAMADA
========================================================== */

function desenharCamada() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";

    if (imagemCamada.complete && imagemCamada.naturalWidth > 0) {

        ctx.drawImage(
            imagemCamada,
            0,
            0,
            canvas.width,
            canvas.height
        );

    } else {

        imagemCamada.onload = () => {

            ctx.drawImage(
                imagemCamada,
                0,
                0,
                canvas.width,
                canvas.height
            );

        };

    }

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    canvas.addEventListener("mousedown", iniciar);

    canvas.addEventListener("mousemove", moverMouse);

    canvas.addEventListener("mouseup", parar);

    canvas.addEventListener("mouseleave", parar);

    canvas.addEventListener("touchstart", iniciarTouch, {
        passive: false
    });

    canvas.addEventListener("touchmove", moverTouch, {
        passive: false
    });

    canvas.addEventListener("touchend", parar);

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

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

}
