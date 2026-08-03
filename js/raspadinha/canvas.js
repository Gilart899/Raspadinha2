<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    <meta name="theme-color"
        content="#0B7D2B">

    <meta name="description"
        content="Raspadinha da Amizade 2.0">

    <title>🍀 Raspadinha da Amizade</title>

    <link rel="stylesheet"
        href="css/style.css">

</head>

<body>

    <!-- =====================================================
         CABEÇALHO
    ====================================================== -->

    <header class="topo">

        <img
            src="img/logo.png"
            alt="Logo"
            class="logo">

        <h1>

            🍀 RASPADINHA DA AMIZADE

        </h1>

        <p>

            Raspe e descubra se você ganhou!

        </p>

    </header>

    <!-- =====================================================
         PRÊMIOS
    ====================================================== -->

    <main>

        <section class="premios">

            <div class="premio">

                <img
                    src="img/ferro.png"
                    alt="Ferro Elétrico">

                <h2>Ferro Elétrico</h2>

            </div>

            <div class="ou">

                OU

            </div>

            <div class="premio">

                <img
                    src="img/liquidificador.png"
                    alt="Liquidificador">

                <h2>Liquidificador</h2>

            </div>

        </section>

        <!-- =====================================================
             BOTÃO
        ====================================================== -->

        <section class="acao">

            <button id="btnParticipar">

                🎁 RASPE E CONCORRA

            </button>

        </section>

    </main>

 <!-- =====================================================
     MODAL DA RASPADINHA
===================================================== -->

<div id="modalRaspadinha" class="modal hidden">

    <div class="janela">

        <h2>🍀 Boa sorte!</h2>

        <p>Raspe toda a área para descobrir seu prêmio.</p>

      <div class="areaRaspadinha">

    <canvas id="canvasRaspadinha"></canvas>

</div>

        <button id="btnFecharRaspadinha">

            Fechar

        </button>

    </div>

</div>
    
    <div id="statusSistema"></div>

    <script type="module"
        src="js/app.js"></script>

</body>

</html>

/* ==========================================================
   DESENHO INICIAL
========================================================== */

function desenharInicial() {

    // Limpa o canvas principal
    ctx.clearRect(0, 0, largura, altura);

    // Desenha o prêmio
    ctx.drawImage(
        premio,
        0,
        0,
        largura,
        altura
    );

    // Prepara a camada metálica
    camadaCtx.clearRect(0, 0, largura, altura);

    camadaCtx.drawImage(
        camada,
        0,
        0,
        largura,
        altura
    );

    // Coloca a camada sobre o prêmio
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

    /* Mouse */

    canvas.addEventListener("mousedown", iniciarRaspagem);

    canvas.addEventListener("mousemove", moverMouse);

    canvas.addEventListener("mouseup", pararRaspagem);

    canvas.addEventListener("mouseleave", pararRaspagem);

    /* Touch */

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
        pararRaspagem
    );

}

/* ==========================================================
   CONTROLE
========================================================== */

function iniciarRaspagem() {

    raspando = true;

}

function pararRaspagem() {

    raspando = false;

}

function iniciarTouch(e) {

    e.preventDefault();

    raspando = true;

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

    atualizarCanvas();

}

/* ==========================================================
   REDESENHAR
========================================================== */

function atualizarCanvas() {

    // Limpa o canvas principal

    ctx.clearRect(
        0,
        0,
        largura,
        altura
    );

    // Desenha novamente o prêmio

    ctx.drawImage(
        premio,
        0,
        0,
        largura,
        altura
    );

    // Desenha a camada metálica já raspada

    ctx.drawImage(
        camadaCanvas,
        0,
        0
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

    atualizarCanvas();

}

/* ==========================================================
   REDESENHAR
========================================================== */

function atualizarCanvas() {

    // Limpa o canvas principal

    ctx.clearRect(
        0,
        0,
        largura,
        altura
    );

    // Desenha novamente o prêmio

    ctx.drawImage(
        premio,
        0,
        0,
        largura,
        altura
    );

    // Desenha a camada metálica já raspada

    ctx.drawImage(
        camadaCanvas,
        0,
        0
    );

}
