/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   APP PRINCIPAL
   GilFest / GilArt
   ========================================================== */

import { CONFIG } from "./config.js";

import {
    iniciarRaspadinha,
    abrirRaspadinha,
    fecharRaspadinha,
    obterStatusRaspadinha
} from "./raspadinha/raspadinha.js";

import {
    testarBanco,
    registrarSistemaOnline
} from "./firebase/firebase-raspadinha.js";

/* ==========================================================
   ESTADO DO SISTEMA
   ========================================================== */

let sistemaInicializado = false;
let firebaseConectado = false;

/* ==========================================================
   ELEMENTOS DA INTERFACE
   ========================================================== */

let btnParticipar = null;
let statusSistema = null;
let numeroEntrada = null;

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

    if (sistemaInicializado) {
        return;
    }

    localizarElementos();

    escreverStatus(
        "Inicializando sistema..."
    );

    console.log(
        "=========================================="
    );

    console.log(
        CONFIG?.sistema?.nome ||
        "Raspadinha da Amizade"
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

        /* ==================================================
           TESTAR FIREBASE
        ================================================== */

        escreverStatus(
            "Conectando ao Firebase..."
        );

        const banco =
            await testarBanco();

        if (
            !banco ||
            banco.conectado !== true
        ) {

            firebaseConectado = false;

            escreverStatus(
                "Não foi possível conectar ao sistema."
            );

            console.error(
                "Firebase indisponível:",
                banco?.erro
            );

            return;
        }

        firebaseConectado = true;

        console.log(
            "Firebase conectado."
        );

        /* ==================================================
           REGISTRAR SISTEMA ONLINE
        ================================================== */

        try {

            await registrarSistemaOnline();

            console.log(
                "Sistema registrado como online."
            );

        } catch (erro) {

            console.warn(
                "Não foi possível registrar status online:",
                erro
            );

        }

        /* ==================================================
           INICIAR RASPADINHA
        ================================================== */

        escreverStatus(
            "Preparando raspadinha..."
        );

        await iniciarRaspadinha();

        /* ==================================================
           EVENTOS
        ================================================== */

        registrarEventos();

        /* ==================================================
           FINALIZAÇÃO
        ================================================== */

        sistemaInicializado = true;

        escreverStatus(
            "Sistema pronto."
        );

        console.log(
            "Raspadinha inicializada com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao iniciar sistema:",
            erro
        );

        sistemaInicializado = false;

        escreverStatus(
            "Erro ao inicializar o sistema."
        );

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

    /*
     * O campo do número pode ter qualquer
     * um destes IDs.
     */

    numeroEntrada =
        document.getElementById(
            "numeroRifa"
        ) ||
        document.getElementById(
            "numero"
        ) ||
        document.getElementById(
            "numeroParticipante"
        );

}

/* ==========================================================
   REGISTRAR EVENTOS
   ========================================================== */

function registrarEventos() {

    if (btnParticipar) {

        btnParticipar.addEventListener(
            "click",
            evento => {

                evento.preventDefault();

                participar();

            }
        );

    }

    /*
     * Permitir Enter no campo do número.
     */

    if (numeroEntrada) {

        numeroEntrada.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Enter"
                ) {

                    evento.preventDefault();

                    participar();

                }

            }
        );

    }

}

/* ==========================================================
   PARTICIPAR
   ========================================================== */

async function participar() {

    if (!sistemaInicializado) {

        escreverStatus(
            "O sistema ainda está inicializando."
        );

        return;

    }

    if (!firebaseConectado) {

        escreverStatus(
            "Sistema indisponível no momento."
        );

        return;

    }

    /* ==================================================
       OBTER NÚMERO
    ================================================== */

    let numero = null;

    if (numeroEntrada) {

        numero =
            numeroEntrada.value;

    }

    /*
     * Caso o botão tenha um número
     * armazenado em data-numero.
     */

    if (
        !numero &&
        btnParticipar
    ) {

        numero =
            btnParticipar.dataset.numero ||
            null;

    }

    /*
     * Caso ainda não exista número,
     * abrimos a raspadinha sem número somente
     * se o próprio projeto permitir.
     */

    if (!numero) {

        escreverStatus(
            "Informe o número da rifa."
        );

        if (numeroEntrada) {

            numeroEntrada.focus();

        }

        return;

    }

    /* ==================================================
       NORMALIZAR NÚMERO
    ================================================== */

    numero =
        String(numero)
            .replace(/\D/g, "");

    if (!numero) {

        escreverStatus(
            "Digite um número válido."
        );

        return;

    }

    console.log(
        "Abrindo raspadinha para:",
        numero
    );

    /* ==================================================
       BLOQUEAR BOTÃO
    ================================================== */

    if (btnParticipar) {

        btnParticipar.disabled = true;

    }

    escreverStatus(
        "Verificando sua participação..."
    );

    try {

        /* ==================================================
           ABRIR RASPADINHA
        ================================================== */

        const resultado =
            await abrirRaspadinha(
                numero
            );

        /*
         * O controlador retorna false
         * quando ocorre algum erro.
         */

        if (resultado === false) {

            escreverStatus(
                "Não foi possível abrir a raspadinha."
            );

            return;

        }

        escreverStatus(
            "Raspadinha liberada! Raspe para descobrir."
        );

        console.log(
            "Raspadinha aberta:",
            resultado
        );

    } catch (erro) {

        console.error(
            "Erro ao participar:",
            erro
        );

        escreverStatus(
            erro?.message ||
            "Não foi possível iniciar sua raspadinha."
        );

    } finally {

        if (btnParticipar) {

            btnParticipar.disabled = false;

        }

    }

}

/* ==========================================================
   STATUS
   ========================================================== */

function escreverStatus(
    mensagem
) {

    console.log(
        "[STATUS]",
        mensagem
    );

    if (!statusSistema) {

        return;

    }

    statusSistema.textContent =
        mensagem;

}

/* ==========================================================
   STATUS PÚBLICO
   ========================================================== */

export function obterStatusSistema() {

    return {

        inicializado:
            sistemaInicializado,

        firebase:
            firebaseConectado,

        raspadinha:
            obterStatusRaspadinha()

    };

}

/* ==========================================================
   REINICIAR SISTEMA
   ========================================================== */

export async function reiniciarSistema() {

    sistemaInicializado =
        false;

    firebaseConectado =
        false;

    escreverStatus(
        "Reiniciando sistema..."
    );

    await iniciarSistema();

}

/* ==========================================================
   EXPOR CONTROLE OPCIONAL
   ========================================================== */

window.RaspadinhaApp = {

    iniciar:
        iniciarSistema,

    participar,

    fechar:
        fecharRaspadinha,

    status:
        obterStatusSistema

};

/* ==========================================================
   FIM DO APP
   ========================================================== */
