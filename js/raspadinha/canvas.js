/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Canvas
========================================================== */

let canvas;
let ctx;

let raspando = false;
let eventosRegistrados = false;

/* ==========================================================
   IMAGEM DA CAMADA
========================================================== */

const imagemCamada = new Image();

// Caminho correto para o GitHub Pages
imagemCamada.src = "../../img/camada-raspadinha.png";

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

    desenharCamada();

    if (!eventosRegistrados) {

        eventos();

        eventosRegistrados = true;

    }

}

/* ==========================================================
   DESENHAR CAMADA
========================================================== */

function desenharCamada() {

    ctx.globalCompositeOperation = "source-over";

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (imagemCamada.complete && imagemCamada.naturalWidth > 0) {

        ctx.drawImage(
            imagemCamada,
            0,
            0,
            canvas.width,
            canvas.height
        );

    } else {

        imagemCamada.onload = desenharCamada;

    }

}

/* ==========================================================
   EVENTOS
========================================================== */

function eventos() {

    /* Mouse */

    canvas.addEventListener("mousedown", iniciar);

    canvas.addEventListener("mouseup", parar);

    canvas.addEventListener("mouseleave", parar);

    canvas.addEventListener("mousemove", moverMouse);

    /* Touch */

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

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    raspar(x, y);

}

/* ==========================================================
   TOUCH
========================================================== */

function moverTouch(e) {

    if (!raspando) return;

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
