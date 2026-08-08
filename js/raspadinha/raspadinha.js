/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   FIREBASE RASPADINHA
   Ponte entre aplicação e Realtime Database
   ========================================================== */

import { getDB } from "./firebase.js";

import {
    ref,
    get,
    set,
    update,
    runTransaction,
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
        numero === undefined ||
        numero === ""
    ) {

        return null;

    }


    const valor = String(numero)
        .trim()
        .replace(/\D/g, "");


    if (!valor) {

        return null;

    }


    const numeroInteiro =
        parseInt(valor, 10);


    if (
        !Number.isInteger(numeroInteiro)
    ) {

        return null;

    }


    if (
        numeroInteiro < 1 ||
        numeroInteiro > 1000
    ) {

        return null;

    }


    /*
     * O projeto trabalha com números
     * de 4 dígitos no Firebase.
     *
     * Exemplo:
     *
     * 1    -> 0001
     * 25   -> 0025
     * 100  -> 0100
     * 1000 -> 1000
     */

    return String(numeroInteiro)
        .padStart(4, "0");

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
   VALIDAR PARTICIPANTE
   ========================================================== */

export async function validarParticipante(numero) {

    const participante =
        await buscarParticipante(
            numero
        );


    if (!participante) {

        throw new Error(
            "Número da rifa não encontrado."
        );

    }


    if (
        !pagamentoConfirmado(
            participante
        )
    ) {

        throw new Error(
            "O pagamento deste número ainda não foi confirmado."
        );

    }


    if (
        jaRaspou(
            participante
        )
    ) {

        throw new Error(
            "Este número já foi utilizado."
        );

    }


    return participante;

}


/* ==========================================================
   VERIFICAR PARTICIPANTE
   ========================================================== */

