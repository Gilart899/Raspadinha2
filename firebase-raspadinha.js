// ==========================================================
// RASPADINHA DA AMIZADE 6.0
// FIREBASE RASPADINHA
// Firebase como autoridade do sorteio
// ==========================================================

import { getDB } from "./firebase.js";

import {
    ref,
    get,
    set,
    update,
    push,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


// ==========================================================
// BANCO
// ==========================================================

const db = getDB();


// ==========================================================
// REFERÊNCIAS
// ==========================================================

const participantesRef =
    ref(db, "participantes");

const premiosRef =
    ref(db, "premios");

const vencedoresRef =
    ref(db, "vencedores");

const estatisticasRef =
    ref(db, "estatisticas");

const sistemaRef =
    ref(db, "sistema");


// ==========================================================
// TESTAR BANCO
// ==========================================================

export async function testarBanco() {

    try {

        const snap =
            await get(sistemaRef);

        console.log(
            "Firebase:",
            "conectado"
        );

        return {

            conectado: true,

            dados:
                snap.exists()
                    ? snap.val()
                    : null

        };

    } catch (erro) {

        console.error(
            "Erro ao testar Firebase:",
            erro
        );

        return {

            conectado: false,

            erro

        };

    }

}


// ==========================================================
// REGISTRAR SISTEMA ONLINE
// ==========================================================

export async function registrarSistemaOnline() {

    await set(
        sistemaRef,
        {

            nome:
                "Raspadinha da Amizade",

            versao:
                "6.0",

            status:
                "online",

            atualizadoEm:
                serverTimestamp()

        }
    );

    return true;

}


// ==========================================================
// BUSCAR PARTICIPANTE
// ==========================================================

export async function buscarParticipante(
    numero
) {

    if (
        numero === undefined ||
        numero === null ||
        numero === ""
    ) {

        throw new Error(
            "Número da rifa não informado."
        );

    }

    const participanteRef =
        ref(
            db,
            `participantes/${numero}`
        );

    const snap =
        await get(
            participanteRef
        );

    if (!snap.exists()) {

        return null;

    }

    return snap.val();

}


// ==========================================================
// VALIDAR PARTICIPANTE
// ==========================================================

export async function validarParticipante(
    numero
) {

    const participante =
        await buscarParticipante(
            numero
        );


    if (!participante) {

        throw new Error(
            "Número não encontrado."
        );

    }


    /*
     * Aceita os formatos mais comuns
     * usados no seu banco.
     */

    const comprado =
        participante.comprado === true ||
        participante.pago === true ||
        participante.pagamento?.confirmado === true;


    if (!comprado) {

        throw new Error(
            "Este número ainda não possui pagamento confirmado."
        );

    }


    if (
        participante.raspadinha &&
        participante.raspadinha.realizada === true
    ) {

        throw new Error(
            "Esta raspadinha já foi utilizada."
        );

    }


    return participante;

}


// ==========================================================
// LIBERAR RASPADINHA
// ==========================================================

export async function liberar(
    numero
) {

    await validarParticipante(
        numero
    );


    const participanteRef =
        ref(
            db,
            `participantes/${numero}/raspadinha`
        );


    await update(
        participanteRef,
        {

            liberada: true,

            liberadaEm:
                serverTimestamp()

        }
    );


    return true;

}


// ==========================================================
// BUSCAR PRÊMIOS
// ==========================================================

async function buscarPremios() {

    const snap =
        await get(
            premiosRef
        );


    if (!snap.exists()) {

        return {};

    }


    return snap.val();

}


// ==========================================================
// LOCALIZAR PRÊMIO
// ==========================================================

function localizarPremio(
    premios,
    numero
) {

    if (!premios) {

        return null;

    }


    for (
        const chave in premios
    ) {

        const premio =
            premios[chave];


        if (
            String(
                premio.numeroPremiado
            ) ===
            String(numero)
            &&
            premio.disponivel === true
        ) {

            return {

                chave,

                premio

            };

        }

    }


    return null;

}


// ==========================================================
// REVELAR RASPADINHA
// ==========================================================

export async function revelarRaspadinha(
    numero
) {

    /*
     * Primeira validação.
     */

    const participante =
        await validarParticipante(
            numero
        );


    /*
     * Buscar prêmios.
     */

    const premios =
        await buscarPremios();


    const encontrado =
        localizarPremio(
            premios,
            numero
        );


    /*
     * Resultado padrão.
     */

    let resultado = {

        numero,

        premio:
            "perdeu",

        ganhou:
            false

    };


    /*
     * Se encontrou prêmio.
     */

    if (encontrado) {

        const chavePremio =
            encontrado.chave;

        const premio =
            encontrado.premio;


        /*
         * Bloquear prêmio.
         */

        const premioRef =
            ref(
                db,
                `premios/${chavePremio}`
            );


        await update(
            premioRef,
            {

                disponivel: false,

                reservadoEm:
                    serverTimestamp()

            }
        );


        /*
         * Registrar vencedor.
         */

        await push(
            vencedoresRef,
            {

                numero:

                    String(numero),

                premio:

                    premio.nome ||
                    premio.id ||
                    "Prêmio",

                data:

                    serverTimestamp()

            }
        );


        resultado = {

            numero,

            premio:
                premio.id ||
                premio.nome ||
                "premio",

            ganhou:
                true

        };

    }


    /*
     * Atualizar participante.
     */

    const participanteRaspadinhaRef =
        ref(
            db,
            `participantes/${numero}/raspadinha`
        );


    await update(
        participanteRaspadinhaRef,
        {

            realizada: true,

            premio:
                resultado.premio,

            ganhou:
                resultado.ganhou,

            realizadaEm:
                serverTimestamp()

        }
    );


    /*
     * Atualizar estatística.
     */

    const estatisticaRef =
        ref(
            db,
            "estatisticas/raspadinhasRealizadas"
        );


    await runTransaction(
        estatisticaRef,
        valor => {

            return (
                (valor || 0) + 1
            );

        }
    );


    return resultado;

}


// ==========================================================
// OBTER ESTATÍSTICAS
// ==========================================================

export async function obterEstatisticas() {

    const snap =
        await get(
            estatisticasRef
        );


    if (!snap.exists()) {

        return {};

    }


    return snap.val();

}


// ==========================================================
// OBTER VENCEDORES
// ==========================================================

export async function obterVencedores() {

    const snap =
        await get(
            vencedoresRef
        );


    if (!snap.exists()) {

        return {};

    }


    return snap.val();

}


// ==========================================================
// STATUS FIREBASE
// ==========================================================

export function firebaseRaspadinhaInfo() {

    return {

        sistema:
            "Raspadinha da Amizade",

        versao:
            "6.0",

        banco:
            "Firebase Realtime Database",

        autoridadeSorteio:
            true

    };

}


// ==========================================================
// FIM
// ==========================================================
