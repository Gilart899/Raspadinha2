/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   APP PRINCIPAL
========================================================== */

import { CONFIG } from "./config.js";

import {
    iniciarRaspadinha,
    abrirRaspadinha
} from "./raspadinha/raspadinha.js";

import {
    testarBanco,
    registrarSistemaOnline
} from "./firebase/firebase-raspadinha.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

let btnParticipar = null;

let statusSistema = null;

/* ==========================================================
   ESTADO
========================================================== */

let sistemaInicializado = false;

let inicializando = false;

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarSistema
);

/* ==========================================================
   INICIAR SISTEMA
========================================================== */

async function iniciarSistema() {

    if (
        sistemaInicializado ||
        inicializando
    ) {

        return;

    }

    inicializando = true;

    localizarElementos();

    escreverStatus(
        "Inicializando sistema..."
    );

    console.log(
        "=========================================="
    );

    console.log(
        "🍀 RASPADINHA DA AMIZADE"
    );

    console.log(
        "Versão:",
        CONFIG?.sistema?.versao ||
        "6.0"
    );

    console.log(
        "=========================================="
    );

    try {

        /* --------------------------------------------------
           FIREBASE
        -------------------------------------------------- */

        escreverStatus(
            "Conectando ao Firebase..."
        );

        const firebase =
            await testarBanco();

        if (
            !firebase ||
            !firebase.conectado
        ) {

            throw new Error(
                "Não foi possível conectar ao Firebase."
            );

        }

        console.log(
            "Firebase conectado."
        );

        /* --------------------------------------------------
           SISTEMA ONLINE
        -------------------------------------------------- */

        try {

            await registrarSistemaOnline();

        } catch (erro) {

            console.warn(

                "Não foi possível registrar sistema online:",

                erro

            );

        }

        /* --------------------------------------------------
           RASPADINHA
        -------------------------------------------------- */

        escreverStatus(
            "Preparando raspadinha..."
        );

        await iniciarRaspadinha();

        /* --------------------------------------------------
           EVENTOS
        -------------------------------------------------- */

        registrarEventos();

        /* --------------------------------------------------
           FINAL
        -------------------------------------------------- */

        sistemaInicializado =
            true;

        escreverStatus(
            "Sistema pronto. 🍀"
        );

        console.log(
            "Sistema iniciado com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao iniciar sistema:",
            erro
        );

        sistemaInicializado =
            false;

        escreverStatus(
            "Sistema indisponível."
        );

        mostrarErroInicializacao(
            erro
        );

    } finally {

        inicializando =
            false;

    }

}

/* ==========================================================
   LOCALIZAR ELEMENTOS
========================================================== */

function localizarElementos() {

    btnParticipar =
        document.getElementById(
            "btnParticipar"
        );

    statusSistema =
        document.getElementById(
            "statusSistema"
        );

    if (!btnParticipar) {

        console.warn(
            "Botão #btnParticipar não encontrado."
        );

    }

    if (!statusSistema) {

        console.warn(
            "Elemento #statusSistema não encontrado."
        );

    }

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    if (!btnParticipar) {

        return;

    }

    /*
     * Evita registrar o mesmo evento
     * mais de uma vez.
     */

    if (
        btnParticipar.dataset
            .eventoRegistrado ===
        "true"
    ) {

        return;

    }

    btnParticipar.addEventListener(

        "click",

        abrirSistemaRaspadinha

    );

    btnParticipar.dataset
        .eventoRegistrado =
        "true";

}

/* ==========================================================
   ABRIR RASPADINHA
========================================================== */

async function abrirSistemaRaspadinha() {

    if (!sistemaInicializado) {

        escreverStatus(
            "Sistema ainda não está pronto."
        );

        return;

    }

    try {

        bloquearBotao(
            true
        );

        escreverStatus(
            "Preparando sua raspadinha..."
        );

        /*
         * Por enquanto o sistema usa
         * o número que estiver disponível
         * no fluxo de participação.
         */

        const resultado =
            await abrirRaspadinha();

        if (
            resultado === false
        ) {

            escreverStatus(
                "Não foi possível abrir a raspadinha."
            );

            return;

        }

        escreverStatus(
            "Boa sorte! 🍀"
        );

    } catch (erro) {

        console.error(

            "Erro ao abrir raspadinha:",

            erro

        );

        escreverStatus(
            "Não foi possível abrir a raspadinha."
        );

        mostrarErro(
            erro
        );

    } finally {

        bloquearBotao(
            false
        );

    }

}

/* ==========================================================
   BLOQUEAR BOTÃO
========================================================== */

function bloquearBotao(
    bloquear
) {

    if (!btnParticipar) {

        return;

    }

    btnParticipar.disabled =
        Boolean(
            bloquear
        );

    if (bloquear) {

        btnParticipar.classList.add(
            "desabilitado"
        );

        btnParticipar.setAttribute(
            "aria-busy",
            "true"
        );

    } else {

        btnParticipar.classList.remove(
            "desabilitado"
        );

        btnParticipar.removeAttribute(
            "aria-busy"
        );

    }

}

/* ==========================================================
   STATUS
========================================================== */

function escreverStatus(
    texto
) {

    if (!statusSistema) {

        return;

    }

    statusSistema.textContent =
        texto;

}

/* ==========================================================
   ERRO DE INICIALIZAÇÃO
========================================================== */

function mostrarErroInicializacao(
    erro
) {

    console.error(
        "Falha de inicialização:",
        erro
    );

    /*
     * Não usamos alert automaticamente
     * para não deixar a página desagradável.
     */

}

/* ==========================================================
   ERRO DURANTE USO
========================================================== */

function mostrarErro(
    erro
) {

    const mensagem =
        erro?.message ||
        "Ocorreu um erro inesperado.";

    console.error(
        mensagem
    );

    /*
     * Mantemos a mensagem no status
     * em vez de abrir vários alertas.
     */

}

/* ==========================================================
   VERIFICAR SISTEMA
========================================================== */

export function sistemaPronto() {

    return sistemaInicializado;

}

/* ==========================================================
   OBTER CONFIGURAÇÃO
========================================================== */

export function obterConfiguracao() {

    return CONFIG;

}

/* ==========================================================
   OBTER STATUS
========================================================== */

export function obterStatusSistema() {

    return {

        inicializado:
            sistemaInicializado,

        inicializando:
            inicializando

    };

}

/* ==========================================================
   LOG
========================================================== */

console.log(
    "%c🍀 Raspadinha da Amizade 6.0",
    "color:#0B7D2B;font-size:16px;font-weight:bold;"
);

console.log(
    "App principal carregado."
);

/* ==========================================================
   FIM DO APP
========================================================== */
