/* ==========================================================
   RIFA SOLIDÁRIA 3.0
   Canvas Engine 5.0
========================================================== */

import { CONFIG } from "../config.js";
import { obterImagemResultado } from "./resultado.js";

/* ==========================================================
   VARIÁVEIS
========================================================== */

let canvas;
let ctx;

let camadaCanvas;
let camadaCtx;

let largura = 0;
let altura = 0;

let raspando = false;
let finalizado = false;
let porcentagem = 0;

let eventosRegistrados = false;

/* ==========================================================
   IMAGENS
========================================================== */

const imagemPremio = new Image();
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

    largura = CONFIG.raspadinha.largura;
    altura = CONFIG.raspadinha.altura;

    canvas.width = largura;
    canvas.height = altura;

    camadaCanvas = document.createElement("canvas");

    camadaCanvas.width = largura;
    camadaCanvas.height = altura;

    camadaCtx = camadaCanvas.getContext("2d");

    raspando = false;
    finalizado = false;
    porcentagem = 0;

    await carregarImagens();

    desenharCamadaInicial();

    atualizarCanvas();

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

    imagemCamada.src = CONFIG.raspadinha.camada;

    await Promise.all([

        carregarImagem(imagemPremio),

        carregarImagem(imagemCamada)

    ]);

}

function carregarImagem(imagem){

    return new Promise((resolve,reject)=>{

        if(imagem.complete && imagem.naturalWidth>0){

            resolve();

            return;

        }

        imagem.onload=()=>resolve();

        imagem.onerror=()=>{

            console.error(

                "Erro ao carregar:",

                imagem.src

            );

            reject();

        };

    });

}

/* ==========================================================
   CAMADA
========================================================== */

function desenharCamadaInicial(){

    camadaCtx.clearRect(

        0,

        0,

        largura,

        altura

    );

    camadaCtx.drawImage(

        imagemCamada,

        0,

        0,

        largura,

        altura

    );

}

/* ==========================================================
   REDESENHAR
========================================================== */

function atualizarCanvas(){

    ctx.clearRect(

        0,

        0,

        largura,

        altura

    );

    // prêmio

    ctx.drawImage(

        imagemPremio,

        0,

        0,

        largura,

        altura

    );

    /* ==========================================================
   REGISTRAR EVENTOS
========================================================== */

function registrarEventos() {

    // Mouse
    canvas.addEventListener("mousedown", iniciarRaspagem);
    canvas.addEventListener("mousemove", moverMouse);
    canvas.addEventListener("mouseup", finalizarRaspagem);
    canvas.addEventListener("mouseleave", finalizarRaspagem);

    // Touch
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
        finalizarRaspagem
    );

}

/* ==========================================================
   CONTROLE
========================================================== */

function iniciarRaspagem() {

    if (finalizado) return;

    raspando = true;

}

function iniciarTouch(e) {

    if (finalizado) return;

    e.preventDefault();

    raspando = true;

}

function finalizarRaspagem() {

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

    camadaCtx.globalCompositeOperation = "destination-out";

    camadaCtx.beginPath();

    camadaCtx.arc(

        x,

        y,

        CONFIG.raspadinha.raioRaspagem,

        0,

        Math.PI * 2

    );

    camadaCtx.fill();

    camadaCtx.globalCompositeOperation = "source-over";

    atualizarCanvas();

    verificarPorcentagem();

}

    // camada raspável

    ctx.drawImage(

        camadaCanvas,

        0,

        0

    );

}

/* ==========================================================
   VERIFICAR PORCENTAGEM RASPADA
========================================================== */

function verificarPorcentagem() {

    if (finalizado) return;

    const dados = camadaCtx.getImageData(

        0,
        0,
        largura,
        altura

    ).data;

    let pixelsTransparentes = 0;
    const totalPixels = largura * altura;

    for (let i = 3; i < dados.length; i += 4) {

        if (dados[i] === 0) {

            pixelsTransparentes++;

        }

    }

    porcentagem = Math.round(

        (pixelsTransparentes / totalPixels) * 100

    );

    // Para testes
    console.log("Raspado:", porcentagem + "%");

    if (

        porcentagem >= CONFIG.raspadinha.porcentagemRevelacao

    ) {

        revelarPremio();

    }

}

/* ==========================================================
   REVELAR PRÊMIO
========================================================== */

function revelarPremio() {

    if (finalizado) return;

    finalizado = true;

    raspando = false;

    camadaCtx.clearRect(

        0,

        0,

        largura,

        altura

    );

    atualizarCanvas();

    console.log("🎉 Raspadinha concluída!");

    // Aqui serão chamados futuramente:
    //
    // tocarSom();
    // animacaoConfetes();
    // abrirFormulario();
    //
}

/* ==========================================================
   GETTERS
========================================================== */

export function obterPorcentagemRaspada() {

    return porcentagem;

}

export function raspadinhaFinalizada() {

    return finalizado;

}

/* ==========================================================
   FINALIZAÇÃO
========================================================== */

export function limparCanvas() {

    if (!camadaCtx) return;

    camadaCtx.clearRect(

        0,

        0,

        largura,

        altura

    );

    porcentagem = 0;

    raspando = false;

    finalizado = false;

}

/* ==========================================================
   REINICIAR RASPADINHA
========================================================== */

export async function reiniciarCanvas() {

    porcentagem = 0;

    raspando = false;

    finalizado = false;

    await carregarImagens();

    desenharCamadaInicial();

    atualizarCanvas();

}

/* ==========================================================
   REDIMENSIONAR
========================================================== */

export function redimensionarCanvas(

    novaLargura,

    novaAltura

) {

    largura = novaLargura;

    altura = novaAltura;

    canvas.width = largura;

    canvas.height = altura;

    camadaCanvas.width = largura;

    camadaCanvas.height = altura;

    desenharCamadaInicial();

    atualizarCanvas();

}

/* ==========================================================
   STATUS
========================================================== */

export function obterStatusCanvas() {

    return {

        largura,

        altura,

        raspando,

        porcentagem,

        finalizado

    };

}

/* ==========================================================
   CALLBACKS (Preparado para integração)
========================================================== */

let callbackFinalizacao = null;

export function definirCallbackFinalizacao(callback) {

    callbackFinalizacao = callback;

}

function executarCallbackFinalizacao() {

    if (typeof callbackFinalizacao === "function") {

        callbackFinalizacao({

            porcentagem,

            finalizado

        });

    }

}
