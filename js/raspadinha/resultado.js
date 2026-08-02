/* ==========================================================
   RASPADINHA DA AMIZADE 3.0
   Resultado
========================================================== */

let resultadoAtual = "perdeu";

/* ==========================================================
   DEFINE O RESULTADO
========================================================== */

export function definirResultado(resultado) {

    resultadoAtual = resultado;

}

/* ==========================================================
   OBTÉM O RESULTADO
========================================================== */

export function obterResultado() {

    return resultadoAtual;

}

/* ==========================================================
   CAMINHO DA IMAGEM
========================================================== */

export function obterImagemResultado() {

    switch (resultadoAtual) {

        case "ferro":
            return "/Raspadinha2/img/ferro.png";

        case "liquidificador":
            return "/Raspadinha2/img/liquidificador.png";

        default:
            return "/Raspadinha2/img/perdeu.png";

    }

}
