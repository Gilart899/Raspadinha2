/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   APP PRINCIPAL
   Controlador geral da aplicação
   ========================================================== */

import { CONFIG } from "./config.js";

import {
    iniciarRaspadinha,
    abrirRaspadinha,
    raspadinhaInicializada
} from "./raspadinha/raspadinha.js";

import {
    testarBanco,
    registrarSistemaOnline,
    buscarCampanha
} from "./firebase/firebase-raspadinha.js";

/* ==========================================================
   ESTADO GLOBAL
   ========================================================== */

let sistemaInicializado = false;
let firebaseConectado = false;
let campanhaCarregada = false;
let inicializando = false;

/* ==========================================================
   ELEMENTOS DA INTERFACE
   ========================================================== */

let btnParticipar = null;
let statusSistema = null;

let numeroRifaInput = null;
let numeroRifaDisplay = null;

let premioPrincipal = null;
let premioSecundario = null;
let dataSorteio = null;
let resultadoSorteio = null;

/* ==========================================================
   INICIALIZAÇÃO DOM
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarSistema
);

/* ==========================================================
   INICIAR SISTEMA
   ========================================================== */

async function iniciarSistema() {

    if (sistemaInicializado || inicializando) {

        return;

    }

    inicializando = true;

    escreverStatus(
        "Inicializando sistema..."
    );

    console.log(
        "========================================"
    );

    console.log(
        "RASPADINHA DA AMIZADE"
    );

    console.log(
        "Versão:",
        CONFIG?.sistema?.versao || "6.0"
    );

    console.log(
        "========================================"
    );

    try {

        /* --------------------------------------------------
           LOCALIZAR ELEMENTOS
        -------------------------------------------------- */

        localizarElementos();

        /* --------------------------------------------------
           VALIDAR CONFIGURAÇÃO
        -------------------------------------------------- */

        validarConfiguracao();

        /* --------------------------------------------------
           TESTAR FIREBASE
        -------------------------------------------------- */

        escreverStatus(
            "Conectando ao sistema..."
        );

        const banco =
            await testarBanco();

        if (
            !banco ||
            banco.conectado !== true
        ) {

            throw new Error(
                "Não foi possível conectar ao Firebase."
            );

        }

        firebaseConectado = true;

        console.log(
            "Firebase conectado."
        );

        /* --------------------------------------------------
           REGISTRAR SISTEMA ONLINE
        -------------------------------------------------- */

        try {

            await registrarSistemaOnline();

        } catch (erro) {

            /*
             * O sistema já conseguiu ler o banco.
             * Portanto, uma falha apenas ao registrar
             * o status online não deve impedir a aplicação.
             */

            console.warn(
                "Não foi possível registrar sistema online:",
                erro
            );

        }

        /* --------------------------------------------------
           CARREGAR CAMPANHA
        -------------------------------------------------- */

        await carregarCampanha();

        /* --------------------------------------------------
           INICIAR RASPADINHA
        -------------------------------------------------- */

        escreverStatus(
            "Preparando raspadinha..."
        );

        await iniciarRaspadinha();

        /* --------------------------------------------------
           REGISTRAR EVENTOS
        -------------------------------------------------- */

        registrarEventos();

        /* --------------------------------------------------
           ESTADO FINAL
        -------------------------------------------------- */

        sistemaInicializado = true;

        escreverStatus(
            "Sistema pronto."
        );

        console.log(
            "Raspadinha inicializada:",
            raspadinhaInicializada()
        );

    } catch (erro) {

        console.error(
            "Erro ao iniciar sistema:",
            erro
        );

        sistemaInicializado = false;

        escreverStatus(
            erro?.message ||
            "Sistema indisponível."
        );

    } finally {

        inicializando = false;

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

    numeroRifaInput =
        document.getElementById(
            "numeroRifaInput"
        );

    /*
     * Compatibilidade com outro nome de ID.
     */

    if (!numeroRifaInput) {

        numeroRifaInput =
            document.getElementById(
                "numeroRifa"
            );

    }

    numeroRifaDisplay =
        document.getElementById(
            "numeroRifa"
        );

    premioPrincipal =
        document.getElementById(
            "premioPrincipal"
        );

    premioSecundario =
        document.getElementById(
            "premioSecundario"
        );

    dataSorteio =
        document.getElementById(
            "dataSorteio"
        );

    resultadoSorteio =
        document.getElementById(
            "resultadoSorteio"
        );

}

/* ==========================================================
   VALIDAR CONFIGURAÇÃO
   ========================================================== */

function validarConfiguracao() {

    if (!CONFIG) {

        throw new Error(
            "config.js não foi carregado."
        );

    }

    if (!CONFIG.sistema) {

        throw new Error(
            "CONFIG.sistema não foi encontrado."
        );

    }

    if (!CONFIG.raspadinha) {

        throw new Error(
            "CONFIG.raspadinha não foi encontrada."
        );

    }

    if (!CONFIG.premios) {

        throw new Error(
            "CONFIG.premios não foi encontrada."
        );

    }

    if (!CONFIG.firebase) {

        throw new Error(
            "CONFIG.firebase não foi encontrada."
        );

    }

}

/* ==========================================================
   CARREGAR CAMPANHA
   ========================================================== */

async function carregarCampanha() {

    try {

        const campanha =
            await buscarCampanha();

        /*
         * Caso o banco ainda não tenha os dados
         * da campanha, usamos CONFIG como referência.
         */

        if (
            campanha &&
            Object.keys(campanha).length > 0
        ) {

            atualizarDadosCampanha(
                campanha
            );

            campanhaCarregada = true;

            console.log(
                "Campanha carregada do Firebase:",
                campanha
            );

            return campanha;

        }

        /*
         * Fallback para configuração local.
         */

        if (CONFIG.campanha) {

            atualizarDadosCampanha(
                CONFIG.campanha
            );

            campanhaCarregada = true;

            console.log(
                "Campanha carregada do config.js."
            );

            return CONFIG.campanha;

        }

        campanhaCarregada = false;

        console.warn(
            "Nenhum dado de campanha encontrado."
        );

        return null;

    } catch (erro) {

        /*
         * Não escondemos o erro.
         * Porém, se CONFIG.campanha existir,
         * conseguimos continuar com os dados locais.
         */

        console.warn(
            "Erro ao carregar campanha:",
            erro
        );

        if (CONFIG.campanha) {

            atualizarDadosCampanha(
                CONFIG.campanha
            );

            campanhaCarregada = true;

            return CONFIG.campanha;

        }

        throw erro;

    }

}

/* ==========================================================
   ATUALIZAR DADOS DA CAMPANHA
   ========================================================== */

function atualizarDadosCampanha(
    campanha
) {

    if (!campanha) {

        return;

    }

    /* --------------------------------------------------
       PRÊMIO PRINCIPAL
    -------------------------------------------------- */

    const principal =
        campanha.premioPrincipal ??
        campanha.premio ??
        campanha.primeiroPremio;

    if (
        premioPrincipal &&
        principal
    ) {

        premioPrincipal.textContent =
            principal;

    }

    /* --------------------------------------------------
       PRÊMIO SECUNDÁRIO
    -------------------------------------------------- */

    const secundario =
        campanha.premioSecundario ??
        campanha.segundoPremio;

    if (
        premioSecundario &&
        secundario
    ) {

        premioSecundario.textContent =
            secundario;

    }

    /* --------------------------------------------------
       DATA
    -------------------------------------------------- */

    const data =
        campanha.dataSorteio ??
        campanha.data ??
        campanha.dataResultado;

    if (
        dataSorteio &&
        data
    ) {

        dataSorteio.textContent =
            data;

    }

    /* --------------------------------------------------
       RESULTADO
    -------------------------------------------------- */

    const resultado =
        campanha.resultado ??
        campanha.resultadoSorteio;

    if (
        resultadoSorteio &&
        resultado
    ) {

        resultadoSorteio.textContent =
            resultado;

    }

}

/* ==========================================================
   REGISTRAR EVENTOS
   ========================================================== */

function registrarEventos() {

    if (btnParticipar) {

        btnParticipar.addEventListener(
            "click",
            processarParticipacao
        );

    } else {

        console.warn(
            "Botão #btnParticipar não encontrado."
        );

    }

    /*
     * Permite pressionar Enter no campo do número.
     */

    if (numeroRifaInput) {

        numeroRifaInput.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Enter"
                ) {

                    evento.preventDefault();

                    processarParticipacao();

                }

            }
        );

    }

}

