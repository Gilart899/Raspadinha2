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

const btnParticipar = document.getElementById("btnParticipar");

const statusSistema = document.getElementById("statusSistema");

/* ==========================================================
   ESTADO
========================================================== */

let sistemaInicializado = false;

/* ==========================================================
   INICIAR
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

    escreverStatus("Inicializando sistema...");

    console.clear();

    console.log("================================");

    console.log(CONFIG.sistema.nome);

    console.log("Versão:", CONFIG.sistema.versao);

    console.log("================================");

    const conectado = await testarFirebase();

    if (!conectado) {

        escreverStatus("Falha na conexão com Firebase.");

        return;

    }

    await iniciarRaspadinha();

    registrarEventos();

    sistemaInicializado = true;

    escreverStatus("Sistema pronto.");

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    if (!btnParticipar) return;

    btnParticipar.addEventListener(

        "click",

        abrirSistemaRaspadinha

    );

}

/* ==========================================================
   ABRIR RASPADINHA
========================================================== */

async function abrirSistemaRaspadinha() {

    try {

        bloquearBotao(true);

        escreverStatus("Preparando raspadinha...");

        await abrirRaspadinha();

        escreverStatus("Boa sorte! 🍀");

    } catch (erro) {

        console.error(

            "Erro ao abrir raspadinha:",

            erro

        );

        escreverStatus("Erro ao abrir raspadinha.");

        alert(

            "Não foi possível abrir a raspadinha."

        );

    } finally {

        bloquearBotao(false);

    }

}/* ==========================================================
   BOTÃO
========================================================== */

function bloquearBotao(bloquear) {

    if (!btnParticipar) return;

    btnParticipar.disabled = bloquear;

    btnParticipar.classList.toggle(

        "desabilitado",

        bloquear

    );

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

        escreverStatus("Conectando ao Firebase...");

        const db = getDB();

        const sistemaRef = ref(

            db,

            CONFIG.firebase.sistema

        );

        await set(sistemaRef, {

            nome: CONFIG.sistema.nome,

            versao: CONFIG.sistema.versao,

            status: "online",

            iniciadoEm: serverTimestamp()

        });

        const snap = await get(sistemaRef);

        if (!snap.exists()) {

            throw new Error(

                "Não foi possível acessar o Firebase."

            );

        }

        console.log("================================");

        console.log("Firebase conectado com sucesso.");

        console.table(snap.val());

        console.log("================================");

        escreverStatus("Firebase conectado.");

        return true;

    } catch (erro) {

        console.error(

            "Erro Firebase:",

            erro

        );

        escreverStatus("Falha na conexão com Firebase.");

        return false;

    }

}
