/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Aplicação Principal
========================================================== */

import CONFIG from "./config.js";
import { getDB } from "./firebase/firebase.js";

import {
    iniciarRaspadinha,
    abrirRaspadinha as abrirModalRaspadinha
} from "./raspadinha/raspadinha.js";

import {
    ref,
    set,
    get,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const btnParticipar = document.getElementById("btnParticipar");
const statusSistema = document.getElementById("statusSistema");

/* ==========================================================
   STATUS
========================================================== */

function escreverStatus(texto) {

    console.log(texto);

    if (!statusSistema) return;

    statusSistema.innerHTML += texto + "<br>";

}

/* ==========================================================
   INICIAR
========================================================== */

document.addEventListener("DOMContentLoaded", iniciarSistema);

async function iniciarSistema() {

    escreverStatus("🍀 " + CONFIG.nome);

    escreverStatus("📦 Versão " + CONFIG.versao);

    escreverStatus("🚀 Inicializando...");

    await testarFirebase();

    iniciarRaspadinha();

    configurarEventos();

}

/* ==========================================================
   FIREBASE
========================================================== */

async function testarFirebase() {

    try {

        const db = getDB();

        const testeRef = ref(db, "sistema");

        await set(testeRef, {

            nome: CONFIG.nome,

            versao: CONFIG.versao,

            data: serverTimestamp()

        });

        const snap = await get(testeRef);

        if (snap.exists()) {

            escreverStatus("✅ Firebase conectado.");

        } else {

            escreverStatus("⚠ Firebase respondeu vazio.");

        }

    } catch (erro) {

        escreverStatus("❌ Erro ao conectar Firebase.");

        escreverStatus(erro.message);

    }

}

/* ==========================================================
   EVENTOS
========================================================== */

function configurarEventos() {

    if (!btnParticipar) return;

    btnParticipar.addEventListener("click", () => {

        escreverStatus("🎁 Botão clicado.");

        abrirModalRaspadinha();

    });

}
