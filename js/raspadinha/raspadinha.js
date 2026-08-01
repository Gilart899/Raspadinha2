/* ==========================================================
   RASPADINHA DA AMIZADE 2.0
========================================================== */

let modal;

let btnFechar;

/* ==========================================================
   INICIAR
========================================================== */

export function iniciarRaspadinha(){

    modal = document.getElementById("modalRaspadinha");

    btnFechar = document.getElementById("btnFecharRaspadinha");

    if(btnFechar){

        btnFechar.addEventListener(

            "click",

            fecharRaspadinha

        );

    }

}

/* ==========================================================
   ABRIR
========================================================== */

export function abrirRaspadinha(){

    if(!modal) return;

    modal.classList.remove("hidden");

}

/* ==========================================================
   FECHAR
========================================================== */

export function fecharRaspadinha(){

    if(!modal) return;

    modal.classList.add("hidden");

}
