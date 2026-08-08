/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   CONTROLADOR PRINCIPAL DA RASPADINHA
========================================================== */

import CanvasEngine from "./canvas.js";

import {
    realizarSorteio,
    iniciarSorteio,
    definirNumero,
    obterNumero
} from "./sorteio.js";

import {
    obterResultado,
    obterImagemResultado,
    obterNomePremio,
    limparResultado,
    ganhouPremio
} from "./resultado.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

let modal = null;
let btnFechar = null;
let imagemPremio = null;
let textoPremio = null;
let numeroRifa = null;

/* ==========================================================
   MOTOR
========================================================== */

let canvasEngine = null;

/* ==========================================================
   ESTADO
========================================================== */

let inicializado = false;
let aberta = false;
let abrindo = false;
let eventosRegistrados = false;

/* ==========================================================
   INICIAR
========================================================== */

export async function iniciarRaspadinha() {

    if (inicializado) {
        return true;
    }

    /* ------------------------------------------------------
       LOCALIZAR ELEMENTOS
    ------------------------------------------------------ */

    modal = document.getElementById(
        "modalRaspadinha"
    );

    btnFechar = document.getElementById(
        "btnFecharRaspadinha"
    );

    imagemPremio = document.getElementById(
        "imagemPremio"
    );

    textoPremio = document.getElementById(
        "textoPremio"
    );

    numeroRifa = document.getElementById(
        "numeroRifa"
    );

    /* ------------------------------------------------------
       VALIDAR MODAL
    ------------------------------------------------------ */

    if (!modal) {

        throw new Error(
            'Elemento "#modalRaspadinha" não encontrado.'
        );

    }

    /* ------------------------------------------------------
       CRIAR CANVAS ENGINE
    ------------------------------------------------------ */

    canvasEngine = new CanvasEngine(
        "canvasRaspadinha"
    );

    await canvasEngine.iniciar();

    /* ------------------------------------------------------
       ESTADO INICIAL
    ------------------------------------------------------ */

    limparResultado();
    iniciarSorteio();

    atualizarInterface();

    /* ------------------------------------------------------
       EVENTOS
    ------------------------------------------------------ */

    registrarEventos();

    inicializado = true;

    return true;
}

/* ==========================================================
   REGISTRAR EVENTOS
========================================================== */

function registrarEventos() {

    if (eventosRegistrados) {
        return;
    }

    /* ------------------------------------------------------
       BOTÃO FECHAR
    ------------------------------------------------------ */

    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharRaspadinha
        );

    }

    /* ------------------------------------------------------
       CLIQUE FORA DO MODAL
    ------------------------------------------------------ */

    if (modal) {

        modal.addEventListener(
            "click",
            evento => {

                if (
                    evento.target === modal
                ) {

                    fecharRaspadinha();

                }

            }
        );

    }

    eventosRegistrados = true;
}

/* ==========================================================
   ABRIR RASPADINHA
========================================================== */

export async function abrirRaspadinha(
    numero = null
) {

    if (abrindo) {
        return false;
    }

    abrindo = true;

    try {

        /* --------------------------------------------------
           GARANTIR INICIALIZAÇÃO
        -------------------------------------------------- */

        if (!inicializado) {

            await iniciarRaspadinha();

        }

        /* --------------------------------------------------
           DEFINIR NÚMERO
        -------------------------------------------------- */

        if (
            numero !== null &&
            numero !== undefined &&
            numero !== ""
        ) {

            definirNumero(numero);

        }

        const numeroAtual =
            obterNumero();

        /* --------------------------------------------------
           VALIDAR NÚMERO
        -------------------------------------------------- */

        if (!numeroAtual) {

            throw new Error(
                "Número da rifa não informado."
            );

        }

        /* --------------------------------------------------
           LIMPAR RESULTADO ANTERIOR
        -------------------------------------------------- */

        limparResultado();

        iniciarSorteio();

        /* --------------------------------------------------
           REALIZAR SORTEIO OFICIAL
        -------------------------------------------------- */

        const resultado =
            await realizarSorteio(
                numeroAtual
            );

        console.log(
            "Resultado da raspadinha:",
            resultado
        );

        /* --------------------------------------------------
           ATUALIZAR INTERFACE
        -------------------------------------------------- */

        atualizarInterface();

        /* --------------------------------------------------
           REINICIAR CANVAS
        -------------------------------------------------- */

        if (canvasEngine) {

            await canvasEngine.reiniciar();

        }

        /* --------------------------------------------------
           MOSTRAR MODAL
        -------------------------------------------------- */

        mostrarModal();

        return resultado;

    } catch (erro) {

        console.error(
            "Erro ao abrir raspadinha:",
            erro
        );

        /*
         * O erro é mostrado ao usuário.
         * Não transformamos erro de Firebase
         * em uma derrota falsa.
         */

        alert(
            erro?.message ||
            "Não foi possível abrir a raspadinha."
        );

        return false;

    } finally {

        abrindo = false;

    }
}

