/* ==========================================================
   FIREBASE 5.0
   Conexão Principal
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {

    getDatabase

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   CONFIGURAÇÃO
========================================================== */

const firebaseConfig = {

    apiKey: "SUA_API_KEY",

    authDomain: "SEU_PROJETO.firebaseapp.com",

    databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",

    projectId: "SEU_PROJETO",

    storageBucket: "SEU_PROJETO.appspot.com",

    messagingSenderId: "000000000000",

    appId: "1:000000000000:web:000000000000"

};

/* ==========================================================
   APP
========================================================== */

const app = initializeApp(firebaseConfig);

/* ==========================================================
   DATABASE
========================================================== */

const db = getDatabase(app);

/* ==========================================================
   EXPORTAÇÕES
========================================================== */

export { app };

export { db };

export function getDB() {

    return db;

}

/* ==========================================================
   STATUS
========================================================== */

export function firebaseInfo() {

    return {

        engine: "Firebase",

        versao: "5.0",

        conectado: true

    };

}

/* ==========================================================
   FIM
=======================