/* ==========================================================
   PROCESSAR PARTICIPAÇÃO
   ========================================================== */

async function processarParticipacao(
    evento = null
) {

    if (evento) {

        evento.preventDefault();

    }

    if (!sistemaInicializado) {

        escreverStatus(
            "O sistema ainda está inicializando."
        );

        return;

    }

    if (!firebaseConectado) {

        escreverStatus(
            "Sistema sem conexão com o Firebase."
        );

        return;

    }

    if (!campanhaCarregada) {

        escreverStatus(
            "Campanha ainda não está disponível."
        );

        return;

    }

    /* --------------------------------------------------
       OBTER NÚMERO
    -------------------------------------------------- */

    const numero =
        obterNumeroDaInterface();

    if (!numero) {

        escreverStatus(
            "Informe o número da rifa."
        );

        focarNumero();

        return;

    }

    /* --------------------------------------------------
       VALIDAR NÚMERO
    -------------------------------------------------- */

    const numeroNormalizado =
        normalizarNumero(numero);

    if (!numeroNormalizado) {

        escreverStatus(
            "Informe um número de rifa válido."
        );

        focarNumero();

        return;

    }

    /* --------------------------------------------------
       DESABILITAR BOTÃO
    -------------------------------------------------- */

    alterarEstadoBotao(
        true,
        "Verificando..."
    );

    escreverStatus(
        "Verificando sua participação..."
    );

    try {

        /*
         * O número é enviado ao controlador.
         *
         * A partir daqui:
         *
         * app.js
         *      ↓
         * raspadinha.js
         *      ↓
         * sorteio.js
         *      ↓
         * firebase-raspadinha.js
         *      ↓
         * Firebase
         */

        const resultado =
            await abrirRaspadinha(
                numeroNormalizado
            );

        /*
         * Se o controlador retornar false,
         * significa que a raspadinha não foi aberta.
         */

        if (
            resultado === false
        ) {

            escreverStatus(
                "Não foi possível abrir a raspadinha."
            );

            return;

        }

        /*
         * Se chegou aqui, o resultado foi
         * decidido pelo fluxo oficial.
         */

        escreverStatus(
            "Raspadinha liberada!"
        );

        console.log(
            "Resultado recebido:",
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao processar participação:",
            erro
        );

        escreverStatus(
            erro?.message ||
            "Não foi possível processar sua participação."
        );

    } finally {

        alterarEstadoBotao(
            false,
            "🎲 QUERO RASPAR AGORA"
        );

    }

}

