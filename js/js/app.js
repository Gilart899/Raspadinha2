/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Aplicação Principal
========================================================== */

import CONFIG from "./config.js";

import { getDB } from "./firebase/firebase.js";

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

/* ==========================================================
   INICIAR
========================================================== */

document.addEventListener("DOMContentLoaded", iniciarSistema);

/* ==========================================================
   SISTEMA
========================================================== */

async function iniciarSistema() {

    console.log("====================================");

    console.log(CONFIG.nome);

    console.log("Versão:", CONFIG.versao);

    console.log("Inicializando...");

    console.log("====================================");

    await testarFirebase();

    configurarEventos();

}

/* ==========================================================
   EVENTOS
========================================================== */

function configurarEventos() {

    if (!btnParticipar) return;

    btnParticipar.addEventListener(

        "click",

        () => {

            alert("🍀 Em breve a raspadinha será aberta.");

        }

    );

}

/* ==========================================================
   TESTE FIREBASE
========================================================== */

async function testarFirebase() {

    try {

        const db = getDB();

        const testeRef = ref(db, "sistema");

        await set(testeRef, {

            nome: CONFIG.nome,

            versao: CONFIG.versao,

            iniciadoEm: serverTimestamp()

        });

        const snap = await get(testeRef);

        if (snap.exists()) {

            console.log("✅ Firebase conectado!");

            console.log(snap.val());

        } else {

            console.warn("⚠ Firebase respondeu vazio.");

        }

    } catch (erro) {

        console.error("❌ Erro ao conectar Firebase:");

        console.error(erro);

    }

}
