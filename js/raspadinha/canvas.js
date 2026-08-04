/* ==========================================================
   Canvas Engine 5.0
   Raspadinha Solidária
   Parte 1/3
========================================================== */

import { CONFIG } from "../config.js";
import { obterImagemResultado } from "./resultado.js";

export default class CanvasEngine {

    constructor(canvasId = "canvasRaspadinha") {

        this.canvasId = canvasId;

        this.canvas = null;
        this.ctx = null;

        this.overlayCanvas = null;
        this.overlayCtx = null;

        this.width = CONFIG?.raspadinha?.largura || 380;
        this.height = CONFIG?.raspadinha?.altura || 380;

        this.prizeImage = null;
        this.coverImage = null;

        this.initialized = false;

        this.isDrawing = false;
        this.isFinished = false;

        this.percent = 0;

        this.brushRadius =
            CONFIG?.raspadinha?.raioRaspagem || 28;

        this.animationFrame = null;

    }

    /* ======================================================
       INICIAR
    ====================================================== */

    async iniciar() {

        this.canvas =
            document.getElementById(this.canvasId);

        if (!this.canvas) {

            throw new Error(
                "Canvas não encontrado."
            );

        }

        this.ctx =
            this.canvas.getContext("2d");

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.criarCamada();

        await this.carregarImagens();

        this.desenharInicial();

        this.registrarEventos();

        this.loop();

        this.initialized = true;

    }

    /* ======================================================
       CAMADA
    ====================================================== */

    criarCamada() {

        this.overlayCanvas =
            document.createElement("canvas");

        this.overlayCanvas.width =
            this.width;

        this.overlayCanvas.height =
            this.height;

        this.overlayCtx =
            this.overlayCanvas.getContext("2d");

    }

    /* ======================================================
       IMAGENS
    ====================================================== */

    async carregarImagens() {

        this.prizeImage =
            new Image();

        this.coverImage =
            new Image();

        this.prizeImage.src =
            obterImagemResultado();

        this.coverImage.src =
            "img/camada-raspadinha.png";

        await Promise.all([

            this.carregarImagem(
                this.prizeImage
            ),

            this.carregarImagem(
                this.coverImage
            )

        ]);

    }

    carregarImagem(img) {

        return new Promise((resolve, reject) => {

            if (
                img.complete &&
                img.naturalWidth > 0
            ) {

                resolve();
                return;

            }

            img.onload = resolve;
            img.onerror = reject;

        });

    }

    /* ======================================================
       DESENHO INICIAL
    ====================================================== */

    desenharInicial() {

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.ctx.drawImage(

            this.prizeImage,

            0,
            0,

            this.width,
            this.height

        );

        this.overlayCtx.clearRect(

            0,
            0,

            this.width,
            this.height

        );

        this.overlayCtx.drawImage(

            this.coverImage,

            0,
            0,

            this.width,
            this.height

        );

        this.renderizar();

    }

    /* ======================================================
       LOOP
    ====================================================== */

    loop() {

        this.renderizar();

        this.animationFrame =
            requestAnimationFrame(

                () => this.loop()

            );

    }

    /* ======================================================
       RENDERIZAÇÃO
    ====================================================== */

    renderizar() {

        this.ctx.clearRect(

            0,

            0,

            this.width,

            this.height

        );

        this.ctx.drawImage(

            this.prizeImage,

            0,

            0,

            this.width,

            this.height

        );

        this.ctx.drawImage(

            this.overlayCanvas,

            0,

            0

        );

    }
    
        /* ======================================================
       REGISTRAR EVENTOS
    ====================================================== */

    registrarEventos() {

        this.canvas.addEventListener(
            "mousedown",
            this.iniciarMouse.bind(this)
        );

        this.canvas.addEventListener(
            "mousemove",
            this.moverMouse.bind(this)
        );

        window.addEventListener(
            "mouseup",
            this.finalizar.bind(this)
        );

        this.canvas.addEventListener(
            "touchstart",
            this.iniciarTouch.bind(this),
            { passive: false }
        );

        this.canvas.addEventListener(
            "touchmove",
            this.moverTouch.bind(this),
            { passive: false }
        );

        window.addEventListener(
            "touchend",
            this.finalizar.bind(this)
        );

    }

    /* ======================================================
       MOUSE
    ====================================================== */

    iniciarMouse(e) {

        if (this.isFinished) return;

        this.isDrawing = true;

        this.rasparEvento(e);

    }

    moverMouse(e) {

        if (!this.isDrawing) return;

        this.rasparEvento(e);

    }

    /* ======================================================
       TOUCH
    ====================================================== */

    iniciarTouch(e) {

        if (this.isFinished) return;

        e.preventDefault();

        this.isDrawing = true;

        this.rasparEvento(e.touches[0]);

    }

    moverTouch(e) {

        if (!this.isDrawing) return;

        e.preventDefault();

        this.rasparEvento(e.touches[0]);

    }

