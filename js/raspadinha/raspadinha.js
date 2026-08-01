/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
   Controle da Janela da Raspadinha
========================================================== */

let modal = null;

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

export function iniciarRaspadinha() {

    modal = document.getElementById("modalRaspadinha");

    if (!modal) {

        console.error("Modal da raspadinha não encontrado.");

    }

}

/* ==========================================================
   ABRIR
========================================================== */

export function abrirRaspadinha() {

    if (!modal) return;

    modal.classList.remove("hidden");

}

/* ==========================================================
   FECHAR
========================================================== */

export function fecharRaspadinha() {

    if (!modal) return;

    modal.classList.add("hidden");

}
