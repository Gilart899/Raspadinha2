/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   MOTOR DE SORTEIO

   Base compatível com:

   config.js
   firebase.js
   firebase-raspadinha.js
   resultado.js
   raspadinha.js

   O Firebase fornece os dados oficiais da campanha.
========================================================== */

import { CONFIG } from "../config.js";

import {
    validarParticipacao,
    buscarPremios,
    registrarResultado,
    registrarVencedor,
    registrarEstatistica
} from "../firebase/firebase-raspadinha.js";

import {
    definirResultado
} from "./resultado.js";


/* ==========================================================
   ESTADO
========================================================== */

let resultadoAtual = "perdeu";

let participanteAtual = null;

let numeroAtual = null;

let executando = false;


/* ==========================================================
   INICIAR
========================================================== */

export function iniciarSorteio() {

    resultadoAtual = "perdeu";

    participanteAtual = null;

    numeroAtual = null;

    executando = false;

    definirResultado("perdeu");

}


/* ==========================================================
   DEFINIR NÚMERO
========================================================== */

export function definirNumero(numero) {

    if (
        numero === null ||
        numero === undefined ||
        numero === ""
    ) {

        numeroAtual = null;

        return null;

    }


    const valor = String(numero)
        .replace(/\D/g, "");


    if (!valor) {

        numeroAtual = null;

        return null;

    }


    const numeroConvertido =
        Number(valor);


    if (
        !Number.isInteger(
            numeroConvertido
        )
    ) {

        numeroAtual = null;

        return null;

    }


    if (
        numeroConvertido < 1 ||
        numeroConvertido > 1000
    ) {

        numeroAtual = null;

        return null;

    }


    /*
     * Mantemos o número como número lógico
     * sem zeros à esquerda.
     *
     * O firebase-raspadinha.js é responsável
     * por normalizar para 0001...1000.
     */

    numeroAtual =
        String(numeroConvertido);


    return numeroAtual;

}


/* ==========================================================
   OBTER NÚMERO
========================================================== */

export function obterNumero() {

    return numeroAtual;

}


/* ==========================================================
   DEFINIR PARTICIPANTE
========================================================== */

export function definirParticipante(
    participante
) {

    participanteAtual =
        participante || null;


    if (
        participante &&
        participante.numero !== undefined
    ) {

        definirNumero(
            participante.numero
        );

    }


    return participanteAtual;

}


/* ==========================================================
   OBTER PARTICIPANTE
========================================================== */

export function obterParticipanteAtual() {

    return participanteAtual;

}


/* ==========================================================
   REALIZAR SORTEIO
========================================================== */

export async function realizarSorteio(
    numero = null
) {

    if (executando) {

        throw new Error(
            "Um sorteio já está em andamento."
        );

    }


    executando = true;


    try {

        /* ==================================================
           DEFINIR NÚMERO
        ================================================== */

        if (numero !== null) {

            definirNumero(numero);

        }


        if (!numeroAtual) {

            throw new Error(
                "Número da rifa não informado."
            );

        }


        /* ==================================================
           MODO DE TESTE
        ================================================== */

        if (
            CONFIG.modoTeste === true
        ) {

            resultadoAtual =
                realizarSorteioTeste();


            definirResultado(
                resultadoAtual
            );


            return resultadoAtual;

        }


        /* ==================================================
           VALIDAR PARTICIPAÇÃO
        ================================================== */

        const validacao =
            await validarParticipacao(
                numeroAtual
            );


        if (
            !validacao ||
            validacao.permitido !== true
        ) {

            const motivo =
                validacao?.motivo ||
                "Participação não autorizada.";


            throw new Error(
                motivo
            );

        }


        /* ==================================================
           GUARDAR PARTICIPANTE
        ================================================== */

        participanteAtual =
            validacao.participante ||
            null;


        /* ==================================================
           BUSCAR PRÊMIOS
        ================================================== */

        const premios =
            await buscarPremios();


        /* ==================================================
           DETERMINAR RESULTADO
           
           O resultado oficial da campanha é obtido
           através da configuração existente no Firebase.

           O sistema procura um prêmio cujo númeroPremiado
           corresponda ao número da rifa.
        ================================================== */

        resultadoAtual =
            determinarResultado(
                numeroAtual,
                premios
            );


        /* ==================================================
           REGISTRAR RESULTADO
        ================================================== */

        await registrarResultado(
            numeroAtual,
            resultadoAtual
        );


        /* ==================================================
           REGISTRAR VENCEDOR
        ================================================== */

        if (
            resultadoAtual !== "perdeu"
        ) {

            await registrarVencedor(

                numeroAtual,

                resultadoAtual,

                participanteAtual

            );

        }


        /* ==================================================
           ATUALIZAR ESTATÍSTICAS
        ================================================== */

        await registrarEstatistica(
            resultadoAtual
        );


        /* ==================================================
           ATUALIZAR RESULTADO CENTRAL
        ================================================== */

        definirResultado(
            resultadoAtual
        );


        console.log(
            "================================"
        );

        console.log(
            "SORTEIO FINALIZADO"
        );

        console.log(
            "Número:",
            numeroAtual
        );

        console.log(
            "Resultado:",
            resultadoAtual
        );

        console.log(
            "================================"
        );


        return resultadoAtual;

    } catch (erro) {

        console.error(
            "Erro no sorteio:",
            erro
        );


        /*
         * Não esconder o erro real.
         */

        resultadoAtual =
            "perdeu";


        definirResultado(
            "perdeu"
        );


        throw erro;

    } finally {

        executando = false;

    }

}