    /* ======================================================
       FINALIZAR
    ====================================================== */

    finalizar() {

        this.isDrawing = false;

    }

    /* ======================================================
       CONVERTER COORDENADAS
    ====================================================== */

    obterPosicao(evento) {

        const rect =
            this.canvas.getBoundingClientRect();

        return {

            x: evento.clientX - rect.left,

            y: evento.clientY - rect.top

        };

    }

    /* ======================================================
       PROCESSAR EVENTO
    ====================================================== */

    rasparEvento(evento) {

        const pos =
            this.obterPosicao(evento);

        this.raspar(

            pos.x,

            pos.y

        );

    }

    /* ======================================================
       RASPAR
    ====================================================== */

    raspar(x, y) {

        if (this.isFinished) return;

        this.overlayCtx.save();

        this.overlayCtx.globalCompositeOperation =
            "destination-out";

        this.overlayCtx.beginPath();

        this.overlayCtx.arc(

            x,

            y,

            this.brushRadius,

            0,

            Math.PI * 2

        );

        this.overlayCtx.fill();

        this.overlayCtx.restore();

        this.calcularPorcentagem();

    }
    
        /* ======================================================
       CALCULAR PORCENTAGEM RASPADA
    ====================================================== */

    calcularPorcentagem() {

        const dados = this.overlayCtx.getImageData(
            0,
            0,
            this.width,
            this.height
        );

        const pixels = dados.data;

        let transparentes = 0;

        for (let i = 3; i < pixels.length; i += 4) {

            if (pixels[i] === 0) {
                transparentes++;
            }

        }

        this.percent = Math.round(
            (transparentes / (this.width * this.height)) * 100
        );

        const limite =
            CONFIG?.raspadinha?.porcentagemRevelacao || 60;

        if (
            this.percent >= limite &&
            !this.isFinished
        ) {

            this.revelarPremio();

        }

    }

    /* ======================================================
       REVELAR PRÊMIO
    ====================================================== */

    revelarPremio() {

        this.isFinished = true;

        this.overlayCtx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.renderizar();

        if (
            typeof CONFIG?.raspadinha?.aoRevelar === "function"
        ) {

            CONFIG.raspadinha.aoRevelar();

        }

    }

    /* ======================================================
       REINICIAR
    ====================================================== */

    async reiniciar() {

        this.isDrawing = false;
        this.isFinished = false;
        this.percent = 0;

        await this.carregarImagens();

        this.desenharInicial();

    }

    /* ======================================================
       DESTRUIR
    ====================================================== */

    destruir() {

        cancelAnimationFrame(
            this.animationFrame
        );

        this.canvas = null;
        this.ctx = null;

        this.overlayCanvas = null;
        this.overlayCtx = null;

    }

    /* ======================================================
       GETTERS
    ====================================================== */

    get porcentagem() {

        return this.percent;

    }

    get finalizado() {

        return this.isFinished;

    }

    get raspando() {

        return this.isDrawing;

    }

}
/* ==========================================================
   FIM DO Canvas Engine 5.0
========================================================== */    /* ======================================================
       CALCULAR PORCENTAGEM RASPADA
    ====================================================== */

    calcularPorcentagem() {

        const dados = this.overlayCtx.getImageData(
            0,
            0,
            this.width,
            this.height
        );

        const pixels = dados.data;

        let transparentes = 0;

        for (let i = 3; i < pixels.length; i += 4) {

            if (pixels[i] === 0) {
                transparentes++;
            }

        }

        this.percent = Math.round(
            (transparentes / (this.width * this.height)) * 100
        );

        const limite =
            CONFIG?.raspadinha?.porcentagemRevelacao || 60;

        if (
            this.percent >= limite &&
            !this.isFinished
        ) {

            this.revelarPremio();

        }

    }

    /* ======================================================
       REVELAR PRÊMIO
    ====================================================== */

    revelarPremio() {

        this.isFinished = true;

        this.overlayCtx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.renderizar();

        if (
            typeof CONFIG?.raspadinha?.aoRevelar === "function"
        ) {

            CONFIG.raspadinha.aoRevelar();

        }

    }

    /* ======================================================
       REINICIAR
    ====================================================== */

    async reiniciar() {

        this.isDrawing = false;
        this.isFinished = false;
        this.percent = 0;

        await this.carregarImagens();

        this.desenharInicial();

    }

    /* ======================================================
       DESTRUIR
    ====================================================== */

    destruir() {

        cancelAnimationFrame(
            this.animationFrame
        );

        this.canvas = null;
        this.ctx = null;

        this.overlayCanvas = null;
        this.overlayCtx = null;

    }

    /* ======================================================
       GETTERS
    ====================================================== */

    get porcentagem() {

        return this.percent;

    }

    get finalizado() {

        return this.isFinished;

    }

    get raspando() {

        return this.isDrawing;

    }

}
/* ==========================================================
   FIM DO Canvas Engine 5.0
=====================
