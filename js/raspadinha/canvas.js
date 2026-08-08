/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
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

        /* ==================================================
           DIMENSÕES
        ================================================== */

        this.width =
            Number(
                CONFIG?.raspadinha?.largura
            ) || 380;

        this.height =
            Number(
                CONFIG?.raspadinha?.altura
            ) || 380;


        /* ==================================================
           CONFIGURAÇÃO DA RASPAGEM
        ================================================== */

        this.brushRadius =
            Number(
                CONFIG?.raspadinha?.raioRaspagem
            ) || 28;

        this.limiteRevelacao =
            Number(
                CONFIG?.raspadinha?.porcentagemRevelacao
            ) || 70;


        /* ==================================================
           IMAGENS
        ================================================== */

        this.prizeImage = null;

        this.coverImage = null;


        /* ==================================================
           ESTADO
        ================================================== */

        this.initialized = false;

        this.isDrawing = false;

        this.isFinished = false;

        this.percent = 0;


        /* ==================================================
           CONTROLE DE EVENTOS
        ================================================== */

        this.eventosRegistrados = false;

        this.eventos = [];

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


        /* ==================================================
           TAMANHO REAL DO CANVAS
        ================================================== */

        this.canvas.width =
            this.width;

        this.canvas.height =
            this.height;


        /* ==================================================
           CRIAR CAMADA
        ================================================== */

        this.criarCamada();


        /* ==================================================
           CARREGAR IMAGENS
        ================================================== */

        await this.carregarImagens();


        /* ==================================================
           DESENHO INICIAL
        ================================================== */

        this.desenharInicial();


        /* ==================================================
           EVENTOS
        ================================================== */

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


        if (!this.overlayCtx) {

            throw new Error(
                "Não foi possível criar a camada da raspadinha."
            );

        }

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


        /*
         * Compatibilidade com o config.js 6.0:
         *
         * imagemCobertura
         */

        this.coverImage.src =
            CONFIG?.raspadinha?.imagemCobertura ||
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


        /* ==================================================
           LIMPAR CANVAS
        ================================================== */

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


        /* ==================================================
           DESENHAR PRÊMIO
        ================================================== */

        if (
            this.prizeImage &&
            this.prizeImage.naturalWidth > 0
        ) {

            this.ctx.drawImage(

                this.prizeImage,

                0,
                0,

                this.width,
                this.height

            );

        }


        /* ==================================================
           DESENHAR COBERTURA
        ================================================== */

        if (
            this.coverImage &&
            this.coverImage.naturalWidth > 0
        ) {

            this.overlayCtx.drawImage(

                this.coverImage,

                0,
                0,

                this.width,
                this.height

            );

        } else {

            this.criarCoberturaFallback();

        }


        this.percent = 0;

        this.isFinished = false;

        this.isDrawing = false;


        this.renderizar();

    }


    /* ======================================================
       COBERTURA FALLBACK
    ====================================================== */

    criarCoberturaFallback() {

        const ctx =
            this.overlayCtx;


        if (!ctx) return;


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


        /* ==================================================
           PRÊMIO
        ================================================== */

        if (
            this.prizeImage &&
            this.prizeImage.naturalWidth > 0
        ) {

            this.ctx.drawImage(

                this.prizeImage,

                0,
                0,

                this.width,
                this.height

            );

        }


        /* ==================================================
           COBERTURA
        ================================================== */

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


        const iniciarMouse =
            this.iniciarMouse.bind(this);


        const moverMouse =
            this.moverMouse.bind(this);


        const finalizar =
            this.finalizar.bind(this);


        const iniciarTouch =
            this.iniciarTouch.bind(this);


        const moverTouch =
            this.moverTouch.bind(this);


        const finalizarTouch =
            this.finalizar.bind(this);


        this.canvas.addEventListener(
            "mousedown",
            iniciarMouse
        );


        this.canvas.addEventListener(
            "mousemove",
            moverMouse
        );


        window.addEventListener(
            "mouseup",
            finalizar
        );


        this.canvas.addEventListener(
            "touchstart",
            iniciarTouch,
            {
                passive: false
            }
        );


        this.canvas.addEventListener(
            "touchmove",
            moverTouch,
            {
                passive: false
            }
        );


        window.addEventListener(
            "touchend",
            finalizarTouch
        );


        this.eventos = [

            {
                alvo: this.canvas,
                tipo: "mousedown",
                funcao: iniciarMouse
            },

            {
                alvo: this.canvas,
                tipo: "mousemove",
                funcao: moverMouse
            },

            {
                alvo: window,
                tipo: "mouseup",
                funcao: finalizar
            },

            {
                alvo: this.canvas,
                tipo: "touchstart",
                funcao: iniciarTouch
            },

            {
                alvo: this.canvas,
                tipo: "touchmove",
                funcao: moverTouch
            },

            {
                alvo: window,
                tipo: "touchend",
                funcao: finalizarTouch
            }

        ];


        this.eventosRegistrados =
            true;

    }


    /* ======================================================
       MOUSE — INICIAR
    ====================================================== */

    iniciarMouse(
        evento
    ) {

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

    moverMouse(
        evento
    ) {

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

    iniciarTouch(
        evento
    ) {

        if (
            this.isFinished
        ) {

            return;

        }


        evento.preventDefault();


        this.isDrawing =
            true;


        if (
            evento.touches &&
            evento.touches.length > 0
        ) {

            this.rasparEvento(

                evento.touches[0]

            );

        }

    }


    /* ======================================================
       TOUCH — MOVER
    ====================================================== */

    moverTouch(
        evento
    ) {

        if (
            !this.isDrawing ||
            this.isFinished
        ) {

            return;

        }


        evento.preventDefault();


        if (
            evento.touches &&
            evento.touches.length > 0
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

    obterPosicao(
        evento
    ) {

        if (
            !this.canvas
        ) {

            return {
                x: 0,
                y: 0
            };

        }


        const rect =
            this.canvas.getBoundingClientRect();


        if (
            !rect.width ||
            !rect.height
        ) {

            return {
                x: 0,
                y: 0
            };

        }


        const escalaX =
            this.width /
            rect.width;


        const escalaY =
            this.height /
            rect.height;


        return {

            x:
                (
                    evento.clientX -
                    rect.left
                ) *
                escalaX,


            y:
                (
                    evento.clientY -
                    rect.top
                ) *
                escalaY

        };

    }


    /* ======================================================
       PROCESSAR EVENTO
    ====================================================== */

    rasparEvento(
        evento
    ) {

        if (!evento) return;


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


        /* ==================================================
           REMOVER COBERTURA
        ================================================== */

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


        this.percent =
            100;


        this.renderizar();


        /* ==================================================
           EVENTO OPCIONAL
        ================================================== */

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

                    "Erro em CONFIG.raspadinha.aoRevelar:",
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


        /* ==================================================
           REMOVER EVENTOS
        ================================================== */

        if (
            Array.isArray(
                this.eventos
            )
        ) {

            for (
                const evento
                of this.eventos
            ) {

                try {

                    evento.alvo.removeEventListener(

                        evento.tipo,

                        evento.funcao

                    );

                } catch (erro) {

                    console.warn(
                        "Não foi possível remover evento:",
                        erro
                    );

                }

            }

        }


        this.eventos =
            [];


        this.eventosRegistrados =
            false;


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
