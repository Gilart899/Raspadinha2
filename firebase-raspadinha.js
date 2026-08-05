/* ==========================================================
   FIREBASE ENGINE 5.0
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

/* ==========================================================
   REFERÊNCIAS
========================================================== */

const campanhaRef =
    ref(db, "campanha");

const participantesRef =
    ref(db, "participantes");

const vencedoresRef =
    ref(db, "vencedores");

const premiosRef =
    ref(db, "premios");

const estatisticasRef =
    ref(db, "estatisticas");

/* ==========================================================
   CAMPANHA
========================================================== */

export async function carregarCampanha() {

    const snap =
        await get(campanhaRef);

    if (!snap.exists()) {

        throw new Error(
            "Campanha não encontrada."
        );

    }

    return snap.val();

}

/* ==========================================================
   PARTICIPANTE
========================================================== */

export async function obterParticipante(numero) {

    const snap =
        await get(

            ref(

                db,

                `participantes/${numero}`

            )

        );

    if (!snap.exists()) {

        return null;

    }

    return snap.val();

}

/* ==========================================================
   REGISTRAR PARTICIPANTE
========================================================== */

export async function registrarParticipante(numero, dados) {

    await set(

        ref(db, `participantes/${numero}`),

        dados

    );

}

/* ==========================================================
   VERIFICAR SE JÁ RASPOU
========================================================== */

export async function participanteJaRaspou(numero) {

    const snap = await get(

        ref(db, `participantes/${numero}/raspou`)

    );

    return snap.exists() && snap.val() === true;

}

/* ==========================================================
   MARCAR COMO RASPOU
========================================================== */

export async function marcarComoRaspou(numero) {

    await update(

        ref(db, `participantes/${numero}`),

        {

            raspou: true,

            dataRaspagem: Date.now()

        }

    );

}

/* ==========================================================
   CONSULTAR PRÊMIOS
========================================================== */

export async function carregarPremios() {

    const snap = await get(premiosRef);

    if (!snap.exists()) {

        throw new Error("Prêmios não encontrados.");

    }

    return snap.val();

}

/* ==========================================================
   REGISTRAR VENCEDOR
========================================================== */

export async function registrarVencedor(dados) {

    const novo = push(vencedoresRef);

    await set(

        novo,

        {

            ...dados,

            dataRegistro: Date.now()

        }

    );

}

/* ==========================================================
   ATUALIZAR ESTATÍSTICAS
========================================================== */

export async function incrementarRaspagens() {

    await runTransaction(

        ref(db, "estatisticas/raspagens"),

        (valor) => {

            return (valor || 0) + 1;

        }

    );

}

export async function incrementarPremios() {

    await runTransaction(

        ref(db, "estatisticas/premiosEntregues"),

        (valor) => {

            return (valor || 0) + 1;

        }

    );

}

/* ==========================================================
   FIREBASE ENGINE 5.0
   PARTE 3
========================================================== */

/* ==========================================================
   VALIDAR PAGAMENTO
========================================================== */

export async function pagamentoConfirmado(numero) {

    const participante = await obterParticipante(numero);

    if (!participante) return false;

    return participante.pagamento === true;

}

/* ==========================================================
   CONSUMIR PRÊMIO
========================================================== */

export async function consumirPremio(idPremio) {

    const premioRef = ref(db, `premios/${idPremio}/quantidade`);

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
   LIBERAR RASPADINHA
========================================================== */

export async function liberarRaspadinha(numero) {

    const participante = await obterParticipante(numero);

    if (!participante) {

        throw new Error("Participante não encontrado.");

    }

    if (await participanteJaRaspou(numero)) {

        throw new Error("Este número já utilizou a raspadinha.");

    }

    if (!(await pagamentoConfirmado(numero))) {

        throw new Error("Pagamento ainda não confirmado.");

    }

    return true;

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

        await incrementarPremios();

    }

    await incrementarRaspagens();

}

/* ==========================================================
   STATUS
========================================================== */

export async function obterStatusFirebase() {

    const campanha = await carregarCampanha();

    const premios = await carregarPremios();

    return {

        campanha,

        premios

    };

}

/* ==========================================================
   FIM DO FIREBASE ENGINE
====================
