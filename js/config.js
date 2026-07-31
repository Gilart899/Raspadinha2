/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Configurações Gerais
========================================================== */

export const CONFIG = {

    /* ===========================
       Sistema
    =========================== */

    NOME_SISTEMA: "Raspadinha da Amizade",

    VERSAO: "2.0.0",

    MODO_TESTE: true,

    CAMPANHA_ATIVA: true,

    /* ===========================
       Raspadinha
    =========================== */

    PORCENTAGEM_REVELAR: 60,

    RAIO_RASPAGEM: 22,

    LARGURA_CANVAS: 320,

    ALTURA_CANVAS: 320,

    /* ===========================
       Prêmios
    =========================== */

    MAX_TENTATIVAS: 1,

    /* ===========================
       Firebase
    =========================== */

    DATABASE: {

        CONFIG: "config",

        PARTICIPANTES: "participantes",

        TENTATIVAS: "tentativas",

        RESERVAS: "reservas",

        VENCEDORES: "vencedores",

        PREMIOS: "premios",

        LOGS: "logs"

    }

};

export default CONFIG;