export async function verificarParticipante(numero) {

    try {

        const participante =
            await buscarParticipante(
                numero
            );


        if (!participante) {

            return {

                valido: false,

                motivo:
                    "Número não encontrado.",

                participante: null

            };

        }


        return {

            valido: true,

            motivo:
                "Participante encontrado.",

            participante

        };

    } catch (erro) {

        return {

            valido: false,

            motivo:
                erro.message ||
                "Erro ao consultar participante.",

            participante: null

        };

    }

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


    /*
     * Aceita diferentes formatos que podem
     * existir no banco.
     */

    if (
        participante.comprado === true
    ) {

        return true;

    }


    if (
        participante.pagamentoConfirmado === true
    ) {

        return true;

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

        valor === "confirmado" ||

        valor === "pagamento confirmado" ||

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


    /*
     * Estrutura antiga.
     */

    if (
        participante.jaRaspou === true
    ) {

        return true;

    }


    /*
     * Estrutura alternativa.
     */

    if (
        participante.raspou === true
    ) {

        return true;

    }


    /*
     * Estrutura utilizada pelo projeto.
     */

    if (
        participante.statusRaspadinha ===
        "raspado"
    ) {

        return true;

    }


    /*
     * Estrutura aninhada.
     */

    if (
        participante.raspadinha &&
        participante.raspadinha.realizada === true
    ) {

        return true;

    }


    if (
        participante.dataRaspagem
    ) {

        return true;

    }


    return false;

}


/* ==========================================================
   VALIDAR PARTICIPAÇÃO
   ========================================================== */

export async function validarParticipacao(
    numero
) {

    const participante =
        await buscarParticipante(
            numero
        );


    if (!participante) {

        return {

            permitido: false,

            motivo:
                "Número da rifa não encontrado.",

            participante: null

        };

    }


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

}


/* ==========================================================
   BUSCAR CAMPANHA
   ========================================================== */

export async function buscarCampanha() {

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

}


/* ==========================================================
   REGISTRAR RESULTADO
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

        raspou: true,

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
                resultado === "liquidificador"
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
            "Erro ao testar Firebase:",
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
   REVELAR RASPADINHA
   ==========================================================

   IMPORTANTE:

   Esta função é chamada pelo sorteio.js.

   O resultado oficial vem da estrutura
   de prêmios cadastrada no Firebase.

   O participante é marcado como utilizado
   antes de finalizar o processo.
   ========================================================== */

export async function revelarRaspadinha(
    numero
) {

    const numeroNormalizado =
        normalizarNumero(numero);


    if (!numeroNormalizado) {

        throw new Error(
            "Número da rifa inválido."
        );

    }


    /*
     * ------------------------------------------------------
     * 1. BUSCAR PARTICIPANTE
     * ------------------------------------------------------
     */

    const participante =
        await validarParticipante(
            numeroNormalizado
        );


    /*
     * ------------------------------------------------------
     * 2. REFERÊNCIA DO PARTICIPANTE
     * ------------------------------------------------------
     */

    const participanteRef =
        referenciaParticipante(
            numeroNormalizado
        );


    /*
     * ------------------------------------------------------
     * 3. RESERVAR O USO DO NÚMERO
     * ------------------------------------------------------
     *
     * A transação evita que duas tentativas simultâneas
     * utilizem o mesmo número.
     */

    const reserva =
        await runTransaction(
            participanteRef,
            atual => {

                if (!atual) {

                    return;

                }


                if (
                    !pagamentoConfirmado(
                        atual
                    )
                ) {

                    return;

                }


                if (
                    jaRaspou(
                        atual
                    )
                ) {

                    return;

                }


                return {

                    ...atual,

                    jaRaspou: true,

                    raspou: true,

                    statusRaspadinha:
                        "processando"

                };

            }
        );


    if (
        !reserva.committed
    ) {

        throw new Error(
            "Este número não pôde ser reservado. Ele pode já estar em uso."
        );

    }


    /*
     * ------------------------------------------------------
     * 4. BUSCAR PRÊMIOS
     * ------------------------------------------------------
     */

    const premios =
        await buscarPremios();


    /*
     * ------------------------------------------------------
     * 5. LOCALIZAR PRÊMIO VINCULADO AO NÚMERO
     * ------------------------------------------------------
     *
     * O Firebase pode ter uma estrutura como:
     *
     * premios:
     *   ferro001:
     *     nome: "ferro"
     *     numeroPremiado: "0025"
     *     disponivel: true
     *
     * ou:
     *
     *   premio1:
     *     numeroRifa: "0025"
     *     premio: "ferro"
     *     disponivel: true
     */

    let premioEncontrado = null;

    let chavePremio = null;


    for (
        const chave in premios
    ) {

        const premio =
            premios[chave];


        if (!premio) {

            continue;

        }


        const numeroPremiado =
            normalizarNumero(
                premio.numeroPremiado ??
                premio.numeroRifa ??
                premio.numero
            );


        const disponivel =
            premio.disponivel === true;


        if (
            numeroPremiado ===
                numeroNormalizado &&
            disponivel
        ) {

            premioEncontrado =
                premio;

            chavePremio =
                chave;

            break;

        }

    }


    /*
     * ------------------------------------------------------
     * 6. DEFINIR RESULTADO
     * ------------------------------------------------------
     */

    let resultado =
        "perdeu";


    if (
        premioEncontrado
    ) {

        const nomePremio =
            premioEncontrado.id ??
            premioEncontrado.premio ??
            premioEncontrado.nome;


        const nomeNormalizado =
            String(
                nomePremio || ""
            )
                .trim()
                .toLowerCase();


        if (
            nomeNormalizado.includes(
                "liquidificador"
            )
        ) {

            resultado =
                "liquidificador";

        } else if (
            nomeNormalizado.includes(
                "ferro"
            )
        ) {

            resultado =
                "ferro";

        } else {

            /*
             * Se o prêmio existir no Firebase,
             * mas não estiver entre os prêmios
             * conhecidos pelo sistema, não liberamos
             * um prêmio desconhecido.
             */

            resultado =
                "perdeu";

        }

    }


    /*
     * ------------------------------------------------------
     * 7. BLOQUEAR PRÊMIO
     * ------------------------------------------------------
     */

    if (
        premioEncontrado &&
        chavePremio &&
        (
            resultado === "ferro" ||
            resultado === "liquidificador"
        )
    ) {

        await update(

            ref(
                db,
                `${CAMINHOS.premios}/${chavePremio}`
            ),

            {

                disponivel:
                    false,

                reservadoPor:
                    numeroNormalizado,

                dataReserva:
                    serverTimestamp()

            }

        );

    }


    /*
     * ------------------------------------------------------
     * 8. REGISTRAR RESULTADO NO PARTICIPANTE
     * ------------------------------------------------------
     */

    await update(

        participanteRef,

        {

            numeroRifa:
                numeroNormalizado,

            jaRaspou:
                true,

            raspou:
                true,

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

        }

    );


    /*
     * ------------------------------------------------------
     * 9. REGISTRAR VENCEDOR
     * ------------------------------------------------------
     */

    if (
        resultado !== "perdeu"
    ) {

        await registrarVencedor(

            numeroNormalizado,

            resultado,

            participante

        );

    }


    /*
     * ------------------------------------------------------
     * 10. ATUALIZAR ESTATÍSTICAS
     * ------------------------------------------------------
     */

    await registrarEstatistica(
        resultado
    );


    /*
     * ------------------------------------------------------
     * 11. RETORNO PARA sorteio.js
     * ------------------------------------------------------
     */

    return {

        numero:
            numeroNormalizado,

        premio:
            resultado,

        ganhou:
            resultado !== "perdeu",

        participante:

            participante,

        processado:
            true

    };

}


/* ==========================================================
   LIBERAR RASPADINHA
   ========================================================== */

export async function liberar(numero) {

    const numeroNormalizado =
        normalizarNumero(numero);


    if (!numeroNormalizado) {

        throw new Error(
            "Número da rifa inválido."
        );

    }


    const participante =
        await validarParticipante(
            numeroNormalizado
        );


    if (!participante) {

        throw new Error(
            "Participante inválido."
        );

    }


    const participanteRef =
        referenciaParticipante(
            numeroNormalizado
        );


    await update(

        participanteRef,

        {

            "raspadinha/liberada":
                true

        }

    );


    return true;

}


/* ==========================================================
   OBTER CAMINHOS FIREBASE
   ========================================================== */

export function obterCaminhosFirebase() {

    return {
        ...CAMINHOS
    };

}


/* ==========================================================
   FIM
   ========================================================== */
