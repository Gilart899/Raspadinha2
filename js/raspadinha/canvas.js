/* ==========================================================
   CANVAS ENGINE 6.0
   RASPADINHA SOLIDÁRIA
========================================================== */

import { CONFIG } from "../config.js";
import { realizarSorteio } from "./sorteio.js";
import { obterImagemResultado } from "./resultado.js";

export default class CanvasEngine {

    constructor(canvasId = "canvasRaspadinha") {

        this.canvasId = canvasId;

        this.canvas = null;
        this.ctx = null;

        this.overlayCanvas = null;
        this.overlayCtx = null;

        this.width =
            CONFIG.raspadinha.largura || 380;

        this.height =
            CONFIG.raspadinha.altura || 380;

        this.coverImage = new Image();

        this.prizeImage = new Image();

        this.initialized = false;

        this.isDrawing = false;

        this.isFinished = false;

        this.percent = 0;

        this.brushRadius =
            CONFIG.raspadinha.raioRaspagem || 25;

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

        this.overlayCanvas =
            document.createElement("canvas");

        this.overlayCanvas.width =
            this.width;

        this.overlayCanvas.height =
            this.height;

        this.overlayCtx =
            this.overlayCanvas.getContext("2d");

        await this.carregarCamada();

        this.desenharCamada();

        this.registrarEventos();

        this.loop();

        this.initialized = true;

    }

    /* ======================================================
       CAMADA PRATEADA
    ====================================================== */

    async carregarCamada() {

        this.coverImage.src =
            CONFIG.raspadinha.camada;

        await new Promise((resolve, reject) => {

            this.coverImage.onload = resolve;

            this.coverImage.onerror = reject;

        });

    }

    desenharCamada() {

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

        this.ctx.clearRect(

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


       /* ======================================================
       LOOP DE RENDERIZAÇÃO
    ====================================================== */

    loop() {

        this.renderizar();

        this.animationFrame = requestAnimationFrame(

            () => this.loop()

        );

    }

    renderizar() {

        this.ctx.clearRect(

            0,

            0,

            this.width,

            this.height

        );

        if (this.prizeImage.complete) {

            this.ctx.drawImage(

                this.prizeImage,

                0,

                0,

                this.width,

                this.height

            );

        }

        this.ctx.drawImage(

            this.overlayCanvas,

            0,

            0

        );

    }

    /* ======================================================
       EVENTOS
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

            { passive:false }

        );

        this.canvas.addEventListener(

            "touchmove",

            this.moverTouch.bind(this),

            { passive:false }

        );

        window.addEventListener(

            "touchend",

            this.finalizar.bind(this)

        );

    }

    iniciarMouse(e){

        if(this.isFinished) return;

        this.isDrawing=true;

        this.rasparEvento(e);

    }

    moverMouse(e){

        if(!this.isDrawing) return;

        this.rasparEvento(e);

    }

    iniciarTouch(e){

        if(this.isFinished) return;

        e.preventDefault();

        this.isDrawing=true;

        this.rasparEvento(e.touches[0]);

    }

    moverTouch(e){

        if(!this.isDrawing) return;

        e.preventDefault();

        this.rasparEvento(e.touches[0]);

    }

    finalizar(){

        this.isDrawing=false;

    }

    /* ======================================================
       COORDENADAS
    ====================================================== */

    obterPosicao(evento){

        const rect=this.canvas.getBoundingClientRect();

        return{

            x:evento.clientX-rect.left,

            y:evento.clientY-rect.top

        };

    }

    rasparEvento(evento){

        const pos=this.obterPosicao(evento);

        this.raspar(

            pos.x,

            pos.y

        );

    }

    /* ======================================================
       RASPAR
    ====================================================== */

    raspar(x,y){

        if(this.isFinished) return;

        this.overlayCtx.save();

        this.overlayCtx.globalCompositeOperation="destination-out";

        this.overlayCtx.beginPath();

        this.overlayCtx.arc(

            x,

            y,

            this.brushRadius,

            0,

            Math.PI*2

        );

        this.overlayCtx.fill();

        this.overlayCtx.restore();

        this.calcularPorcentagem();

    }

    /* ======================================================
       PORCENTAGEM
    ====================================================== */

    calcularPorcentagem(){

        const dados=this.overlayCtx.getImageData(

            0,

            0,

            this.width,

            this.height

        );

        const pixels=dados.data;

        let transparentes=0;

        for(let i=3;i<pixels.length;i+=4){

            if(pixels[i]===0){

                transparentes++;

            }

        }

        this.percent=Math.round(

            (transparentes/(this.width*this.height))*100

        );

        const limite=

            CONFIG.raspadinha.porcentagemRevelacao||70;

        if(

            this.percent>=limite &&

            !this.isFinished

        ){

            this.revelarPremio();

        }

    }

       /* ======================================================
       REVELAR PRÊMIO
    ====================================================== */

    async revelarPremio() {

        if (this.isFinished) return;

        this.isFinished = true;

        try {

            // Realiza o sorteio somente agora
            await realizarSorteio();

            // Carrega a imagem do resultado
            this.prizeImage.src = obterImagemResultado();

            await new Promise((resolve, reject) => {

                this.prizeImage.onload = resolve;
                this.prizeImage.onerror = reject;

            });

        } catch (erro) {

            console.error(
                "Erro ao revelar prêmio:",
                erro
            );

        }

        // Remove totalmente a camada prateada
        this.overlayCtx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.renderizar();

        // Callback opcional
        if (
            typeof CONFIG.raspadinha.aoRevelar === "function"
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

        this.prizeImage = new Image();

        this.desenharCamada();

    }

    /* ======================================================
       DESTRUIR
    ====================================================== */

    destruir() {

        cancelAnimationFrame(this.animationFrame);

        this.canvas = null;
        this.ctx = null;

        this.overlayCanvas = null;
        this.overlayCtx = null;

        this.initialized = false;

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
   FIM DO CANVAS ENGINE 6.0
========================================================== */
