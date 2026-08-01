/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Canvas
========================================================== */

let canvas;
let ctx;

let raspando = false;

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

    eventos();

}

/* ==========================================================
   CAMADA CINZA
========================================================== */

function desenharCamada() {

    ctx.fillStyle = "#C8C8C8";

    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

}

/* ==========================================================
   EVENTOS
========================================================== */

function eventos() {

    canvas.addEventListener("mousedown", iniciar);

    canvas.addEventListener("mouseup", parar);

    canvas.addEventListener("mouseleave", parar);

    canvas.addEventListener("mousemove", mover);

}

/* ==========================================================
   CONTROLE
========================================================== */

function iniciar() {

    raspando = true;

}

function parar() {

    raspando = false;

}

function mover(e) {

    if (!raspando) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

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
