/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   CANVAS ENGINE
   Motor visual da raspadinha
========================================================== */

import { CONFIG } from "../config.js";

import {
    obterImagemResultado
} from "./resultado.js";

/* ==========================================================
   CLASSE PRINCIPAL
========================================================== */

export default class CanvasEngine {

    constructor(
        canvasId = "canvasRaspadinha"
    ) {

        this.canvasId = canvasId;

        this.canvas = null;

        this.ctx = null;

        this.overlayCanvas = null;

        this.overlayCtx = null;

        /* --------------------------------------------------
           DIMENSÕES
        -------------------------------------------------- */

        this.width =
            Number(
                CONFIG?.raspadinha?.largura
            ) || 380;

        this.height =
            Number(
                CONFIG?.raspadinha?.altura
            ) || 380;

        /* --------------------------------------------------
           RASPAGEM
        -------------------------------------------------- */

        this.brushRadius =
            Number(
                CONFIG?.raspadinha
                    ?.raioRaspagem
            ) || 25;

        this.limiteRevelacao =
            Number(
                CONFIG?.raspadinha
                    ?.porcentagemRevelacao
            ) || 70;

        /* --------------------------------------------------
           IMAGENS
        -------------------------------------------------- */

        this.prizeImage = null;

        this.coverImage = null;

        /* --------------------------------------------------
           ESTADO
        -------------------------------------------------- */

        this.initialized = false;

        this.isDrawing = false;

        this.isFinished = false;

        this.percent = 0;

        this.animationFrame = null;

        /* --------------------------------------------------
           CONTROLE DE EVENTOS
        -------------------------------------------------- */

        this.eventosRegistrados = false;

    }

    /* ======================================================
       INICIAR
    ====================================================== */

    async iniciar() {

        if (this.initialized) {

            return;

        }

        this.canvas =
            document.getElementById(
                this.canvasId
            );

        if (!this.canvas) {

            throw new Error(
                `Canvas "${this.canvasId}" não encontrado.`
            );

        }

        this.ctx =
            this.canvas.getContext(
                "2d",
                {
                    alpha: false
                }
            );

        if (!this.ctx) {

            throw new Error(
                "Não foi possível criar o contexto do Canvas."
            );

        }

        /* --------------------------------------------------
           TAMANHO REAL
        -------------------------------------------------- */

        this.canvas.width =
            this.width;

        this.canvas.height =
            this.height;

        /* --------------------------------------------------
           CAMADA
        -------------------------------------------------- */

        this.criarCamada();

        /* --------------------------------------------------
           IMAGENS
        -------------------------------------------------- */

        await this.carregarImagens();

        /* --------------------------------------------------
           DESENHO
        -------------------------------------------------- */

        this.desenharInicial();

        /* --------------------------------------------------
           EVENTOS
        -------------------------------------------------- */

        this.registrarEventos();

        this.initialized = true;

    }

    /* ======================================================
       CRIAR CAMADA
    ====================================================== */

    criarCamada() {

        this.overlayCanvas =
            document.createElement(
                "canvas"
            );

        this.overlayCanvas.width =
            this.width;

        this.overlayCanvas.height =
            this.height;

        this.overlayCtx =
            this.overlayCanvas.getContext(
                "2d"
            );

    }

    /* ======================================================
       CARREGAR IMAGENS
    ====================================================== */

