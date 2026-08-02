/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Canvas
========================================================== */

import { obterImagemResultado } from "./resultado.js";

let canvas;
let ctx;

let raspando = false;
let eventosRegistrados = false;

const imagemCamada = new Image();
const imagemResultado = new Image();

/* ==========================================================
   INICIAR
========================================================== */

export function iniciarCanvas() {

    canvas = document.getElementById("canvasRaspadinha");

    if (!canvas) {

        console.error("Canvas não encontrado.");

        return;

    }

    ctx = canvas.getContext("2d");

    canvas.width = 380;
    canvas.height = 380;

    carregarImagens();

}

/* ==========================================================
   CARREGAR IMAGENS
========================================================== */

function carregarImagens() {

    imagemResultado.src = obterImagemResultado();

    imagemCamada.src = "/Raspadinha2/img/camada-raspadinha.png";

    Promise.all([
        carregar(imagemResultado),
        carregar(imagemCamada)
    ]).then(() => {

        desenhar();

        if (!eventosRegistrados) {

            registrarEventos();

            eventosRegistrados = true;

        }

    });

}

function carregar(imagem) {

    return new Promise((resolve) => {

        if (imagem.complete && imagem.naturalWidth > 0) {

            resolve();

            return;

        }

        imagem.onload = resolve;

    });

}

/* ==========================================================
   DESENHAR
========================================================== */

function desenhar() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        imagemResultado,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        imagemCamada,
        0,
        0,
        canvas.width,
        canvas.height
    );

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    canvas.addEventListener("mousedown", () => raspando = true);

    canvas.addEventListener("mouseup", () => raspando = false);

    canvas.addEventListener("mouseleave", () => raspando = false);

    canvas.addEventListener("mousemove", moverMouse);

    canvas.addEventListener("touchstart", iniciarTouch);

    canvas.addEventListener("touchmove", moverTouch);

    canvas.addEventListener("touchend", () => raspando = false);

}

/* ==========================================================
   TOUCH
========================================================== */

function iniciarTouch(e) {

    e.preventDefault();

    raspando = true;

}

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