/* ==========================================================
   OBTER NÚMERO DA INTERFACE
   ========================================================== */

function obterNumeroDaInterface() {

    /*
     * 1 — Campo de entrada
     */

    if (numeroRifaInput) {

        const valor =
            numeroRifaInput.value;

        if (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        ) {

            return valor;

        }

    }

    /*
     * 2 — data-numero do botão
     */

    if (btnParticipar) {

        const numero =
            btnParticipar.dataset.numero;

        if (numero) {

            return numero;

        }

    }

    /*
     * 3 — parâmetro da URL
     *
     * Exemplo:
     * ?numero=123
     */

    try {

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const numeroURL =
            parametros.get(
                "numero"
            );

        if (numeroURL) {

            return numeroURL;

        }

    } catch (erro) {

        console.warn(
            "Não foi possível ler número da URL."
        );

    }

    return null;

}

/* ==========================================================
   NORMALIZAR NÚMERO
   ========================================================== */

function normalizarNumero(numero) {

    if (
        numero === null ||
        numero === undefined
    ) {

        return null;

    }

    const somenteNumeros =
        String(numero)
            .trim()
            .replace(/\D/g, "");

    if (!somenteNumeros) {

        return null;

    }

    const valor =
        parseInt(
            somenteNumeros,
            10
        );

    if (
        !Number.isInteger(valor)
    ) {

        return null;

    }

    /*
     * A base atual trabalha com
     * números de 1 até 1000.
     */

    if (
        valor < 1 ||
        valor > 1000
    ) {

        return null;

    }

    /*
     * IMPORTANTE:
     *
     * O firebase-raspadinha.js
     * normaliza para 4 dígitos.
     *
     * Exemplo:
     *
     * 1    → 0001
     * 25   → 0025
     * 100  → 0100
     * 1000 → 1000
     */

    return String(valor)
        .padStart(4, "0");

}

/* ==========================================================
   FOCAR CAMPO DO NÚMERO
   ========================================================== */

function focarNumero() {

    if (!numeroRifaInput) {

        return;

    }

    try {

        numeroRifaInput.focus();

        numeroRifaInput.select();

    } catch (erro) {

        console.warn(
            "Não foi possível focar campo do número."
        );

    }

}

/* ==========================================================
   ALTERAR ESTADO DO BOTÃO
   ========================================================== */

function alterarEstadoBotao(
    desabilitado,
    texto = null
) {

    if (!btnParticipar) {

        return;

    }

    btnParticipar.disabled =
        Boolean(desabilitado);

    if (texto !== null) {

        btnParticipar.textContent =
            texto;

    }

    if (desabilitado) {

        btnParticipar.classList.add(
            "processando"
        );

    } else {

        btnParticipar.classList.remove(
            "processando"
        );

    }

}

/* ==========================================================
   ESCREVER STATUS
   ========================================================== */

function escreverStatus(
    mensagem
) {

    if (!statusSistema) {

        console.log(
            "[STATUS]",
            mensagem
        );

        return;

    }

    statusSistema.textContent =
        mensagem;

}

/* ==========================================================
   STATUS DO SISTEMA
   ========================================================== */

export function obterStatusSistema() {

    return {

        inicializado:
            sistemaInicializado,

        inicializando,

        firebase:
            firebaseConectado,

        campanha:
            campanhaCarregada,

        raspadinha:
            raspadinhaInicializada(),

        versao:
            CONFIG?.sistema?.versao ||
            "6.0",

        nome:
            CONFIG?.sistema?.nome ||
            "Raspadinha da Amizade"

    };

}

/* ==========================================================
   REINICIALIZAR SISTEMA
   ========================================================== */

export async function reiniciarSistema() {

    sistemaInicializado =
        false;

    firebaseConectado =
        false;

    campanhaCarregada =
        false;

    inicializando =
        false;

    await iniciarSistema();

}

/* ==========================================================
   GET CONFIG
   ========================================================== */

export function obterConfiguracao() {

    return CONFIG;

}

/* ==========================================================
   GET FIREBASE STATUS
   ========================================================== */

export function firebaseEstaConectado() {

    return firebaseConectado;

}

/* ==========================================================
   GET SISTEMA
   ========================================================== */

export function sistemaEstaPronto() {

    return sistemaInicializado;

}

/* ==========================================================
   FIM DO APP
   ========================================================== */