    async carregarImagens() {

        this.prizeImage =
            new Image();

        this.coverImage =
            new Image();

        this.prizeImage.src =
            obterImagemResultado();

        this.coverImage.src =
            CONFIG?.raspadinha?.camada ||
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

    /* ======================================================
       CARREGAR UMA IMAGEM
    ====================================================== */

    carregarImagem(
        imagem
    ) {

        return new Promise(
            (resolve, reject) => {

                if (
                    imagem.complete &&
                    imagem.naturalWidth > 0
                ) {

                    resolve();

                    return;

                }

                imagem.onload =
                    () => resolve();

                imagem.onerror =
                    () => reject(
                        new Error(
                            `Não foi possível carregar a imagem: ${imagem.src}`
                        )
                    );

            }
        );

    }

    /* ======================================================
       DESENHO INICIAL
    ====================================================== */

    desenharInicial() {

        if (
            !this.ctx ||
            !this.overlayCtx
        ) {

            return;

        }

        /* --------------------------------------------------
           LIMPAR
        -------------------------------------------------- */

        this.ctx.clearRect(

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

        /* --------------------------------------------------
           PRÊMIO
        -------------------------------------------------- */

        if (
            this.prizeImage &&
            this.prizeImage.naturalWidth
        ) {

            this.ctx.drawImage(

                this.prizeImage,

                0,
                0,

                this.width,
                this.height

            );

        }

        /* --------------------------------------------------
           COBERTURA
        -------------------------------------------------- */

        if (
            this.coverImage &&
            this.coverImage.naturalWidth
        ) {

            this.overlayCtx.drawImage(

                this.coverImage,

                0,
                0,

                this.width,
                this.height

            );

        } else {

            /*
             * Fallback caso a imagem da camada
             * ainda não esteja disponível.
             */

            this.criarCoberturaFallback();

        }

        this.percent = 0;

        this.isFinished = false;

        this.renderizar();

    }

    /* ======================================================
       COBERTURA FALLBACK
    ====================================================== */

    criarCoberturaFallback() {

        const ctx =
            this.overlayCtx;

        const gradiente =
            ctx.createLinearGradient(

                0,
                0,
                this.width,
                this.height

            );

        gradiente.addColorStop(
            0,
            "#d8d8d8"
        );

        gradiente.addColorStop(
            0.5,
            "#a9a9a9"
        );

        gradiente.addColorStop(
            1,
            "#d8d8d8"
        );

        ctx.fillStyle =
            gradiente;

        ctx.fillRect(

            0,
            0,
            this.width,
            this.height

        );

        ctx.fillStyle =
            "#555";

        ctx.font =
            "bold 26px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(

            "RASPE AQUI",

            this.width / 2,
            this.height / 2

        );

    }

    /* ======================================================
       RENDERIZAR
    ====================================================== */

    renderizar() {

        if (
            !this.ctx ||
            !this.canvas
        ) {

            return;

        }

        this.ctx.clearRect(

            0,
            0,
            this.width,
            this.height

        );

        /* --------------------------------------------------
           PRÊMIO
        -------------------------------------------------- */

        if (
            this.prizeImage &&
            this.prizeImage.naturalWidth
        ) {

            this.ctx.drawImage(

                this.prizeImage,

                0,
                0,

                this.width,
                this.height

            );

        }

        /* --------------------------------------------------
           COBERTURA
        -------------------------------------------------- */

        if (
            this.overlayCanvas
        ) {

            this.ctx.drawImage(

                this.overlayCanvas,

                0,
                0

            );

        }

    }

    /* ======================================================
       REGISTRAR EVENTOS
    ====================================================== */

    registrarEventos() {

        if (
            this.eventosRegistrados ||
            !this.canvas
        ) {

            return;

        }

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

            {
                passive: false
            }

        );

        this.canvas.addEventListener(

            "touchmove",

            this.moverTouch.bind(this),

            {
                passive: false
            }

        );

        window.addEventListener(

            "touchend",

            this.finalizar.bind(this)

        );

        this.eventosRegistrados =
            true;

    }

    /* ======================================================
       MOUSE — INICIAR
    ====================================================== */

    iniciarMouse(evento) {

        if (
            this.isFinished
        ) {

            return;

        }

        this.isDrawing =
            true;

        this.rasparEvento(
            evento
        );

    }

    /* ======================================================
       MOUSE — MOVER
    ====================================================== */

    moverMouse(evento) {

        if (
            !this.isDrawing ||
            this.isFinished
        ) {

            return;

        }

        this.rasparEvento(
            evento
        );

    }

    /* ======================================================
       TOUCH — INICIAR
    ====================================================== */

    iniciarTouch(evento) {

        if (
            this.isFinished
        ) {

            return;

        }

        evento.preventDefault();

        this.isDrawing =
            true;

        if (
            evento.touches.length
        ) {

            this.rasparEvento(
                evento.touches[0]
            );

        }

    }

    /* ======================================================
       TOUCH — MOVER
    ====================================================== */

