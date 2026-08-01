/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Aplicação Principal
========================================================== */

import { getDB } from "./firebase/firebase.js";

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

async function iniciarSistema() {

    console.log("🍀 Iniciando Raspadinha 2.0...");

    const db = getDB();

    try {

        const testeRef = ref(db, "teste");

        await set(testeRef, {
            status: "Conectado",
            data: new Date().toISOString()
        });

        const snapshot = await get(testeRef);

        if (snapshot.exists()) {

            console.log("✅ Firebase conectado com sucesso!");

            console.log(snapshot.val());

        } else {

            console.error("❌ Não foi possível ler os dados.");

        }

    } catch (erro) {

        console.error("❌ Erro ao conectar ao Firebase:");

        console.error(erro);

    }

}

iniciarSistema();