/* ==========================================================
   DETERMINAR RESULTADO
========================================================== */

function determinarResultado(
    numero,
    premios
) {

    if (
        !premios ||
        typeof premios !== "object"
    ) {

        return "perdeu";

    }


    const numeroTexto =
        String(numero);


    const numeroSemZeros =
        String(
            Number(numero)
        );


    for (
        const chave
        in premios
    ) {

        const premio =
            premios[chave];


        if (
            !premio ||
            typeof premio !== "object"
        ) {

            continue;

        }


        /*
         * O prêmio precisa estar disponível.
         */

        if (
            premio.disponivel === false
        ) {

            continue;

        }


        /*
         * Aceitamos os formatos:
         *
         * 0001
         * 1
         * "0001"
         * "1"
         */

        const numeroPremiado =
            premio.numeroPremiado;


        if (
            numeroPremiado ===
            undefined ||
            numeroPremiado === null
        ) {

            continue;

        }


        const premioTexto =
            String(
                numeroPremiado
            );


        const premioSemZeros =
            String(
                Number(
                    numeroPremiado
                )
            );


        if (
            premioTexto === numeroTexto ||
            premioSemZeros === numeroSemZeros
        ) {

            return normalizarPremio(
                premio,
                chave
            );

        }

    }


    return "perdeu";

}


/* ==========================================================
   NORMALIZAR PRÊMIO
========================================================== */

function normalizarPremio(
    premio,
    chave
) {

    /*
     * Primeiro tenta usar o ID.
     */

    const id =
        String(
            premio.id ||
            chave ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        id === "ferro"
    ) {

        return "ferro";

    }


    if (
        id === "liquidificador"
    ) {

        return "liquidificador";

    }


    /*
     * Depois tenta pelo nome.
     */

    const nome =
        String(
            premio.nome ||
            premio.premio ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        nome === "ferro" ||
        nome === "ferro elétrico" ||
        nome === "ferro eletrico"
    ) {

        return "ferro";

    }


    if (
        nome === "liquidificador"
    ) {

        return "liquidificador";

    }


    /*
     * Se o prêmio não pertence aos prêmios
     * conhecidos da campanha, não libera.
     */

    console.warn(
        "Prêmio desconhecido no Firebase:",
        premio
    );


    return "perdeu";

}


/* ==========================================================
   SORTEIO DE TESTE
========================================================== */

export function realizarSorteioTeste() {

    const chanceFerro =
        Number(
            CONFIG.probabilidades?.ferro ||
            0.001
        );


    const chanceLiquidificador =
        Number(
            CONFIG.probabilidades?.liquidificador ||
            0.002
        );


    const numero =
        Math.random();


    if (
        numero < chanceFerro
    ) {

        return "ferro";

    }


    if (
        numero <
        (
            chanceFerro +
            chanceLiquidificador
        )
    ) {

        return "liquidificador";

    }


    return "perdeu";

}


/* ==========================================================
   ALTERAR MODO TESTE
========================================================== */

export function alterarModoTeste(
    valor
) {

    /*
     * CONFIG é uma constante exportada.
     *
     * Para não tentar substituir o objeto inteiro,
     * alteramos somente a propriedade.
     */

    CONFIG.modoTeste =
        Boolean(valor);

}


/* ==========================================================
   VERIFICAR EXECUÇÃO
========================================================== */

export function sorteioEmAndamento() {

    return executando;

}


/* ==========================================================
   OBTER RESULTADO
========================================================== */

export function obterResultadoAtual() {

    return resultadoAtual;

}


/* ==========================================================
   LIMPAR SORTEIO
========================================================== */

export function limparSorteio() {

    resultadoAtual =
        "perdeu";

    participanteAtual =
        null;

    numeroAtual =
        null;

    executando =
        false;


    definirResultado(
        "perdeu"
    );

}


/* ==========================================================
   FIM DO MOTOR DE SORTEIO 6.0
========================================================== */
