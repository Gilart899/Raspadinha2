/* ==========================================================
   RASPADINHA DA AMIZADE 6.0
   GILFEST
   APP.JS
   ==========================================================
   ATENÇÃO:
   Este arquivo mantém a lógica da aplicação.
   Não altera Firebase, configuração de prêmios ou regras.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTOS DA INTERFACE
       ====================================================== */

    const btnRaspar = document.querySelector(".btn-raspar");
    const modal = document.querySelector(".modal-raspadinha");
    const btnFechar = document.querySelector(".btn-fechar");
    const btnContinuar = document.querySelector(".btn-continuar");

    const mensagemSistema =
        document.querySelector(".mensagem-sistema");

    /* ======================================================
       ABRIR MODAL
       ====================================================== */

    function abrirModal() {

        if (!modal) return;

        modal.classList.remove("hidden");

        document.body.style.overflow = "hidden";

        modal.scrollTop = 0;
    }

    /* ======================================================
       FECHAR MODAL
       ====================================================== */

    function fecharModal() {

        if (!modal) return;

        modal.classList.add("hidden");

        document.body.style.overflow = "";
    }

    /* ======================================================
       BOTÃO RASPAR
       ====================================================== */

    if (btnRaspar) {

        btnRaspar.addEventListener("click", () => {

            abrirModal();

            mostrarMensagem(
                "🍀 Sua raspadinha está pronta!"
            );

        });

    }

    /* ======================================================
       BOTÃO FECHAR
       ====================================================== */

    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModal
        );

    }

    /* ======================================================
       BOTÃO CONTINUAR
       ====================================================== */

    if (btnContinuar) {

        btnContinuar.addEventListener(
            "click",
            fecharModal
        );

    }

    /* ======================================================
       FECHAR CLICANDO FORA DO MODAL
       ====================================================== */

    if (modal) {

        modal.addEventListener("click", (event) => {

            if (event.target === modal) {

                fecharModal();

            }

        });

    }

    /* ======================================================
       TECLA ESC
       ====================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            if (
                modal &&
                !modal.classList.contains("hidden")
            ) {

                fecharModal();

            }

        }

    });

    /* ======================================================
       MENSAGEM DO SISTEMA
       ====================================================== */

    function mostrarMensagem(texto) {

        if (!mensagemSistema) return;

        mensagemSistema.textContent = texto;

        mensagemSistema.classList.add("visivel");

        clearTimeout(
            mensagemSistema._timer
        );

        mensagemSistema._timer =
            setTimeout(() => {

                mensagemSistema.classList.remove(
                    "visivel"
                );

            }, 3000);

    }

    /* ======================================================
       ANIMAÇÃO SUAVE AO ENTRAR NA PÁGINA
       ====================================================== */

    document.body.classList.add("pagina-carregada");

    /* ======================================================
       ANIMAÇÃO DOS ELEMENTOS
       ====================================================== */

    const elementosAnimados = document.querySelectorAll(
        ".premio-card, .beneficio-card"
    );

    elementosAnimados.forEach((elemento, index) => {

        elemento.style.animationDelay =
            `${index * 0.12}s`;

    });

    /* ======================================================
       EFEITO DE MOVIMENTO DO FUNDO
       ====================================================== */

    let ultimoMovimento = 0;

    window.addEventListener(
        "mousemove",
        (event) => {

            const agora =
                Date.now();

            if (
                agora - ultimoMovimento < 30
            ) return;

            ultimoMovimento = agora;

            const x =
                (event.clientX /
                    window.innerWidth -
                    0.5) * 2;

            const y =
                (event.clientY /
                    window.innerHeight -
                    0.5) * 2;

            document.documentElement.style
                .setProperty(
                    "--mouse-x",
                    `${x * 8}px`
                );

            document.documentElement.style
                .setProperty(
                    "--mouse-y",
                    `${y * 8}px`
                );

        }
    );

});
