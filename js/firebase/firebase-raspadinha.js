/* ==========================================================
   RASPADINHA SOLIDÁRIA 6.0
   FIREBASE RASPADINHA
   Ponte entre aplicação e Realtime Database
========================================================== */

import { getDB } from "./firebase.js";

import {
    ref,
    get,
    set,
    update,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   BANCO
========================================================== */

const db = getDB();

/* ==========================================================
   CAMINHOS PRINCIPAIS
========================================================== */

const CAMINHOS = {

    config: "config",

    campanha: "campanha",

    estatisticas: "estatisticas",

    participantes: "participantes",

    premios: "premios",

    sistema: "sistema",

    teste: "teste",

    vencedores: "vencedores"

};

/* ==========================================================
   NORMALIZAR NÚMERO
========================================================== */

function normalizarNumero(numero) {

    if (
        numero === null ||
        numero === undefined
    ) {

        return null;

    }

    const valor =
        String(numero)
            .trim()
            .replace(/\D/g, "");

    if (!valor) {

        return null;

    }

    const numeroNormalizado =
        parseInt(valor, 10);

    if (
        !Number.isInteger(
            numeroNormalizado
        )
    ) {

        return null;

    }

    if (
        numeroNormalizado < 1 ||
        numeroNormalizado > 1000
    ) {

        return null;

    }

    return String(
        numeroNormalizado
    ).padStart(4, "0");

}

/* ==========================================================
   REFERÊNCIA DO PARTICIPANTE
========================================================== */

function referenciaParticipante(numero) {

    const numeroNormalizado =
        normalizarNumero(numero);

    if (!numeroNormalizado) {

        throw new Error(
            "Número da rifa inválido."
        );

    }

    return ref(

        db,

        `${CAMINHOS.participantes}/${numeroNormalizado}`

    );

}

/* ==========================================================
   BUSCAR PARTICIPANTE
========================================================== */

export async function buscarParticipante(numero) {

    const numeroNormalizado =
        normalizarNumero(numero);

    if (!numeroNormalizado) {

        return null;

    }

    try {

        const participanteRef =
            referenciaParticipante(
                numeroNormalizado
            );

        const snapshot =
            await get(
                participanteRef
            );

        if (!snapshot.exists()) {

            return null;

        }

        return {

            numero:
                numeroNormalizado,

            ...snapshot.val()

        };

    } catch (erro) {

        console.error(

            "Erro ao buscar participante:",

            erro

        );

        throw erro;

    }

}

/* ==========================================================
   VERIFICAR PARTICIPANTE
========================================================== */

export async function verificarParticipante(numero) {

    const participante =
        await buscarParticipante(
            numero
        );

    if (!participante) {

        return {

            valido: false,

            motivo:
                "Participante não encontrado.",

            participante: null

        };

    }

    return {

        valido: true,

        motivo: "Participante encontrado.",

        participante

    };

}

/* ==========================================================
   VERIFICAR PAGAMENTO
========================================================== */

export function pagamentoConfirmado(
    participante
) {

    if (!participante) {

        return false;

    }

    const status =
        participante.statusPagamento ??
        participante.pagamento ??
        participante.status ??
        "";

    const valor =
        String(status)
            .trim()
            .toLowerCase();

    return (

        valor === "pago" ||

        valor === "pagamento confirmado" ||

        valor === "confirmado" ||

        valor === "aprovado" ||

        valor === "true"

    );

}

/* ==========================================================
   VERIFICAR SE JÁ RASPOU
========================================================== */

export function jaRaspou(
    participante
) {

    if (!participante) {

        return false;

    }

    return (

        participante.jaRaspou === true ||

        participante.raspou === true ||

        participante.statusRaspadinha ===
            "raspado" ||

        Boolean(
            participante.dataRaspagem
        )

    );

}

/* ==========================================================
   VALIDAR PARTICIPAÇÃO
========================================================== */

export async function validarParticipacao(
    numero
) {

    const resultado =
        await verificarParticipante(
            numero
        );

    if (!resultado.valido) {

        return {

            permitido: false,

            motivo:
                resultado.motivo,

            participante: null

        };

    }

    const participante =
        resultado.participante;

    if (
        !pagamentoConfirmado(
            participante
        )
    ) {

        return {

            permitido: false,

            motivo:
                "O pagamento ainda não foi confirmado.",

            participante

        };

    }

    if (
        jaRaspou(
            participante
        )
    ) {

        return {

            permitido: false,

            motivo:
                "Este número já foi utilizado.",

            participante

        };

    }

    return {

        permitido: true,

        motivo:
            "Participação liberada.",

        participante

    };

}

/* ==========================================================
   BUSCAR PRÊMIOS
========================================================== */

export async function buscarPremios() {

    try {

        const premiosRef =
            ref(
                db,
                CAMINHOS.premios
            );

        const snapshot =
            await get(
                premiosRef
            );

        if (!snapshot.exists()) {

            return {};

        }

        return snapshot.val();

    } catch (erro) {

        console.error(

            "Erro ao buscar prêmios:",

            erro

        );

        throw erro;

    }

}

/* ==========================================================
   BUSCAR CAMPANHA
========================================================== */

export async function buscarCampanha() {

    try {

        const campanhaRef =
            ref(
                db,
                CAMINHOS.campanha
            );

        const snapshot =
            await get(
                campanhaRef
            );

        if (!snapshot.exists()) {

            return {};

        }

        return snapshot.val();

    } catch (erro) {

        console.error(

            "Erro ao buscar campanha:",

            erro

        );

        throw erro;

    }

}

/* ==========================================================
   REGISTRAR RESULTADO NO PARTICIPANTE
========================================================== */

export async function registrarResultado(
    numero,
    resultado
) {

    const numeroNormalizado =
        normalizarNumero(numero);

    if (!numeroNormalizado) {

        throw new Error(
            "Número da rifa inválido."
        );

    }

    const participanteRef =
        referenciaParticipante(
            numeroNormalizado
        );

    const dados = {

        numeroRifa:
            numeroNormalizado,

        jaRaspou: true,

        statusRaspadinha:
            "raspado",

        resultado:
            resultado,

        premioRecebido:
            resultado === "perdeu"
                ? null
                : resultado,

        dataRaspagem:
            serverTimestamp()

    };

    await update(

        participanteRef,

        dados

    );

    return dados;

}

/* ==========================================================
   REGISTRAR VENCEDOR
========================================================== */

export async function registrarVencedor(
    numero,
    resultado,
    participante = null
) {

    const numeroNormalizado =
        normalizarNumero(numero);

    if (!numeroNormalizado) {

        throw new Error(
            "Número da rifa inválido."
        );

    }

    if (
        resultado === "perdeu"
    ) {

        return false;

    }

    const vencedorRef =
        ref(

            db,

            `${CAMINHOS.vencedores}/${numeroNormalizado}`

        );

    const dados = {

        numeroRifa:
            numeroNormalizado,

        premio:
            resultado,

        nome:
            participante?.nome ||
            participante?.nomeCompleto ||
            "",

        whatsapp:
            participante?.whatsapp ||
            participante?.telefone ||
            "",

        cidade:
            participante?.cidade ||
            "",

        data:
            serverTimestamp(),

        status:
            "pendente"

    };

    await set(

        vencedorRef,

        dados

    );

    return true;

}

/* ==========================================================
   ATUALIZAR ESTATÍSTICAS
========================================================== */

export async function registrarEstatistica(
    resultado
) {

    const estatisticasRef =
        ref(

            db,

            CAMINHOS.estatisticas

        );

    const snapshot =
        await get(
            estatisticasRef
        );

    const atuais =
        snapshot.exists()
            ? snapshot.val()
            : {};

    const atualizadas = {

        totalRaspadas:
            Number(
                atuais.totalRaspadas || 0
            ) + 1,

        totalPerdedores:
            Number(
                atuais.totalPerdedores || 0
            ) +
            (
                resultado === "perdeu"
                    ? 1
                    : 0
            ),

        totalFerro:
            Number(
                atuais.totalFerro || 0
            ) +
            (
                resultado === "ferro"
                    ? 1
                    : 0
            ),

        totalLiquidificador:
            Number(
                atuais.totalLiquidificador || 0
            ) +
            (
                resultado ===
                "liquidificador"
                    ? 1
                    : 0
            ),

        ultimaRaspagem:
            serverTimestamp()

    };

    await set(

        estatisticasRef,

        atualizadas

    );

    return atualizadas;

}

/* ==========================================================
   REGISTRAR SISTEMA ONLINE
========================================================== */

export async function registrarSistemaOnline() {

    const sistemaRef =
        ref(

            db,

            CAMINHOS.sistema

        );

    await update(

        sistemaRef,

        {

            status:
                "online",

            ultimaAtualizacao:
                serverTimestamp()

        }

    );

    return true;

}

/* ==========================================================
   TESTAR BANCO
========================================================== */

export async function testarBanco() {

    try {

        const sistemaRef =
            ref(

                db,

                CAMINHOS.sistema

            );

        const snapshot =
            await get(
                sistemaRef
            );

        return {

            conectado: true,

            existe:
                snapshot.exists(),

            dados:
                snapshot.exists()
                    ? snapshot.val()
                    : null

        };

    } catch (erro) {

        console.error(

            "Erro no teste do banco:",

            erro

        );

        return {

            conectado: false,

            existe: false,

            dados: null,

            erro:
                erro.message

        };

    }

}

/* ==========================================================
   UTILITÁRIO
========================================================== */

export function obterCaminhosFirebase() {

    return {

        ...CAMINHOS

    };

}

/* ==========================================================
   FIM DO FIREBASE RASPADINHA
========================================================== */