    moverTouch(evento) {

        if (
            !this.isDrawing ||
            this.isFinished
        ) {

            return;

        }

        evento.preventDefault();

        if (
            evento.touches.length
        ) {

            this.rasparEvento(
                evento.touches[0]
            );

        }

    }

    /* ======================================================
       FINALIZAR
    ====================================================== */

    finalizar() {

        this.isDrawing =
            false;

    }

    /* ======================================================
       OBTER POSIÇÃO
    ====================================================== */

    obterPosicao(evento) {

        const rect =
            this.canvas
                .getBoundingClientRect();

        /*
         * Corrige a diferença entre o
         * tamanho visual e o tamanho real
         * do Canvas.
         */

        const escalaX =
            this.width /
            rect.width;

        const escalaY =
            this.height /
            rect.height;

        return {

            x:
                (evento.clientX -
                rect.left) *
                escalaX,

            y:
                (evento.clientY -
                rect.top) *
                escalaY

        };

    }

    /* ======================================================
       PROCESSAR EVENTO
    ====================================================== */

    rasparEvento(evento) {

        const posicao =
            this.obterPosicao(
                evento
            );

        this.raspar(

            posicao.x,
            posicao.y

        );

    }

    /* ======================================================
       RASPAR
    ====================================================== */

    raspar(
        x,
        y
    ) {

        if (
            this.isFinished ||
            !this.overlayCtx
        ) {

            return;

        }

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

        this.renderizar();

    }

    /* ======================================================
       CALCULAR PORCENTAGEM
    ====================================================== */

    calcularPorcentagem() {

        if (
            !this.overlayCtx
        ) {

            return 0;

        }

        const dados =
            this.overlayCtx.getImageData(

                0,
                0,

                this.width,
                this.height

            );

        const pixels =
            dados.data;

        let transparentes =
            0;

        /*
         * Analisa apenas o canal alpha.
         */

        for (
            let i = 3;
            i < pixels.length;
            i += 4
        ) {

            if (
                pixels[i] === 0
            ) {

                transparentes++;

            }

        }

        this.percent =
            Math.round(

                (
                    transparentes /
                    (
                        this.width *
                        this.height
                    )
                ) * 100

            );

        if (
            this.percent >=
            this.limiteRevelacao
        ) {

            this.revelarPremio();

        }

        return this.percent;

    }

    /* ======================================================
       REVELAR PRÊMIO
    ====================================================== */

    revelarPremio() {

        if (
            this.isFinished
        ) {

            return;

        }

        this.isFinished =
            true;

        this.isDrawing =
            false;

        /*
         * Remove toda a camada.
         */

        if (
            this.overlayCtx
        ) {

            this.overlayCtx.clearRect(

                0,
                0,

                this.width,
                this.height

            );

        }

        this.percent = 100;

        this.renderizar();

        /*
         * Evento opcional configurado
         * pelo aplicativo.
         */

        if (
            typeof CONFIG
                ?.raspadinha
                ?.aoRevelar ===
                "function"
        ) {

            try {

                CONFIG
                    .raspadinha
                    .aoRevelar();

            } catch (erro) {

                console.error(

                    "Erro no evento ao revelar:",

                    erro

                );

            }

        }

    }

    /* ======================================================
       REINICIAR
    ====================================================== */

    async reiniciar() {

        if (
            !this.canvas
        ) {

            return;

        }

        this.isDrawing =
            false;

        this.isFinished =
            false;

        this.percent =
            0;

        await this.carregarImagens();

        this.desenharInicial();

    }

    /* ======================================================
       DESTRUIR
    ====================================================== */

    destruir() {

        this.isDrawing =
            false;

        this.isFinished =
            true;

        if (
            this.animationFrame
        ) {

            cancelAnimationFrame(

                this.animationFrame

            );

            this.animationFrame =
                null;

        }

        this.canvas =
            null;

        this.ctx =
            null;

        this.overlayCanvas =
            null;

        this.overlayCtx =
            null;

        this.prizeImage =
            null;

        this.coverImage =
            null;

        this.initialized =
            false;

        this.eventosRegistrados =
            false;

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

    get inicializado() {

        return this.initialized;

    }

}

/* ==========================================================
   FIM DO CANVAS ENGINE 6.0
========================================================== */
