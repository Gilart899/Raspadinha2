/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Resultado
========================================================== */

let resultadoAtual = "perdeu";

export function definirResultado(resultado) {
    resultadoAtual = resultado;
}

export function obterResultado() {
    return resultadoAtual;
}

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
