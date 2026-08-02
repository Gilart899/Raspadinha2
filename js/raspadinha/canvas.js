/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Canvas
========================================================== */

import { obterImagemResultado } from "./resultado.js";

let canvas;
let ctx;

let raspando = false;
let eventosRegistrados = false;

const imagemResultado = new Image();
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

    await carregarImagens();

    if (!eventosRegistrados) {

        registrarEventos();

        eventosRegistrados = true;

    }

}

/* ==========================================================
   CARREGAR IMAGENS
========================================================== */

async function carregarImagens() {

    imagemResultado.src = obterImagemResultado();

    imagemCamada.src = "/Raspadinha2/img/camada-raspadinha.png";

    await Promise.all([
        esperarImagem(imagemResultado),
        esperarImagem(imagemCamada)
    ]);

    desenhar();

}

function esperarImagem(img) {

    return new Promise((resolve, reject) => {

        if (img.complete && img.naturalWidth > 0) {

            resolve();

            return;

        }

        img.onload = () => resolve();

        img.onerror = () => {

            console.error("Erro ao carregar:", img.src);

            reject();

        };

    });

}

/* ==========================================================
   DESENHAR
========================================================== */

function desenhar() {

    ctx.globalCompositeOperation = "source-over";

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // DESENHA O PRÊMIO
    ctx.drawImage(
        imagemResultado,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // DESENHA A CAMADA METÁLICA
    ctx.drawImage(
        imagemCamada,
        0,
        0,
        canvas.width,
        canvas.height
    );

    console.log("Resultado:", imagemResultado.src);

    console.log("Camada:", imagemCamada.src);

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    // Mouse

    canvas.addEventListener("mousedown", iniciar);

    canvas.addEventListener("mouseup", parar);

    canvas.addEventListener("mouseleave", parar);

    canvas.addEventListener("mousemove", moverMouse);

    // Touch

    canvas.addEventListener("touchstart", iniciarTouch);

    canvas.addEventListener("touchmove", moverTouch);

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
