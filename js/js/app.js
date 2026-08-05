/* ==========================================================
   RASPADINHA SOLIDÁRIA 5.0
   APP PRINCIPAL
========================================================== */

import CONFIG from "./config.js";

import {

    iniciarRaspadinha,

    abrirRaspadinha

} from "./raspadinha/raspadinha.js";

import {

    getDB

} from "./firebase/firebase.js";

import {

    ref,

    get,

    set,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const btnParticipar =

    document.getElementById(

        "btnParticipar"

    );

const statusSistema =

    document.getElementById(

        "statusSistema"

    );

/* ==========================================================
   ESTADO
========================================================== */

let sistemaInicializado = false;

/* ==========================================================
   START
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    iniciarSistema

);

/* ==========================================================
   SISTEMA
========================================================== */

async function iniciarSistema() {

    if (sistemaInicializado) return;

    escreverStatus(

        "Inicializando sistema..."

    );

    console.clear();

    console.log("================================");

    console.log(CONFIG.nome);

    console.log(CONFIG.versao);

    console.log("================================");

    await testarFirebase();

    await iniciarRaspadinha();

    registrarEventos();

    sistemaInicializado = true;

    escreverStatus(

        "Sistema pronto."

    );

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    if (btnParticipar) {

        btnParticipar.addEventListener(

            "click",

            abrirSistemaRaspadinha

        );

    }

}

/* ==========================================================
   ABRIR RASPADINHA
========================================================== */

async function abrirSistemaRaspadinha() {

    try {

        bloquearBotao(true);

        escreverStatus(

            "Preparando raspadinha..."

        );

        await abrirRaspadinha();

        escreverStatus(

            "Boa sorte! 🍀"

        );

    } catch (erro) {

        console.error(

            "Erro ao abrir raspadinha:",

            erro

        );

        escreverStatus(

            "Erro ao abrir a raspadinha."

        );

        alert(

            "Não foi possível abrir a raspadinha."

        );

    } finally {

        bloquearBotao(false);

    }

}

/* ==========================================================
   BOTÃO
========================================================== */

function bloquearBotao(bloquear) {

    if (!btnParticipar) return;

    btnParticipar.disabled = bloquear;

    if (bloquear) {

        btnParticipar.classList.add(

            "desabilitado"

        );

    } else {

        btnParticipar.classList.remove(

            "desabilitado"

        );

    }

}

/* ==========================================================
   STATUS
========================================================== */

function escreverStatus(texto) {

    if (!statusSistema) return;

    statusSistema.textContent = texto;

}

/* ==========================================================
   FIREBASE
========================================================== */

async function testarFirebase() {

    try {

        escreverStatus(
            "Conectando ao Firebase..."
        );

        const db = getDB();

        const sistemaRef = ref(
            db,
            "sistema"
        );

        await set(sistemaRef, {

            nome: CONFIG.nome,

            versao: CONFIG.versao,

            iniciadoEm: serverTimestamp(),

            status: "online"

        });

        const snap = await get(sistemaRef);

        if (!snap.exists()) {

            throw new Error(
                "Firebase retornou vazio."
            );

        }

        console.log("================================");

        console.log("Firebase conectado.");

        console.table(snap.val());

        console.log("================================");

        escreverStatus(
            "Firebase conectado."
        );

        return true;

    } catch (erro) {

        console.error(

            "Erro Firebase:",

            erro

        );

        escreverStatus(
            "Falha na conexão."
        );

        return false;

    }

}

/* ==========================================================
   UTILITÁRIOS
========================================================== */

export function sistemaPronto() {

    return sistemaInicializado;

}

export function obterConfiguracao() {

    return CONFIG;

}

/* ==========================================================
   LOG
========================================================== */

console.log(

    "%cRaspadinha Solidária 5.0",

    "color:#0B7D2B;font-size:16px;font-weight:bold;"

);

console.log(

    "Aplicação carregada."

);

/* ==========================================================
   FIM DO APP
===========