/* ==========================================================
   ATUALIZAR IMAGEM
========================================================== */

function atualizarImagemPremio() {

    if (!imagemPremio) {
        return;
    }

    const imagem =
        obterImagemResultado();

    if (!imagem) {
        return;
    }

    imagemPremio.src = imagem;

    imagemPremio.alt =
        obterNomePremio();
}

/* ==========================================================
   ATUALIZAR INTERFACE
========================================================== */

function atualizarInterface() {

    const resultado =
        obterResultado();

    const premio =
        obterNomePremio();

    /* ------------------------------------------------------
       NÚMERO
    ------------------------------------------------------ */

    if (numeroRifa) {

        numeroRifa.textContent =
            obterNumero() ||
            "Não informado";

    }

    /* ------------------------------------------------------
       PRÊMIO
    ------------------------------------------------------ */

    if (textoPremio) {

        textoPremio.textContent =
            premio;

    }

    /* ------------------------------------------------------
       IMAGEM
    ------------------------------------------------------ */

    atualizarImagemPremio();

    /* ------------------------------------------------------
       LOG
    ------------------------------------------------------ */

    console.log(
        "Status da raspadinha:",
        {
            numero: obterNumero(),
            resultado,
            premio,
            ganhou: ganhouPremio()
        }
    );
}

/* ==========================================================
   FECHAR RASPADINHA
========================================================== */

export function fecharRaspadinha() {

    if (!modal) {
        return;
    }

    modal.classList.add(
        "hidden"
    );

    modal.style.display =
        "none";

    aberta = false;

    console.log(
        "Raspadinha fechada."
    );
}

/* ==========================================================
   MOSTRAR MODAL
========================================================== */

export function mostrarModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "hidden"
    );

    modal.style.display =
        "flex";

    aberta = true;
}

/* ==========================================================
   OCULTAR MODAL
========================================================== */

export function ocultarModal() {

    fecharRaspadinha();

}

/* ==========================================================
   REINICIAR RASPADINHA
========================================================== */

export async function reiniciarRaspadinha() {

    if (!canvasEngine) {
        return false;
    }

    limparResultado();

    iniciarSorteio();

    atualizarInterface();

    await canvasEngine.reiniciar();

    return true;
}

/* ==========================================================
   OBTER MOTOR
========================================================== */

export function obterCanvasEngine() {

    return canvasEngine;

}

/* ==========================================================
   VERIFICAR SE ESTÁ ABERTA
========================================================== */

export function raspadinhaAberta() {

    return aberta;

}

/* ==========================================================
   VERIFICAR INICIALIZAÇÃO
========================================================== */

export function raspadinhaInicializada() {

    return inicializado;

}

/* ==========================================================
   OBTER STATUS
========================================================== */

export function obterStatusRaspadinha() {

    return {

        inicializado,

        aberta,

        abrindo,

        numero:
            obterNumero(),

        resultado:
            obterResultado(),

        premio:
            obterNomePremio(),

        ganhou:
            ganhouPremio(),

        porcentagem:
            canvasEngine
                ? canvasEngine.porcentagem
                : 0,

        finalizado:
            canvasEngine
                ? canvasEngine.finalizado
                : false

    };
}

/* ==========================================================
   DESTRUIR
========================================================== */

export function destruirRaspadinha() {

    if (canvasEngine) {

        canvasEngine.destruir();

        canvasEngine = null;

    }

    modal = null;
    btnFechar = null;
    imagemPremio = null;
    textoPremio = null;
    numeroRifa = null;

    inicializado = false;
    aberta = false;
    abrindo = false;
    eventosRegistrados = false;

    limparResultado();
    iniciarSorteio();

}

/* ==========================================================
   FIM DO CONTROLADOR
========================================================== */
