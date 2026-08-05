 /* ==========================================================
   FIREBASE ENGINE 5.0
   Raspadinha Solidária
   Parte 1 - Inicialização
========================================================== */

import {

    ref,
    get,
    set,
    update,
    push,
    runTransaction

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

import { db } from "./firebase.js";

import { CONFIG } from "../config.js";

/* ==========================================================
   REFERÊNCIAS
========================================================== */

const campanhaRef = ref(
    db,
    "campanha"
);

const participantesRef = ref(
    db,
    "participantes"
);

const premiosRef = ref(
    db,
    "premios"
);

const vencedoresRef = ref(
    db,
    "vencedores"
);

const estatisticasRef = ref(
    db,
    "estatisticas"
);

/* ==========================================================
   CAMPANHA
========================================================== */

export async function carregarCampanha() {

    const snap = await get(
        campanhaRef
    );

    if (!snap.exists()) {

        throw new Error(
            "Campanha não encontrada."
        );

    }

    return snap.val();

}

/* ==========================================================
   PRÊMIOS
========================================================== */

export async function carregarPremios() {

    const snap = await get(
        premiosRef
    );

    if (!snap.exists()) {

        throw new Error(
            "Prêmios não encontrados."
        );

    }

    return snap.val();

}

/* ==========================================================
   STATUS
========================================================== */

export async function obterStatusSistema() {

    const campanha = await carregarCampanha();

    const premios = await carregarPremios();

    return {

        campanha,

        premios,

        versao: CONFIG.sistema.versao,

        nome: CONFIG.sistema.nome

    };

}

/* ==========================================================
   FIREBASE ENGINE 5.0
   Parte 2 - Participantes
========================================================== */

/* ==========================================================
   OBTER PARTICIPANTE
========================================================== */

export async function obterParticipante(numero) {

    const participanteRef = ref(
        db,
        `participantes/${numero}`
    );

    const snap = await get(participanteRef);

    if (!snap.exists()) {

        return null;

    }

    return snap.val();

}

/* ==========================================================
   REGISTRAR PARTICIPANTE
========================================================== */

export async function registrarParticipante(numero, dados) {

    const participanteRef = ref(
        db,
        `participantes/${numero}`
    );

    await set(participanteRef, {

        ...dados,

        numero,

        criadoEm
        
        /* ==========================================================
   FIREBASE ENGINE 5.0
   Parte 3 - Prêmios e Vencedores
========================================================== */

/* ==========================================================
   CONSUMIR PRÊMIO
========================================================== */

export async function consumirPremio(idPremio) {

    const premioRef = ref(
        db,
        `premios/${idPremio}/quantidade`
    );

    const resultado = await runTransaction(

        premioRef,

        (quantidadeAtual) => {

            if (quantidadeAtual === null) {

                return quantidadeAtual;

            }

            if (quantidadeAtual <= 0) {

                return;

            }

            return quantidadeAtual - 1;

        }

    );

    return resultado.committed;

}

/* ==========================================================
   REGISTRAR VENCEDOR
========================================================== */

export async function registrarVencedor(dados) {

    const novoRegistro = push(vencedoresRef);

    await set(

        novoRegistro,

        {

            ...dados,

            dataRegistro: Date.now(),

            campanha: CONFIG.firebase.campanha

        }

    );

}

/* ==========================================================
   ESTATÍSTICAS
========================================================== */

export async function incrementarRaspagens() {

    await runTransaction(

        ref(db, "estatisticas/raspagens"),

        (valorAtual) => (valorAtual || 0) + 1

    );

}

export async function incrementarPremiosEntregues() {

    await runTransaction(

        ref(db, "estatisticas/premiosEntregues"),

        (valorAtual) => (valorAtual || 0) + 1

    );

}

/* ==========================================================
   FINALIZAR RASPADINHA
========================================================== */

export async function finalizarRaspadinha(

    numero,

    premio,

    dadosVencedor = {}

) {

    await marcarComoRaspou(numero);

    if (premio !== "perdeu") {

        const reservado = await consumirPremio(premio);

        if (!reservado) {

            throw new Error(

                "Prêmio indisponível."

            );

        }

        await registrarVencedor({

            numero,

            premio,

            ...dadosVencedor

        });

        await incrementarPremiosEntregues();

    }

    await incrementarRaspagens();

}

/* ==========================================================
   FIREBASE ENGINE 5.0
   Parte 4 - Utilitários e Encerramento
========================================================== */

/* ==========================================================
   STATUS GERAL
========================================================== */

export async function obterStatusFirebase() {

    const campanha = await carregarCampanha();

    const premios = await carregarPremios();

    const estatisticas = await get(estatisticasRef);

    return {

        campanha,

        premios,

        estatisticas: estatisticas.exists()

            ? estatisticas.val()

            : {}

    };

}

/* ==========================================================
   REINICIAR ESTATÍSTICAS
   (UTILIZAR APENAS NO PAINEL ADMIN)
========================================================== */

export async function resetarEstatisticas() {

    await set(

        estatisticasRef,

        {

            raspagens: 0,

            premiosEntregues: 0

        }

    );

}

/* ==========================================================
   TESTE DE CONEXÃO
========================================================== */

export async function testarFirebase() {

    try {

        await get(campanhaRef);

        return true;

    } catch (erro) {

        console.error(

            "Firebase indisponível:",

            erro

        );

        return false;

    }

}

/* ==========================================================
   INFORMAÇÕES
========================================================== */

export function obterVersaoEngine() {

    return {

        engine: "Firebase Engine",

        versao: "5.0",

        campanha: CONFIG.firebase.campanha

    };

}

/* ==========================================================
   EXPORTAÇÕES
========================================================== */

export default {

    carregarCampanha,

    carregarPremios,

    obterParticipante,

    registrarParticipante,

    participanteJaRaspou,

    marcarComoRaspou,

    pagamentoConfirmado,

    liberarRaspadinha,

    consumirPremio,

    registrarVencedor,

    incrementarRaspagens,

    incrementarPremiosEntregues,

    finalizarRaspadinha,

    obterStatusFirebase,

    resetarEstatisticas,

    testarFirebase,

    obterVersaoEngine

};

/* ==========================================================
   FIM DO FIREBASE ENGINE 5.0
========================================================== */
