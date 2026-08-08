/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   FIREBASE — CONEXÃO PRINCIPAL
========================================================== */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


/* ==========================================================
   CONFIGURAÇÃO REAL DO FIREBASE
========================================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyDrc6NkWKXBLKCczw3PiwH9Rt0NE0-DEXY",

    authDomain:
        "raspadinha2.firebaseapp.com",

    databaseURL:
        "https://raspadinha2-default-rtdb.firebaseio.com",

    projectId:
        "raspadinha2",

    storageBucket:
        "raspadinha2.firebasestorage.app",

    messagingSenderId:
        "421282276814",

    appId:
        "1:421282276814:web:faa850a5817eadfb5a779f"

};


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

const app =
    initializeApp(
        firebaseConfig
    );


/* ==========================================================
   REALTIME DATABASE
========================================================== */

const db =
    getDatabase(
        app
    );


/* ==========================================================
   GET DATABASE
========================================================== */

export function getDB() {

    return db;

}


/* ==========================================================
   GET FIREBASE APP
========================================================== */

export function getFirebaseApp() {

    return app;

}


/* ==========================================================
   CONFIGURAÇÃO
========================================================== */

export function getFirebaseConfig() {

    return {

        ...firebaseConfig

    };

}


/* ==========================================================
   INFORMAÇÕES DO FIREBASE
========================================================== */

export function firebaseInfo() {

    return {

        conectado: true,

        projeto:
            firebaseConfig.projectId,

        banco:
            "raspadinha2-default-rtdb",

        versaoSDK:
            "10.13.2"

    };

}


/* ==========================================================
   TESTE LOCAL DA CONEXÃO
========================================================== */

export function firebaseConfigurado() {

    return Boolean(

        firebaseConfig.apiKey &&
        firebaseConfig.projectId &&
        firebaseConfig.databaseURL

    );

}


/* ==========================================================
   FIM DO FIREBASE
========================================================== */
