/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Firebase
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   CONFIGURAÇÃO FIREBASE
========================================================== */

const firebaseConfig = {

    apiKey: "AIzaSyDrc6NkWKXBLKCczw3PiwH9Rt0NE0-DEXY",

    authDomain: "raspadinha2.firebaseapp.com",

    databaseURL: "https://raspadinha2-default-rtdb.firebaseio.com",

    projectId: "raspadinha2",

    storageBucket: "raspadinha2.firebasestorage.app",

    messagingSenderId: "421282276814",

    appId: "1:421282276814:web:faa850a5817eadfb5a779f"

};

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

/* ==========================================================
   EXPORTAÇÕES
========================================================== */

export { app };

export { db };

export function getDB() {

    return db;

}
