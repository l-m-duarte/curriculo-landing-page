"use strict";

document.documentElement.classList.add("js");

function inicializarMenuMobile() {
    const menuMobile = document.querySelector(".menu-mobile");
    if (!menuMobile) return;

    const botaoMenu = menuMobile.querySelector(".menu-mobile-botao");

    menuMobile.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuMobile.removeAttribute("open");

            const destino = document.querySelector(link.getAttribute("href"));
            if (destino) {
                destino.setAttribute("tabindex", "-1");
                destino.focus({ preventScroll: true });
                destino.addEventListener(
                    "blur",
                    () => destino.removeAttribute("tabindex"),
                    { once: true }
                );
            }
        });
    });

    document.addEventListener("click", (evento) => {
        if (!menuMobile.contains(evento.target)) {
            menuMobile.removeAttribute("open");
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && menuMobile.open) {
            menuMobile.removeAttribute("open");
            botaoMenu?.focus();
        }
    });
}

function inicializarPapelDinamico() {
    const papel = document.querySelector("#papel");
    if (!papel) return;

    const papeis = [
        "Programação de jogos",
        "Lua",
        "C#",
        "Lógica de jogos"
    ];

    let indice = 0;
    papel.textContent = papeis[indice];

    window.setInterval(() => {
        indice = (indice + 1) % papeis.length;
        papel.textContent = papeis[indice];
    }, 2000);
}

function inicializarNavegacaoAtiva() {
    if (!("IntersectionObserver" in window)) return;

    const linksNavegacao = document.querySelectorAll(
        '.navegacao a[href^="#"]'
    );

    const secoesObservadas = [
        ...new Set(
            [...linksNavegacao]
                .map((link) =>
                    document.querySelector(link.getAttribute("href"))
                )
                .filter(Boolean)
        )
    ];

    const secoesVisiveis = new Set();

    function destacarSecao(idSecao) {
        linksNavegacao.forEach((link) => {
            if (link.getAttribute("href") === `#${idSecao}`) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    const observadorSecoes = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    secoesVisiveis.add(entrada.target.id);
                } else {
                    secoesVisiveis.delete(entrada.target.id);
                }
            });

            const secaoVisivel = secoesObservadas.find((secao) =>
                secoesVisiveis.has(secao.id)
            );

            if (secaoVisivel) {
                destacarSecao(secaoVisivel.id);
            }
        },
        {
            rootMargin: "-35% 0px -55%",
            threshold: 0
        }
    );

    secoesObservadas.forEach((secao) => observadorSecoes.observe(secao));
}

function inicializarRevelacao() {
    const elementos = document.querySelectorAll(".revelar");

    if (!elementos.length || !("IntersectionObserver" in window)) {
        elementos.forEach((elemento) => elemento.classList.add("visivel"));
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elementos.forEach((elemento) => elemento.classList.add("visivel"));
        return;
    }

    const observador = new IntersectionObserver(
        (entradas, obs) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;

                entrada.target.classList.add("visivel");
                obs.unobserve(entrada.target);
            });
        },
        { threshold: 0.08 }
    );

    elementos.forEach((elemento) => observador.observe(elemento));
}

function inicializarProgresso() {
    const barraProgresso = document.querySelector("#progresso-leitura");
    if (!barraProgresso) return;

    function atualizarProgresso() {
        const altura =
            document.documentElement.scrollHeight - window.innerHeight;

        const progresso =
            altura > 0
                ? Math.min(1, Math.max(0, window.scrollY / altura))
                : 0;

        barraProgresso.style.transform = `scaleX(${progresso})`;
    }

    window.addEventListener("scroll", atualizarProgresso, {
        passive: true
    });

    window.addEventListener("resize", atualizarProgresso);
    window.addEventListener("load", atualizarProgresso);

    atualizarProgresso();

    if ("ResizeObserver" in window) {
        const observadorTamanho = new ResizeObserver(atualizarProgresso);
        observadorTamanho.observe(document.body);
    }
}

function inicializarVoltarAoTopo() {
    const voltarTopo = document.querySelector(".voltar-topo");
    if (!voltarTopo) return;

    function atualizarVoltarTopo() {
        voltarTopo.classList.toggle(
            "voltar-topo--visivel",
            window.scrollY > window.innerHeight / 2
        );
    }

    window.addEventListener("resize", atualizarVoltarTopo);
    window.addEventListener("scroll", atualizarVoltarTopo, {
        passive: true
    });

    atualizarVoltarTopo();
}

function inicializarCarrosselPortfolio() {
    const slides = [
        ...document.querySelectorAll(
            "[data-carrossel-portfolio] .portfolio-slide"
        )
    ];

    const indice = document.querySelector("#indice-portfolio");
    const anterior = document.querySelector("#portfolio-anterior");
    const proximo = document.querySelector("#portfolio-proximo");

    if (!slides.length || !indice || !anterior || !proximo) return;

    let atual = 0;

    function renderizar() {
        slides.forEach((slide, i) => {
            const ativo = i === atual;

            slide.hidden = !ativo;
            slide.setAttribute("aria-hidden", String(!ativo));
        });

        indice.textContent = `${atual + 1} / ${slides.length}`;
    }

    anterior.addEventListener("click", () => {
        atual = (atual - 1 + slides.length) % slides.length;
        renderizar();
    });

    proximo.addEventListener("click", () => {
        atual = (atual + 1) % slides.length;
        renderizar();
    });

    renderizar();
}

function inicializarFormulario() {
    const formulario = document.querySelector("#form-contato");
    if (!formulario) return;

    const campos = [
        ...formulario.querySelectorAll("input, select, textarea")
    ];

    const feedback = document.querySelector("#feedback-formulario");
    const abrirRascunho = document.querySelector("#abrir-rascunho");
    const contador = document.querySelector("#contador-mensagem");
    const mensagem = document.querySelector("#mensagem");
    const botaoPreparar = formulario.querySelector('[type="submit"]');

    if (
        !feedback ||
        !abrirRascunho ||
        !botaoPreparar ||
        !contador ||
        !mensagem
    ) {
        return;
    }

    formulario.noValidate = true;

    function validarCampo(campo) {
        let mensagemErro = "";
        const valor = campo.value.trim();

        if (!valor) {
            mensagemErro =
                campo.tagName === "SELECT"
                    ? "Selecione um assunto."
                    : "Preencha este campo; somente espaços não são aceitos.";
        } else if (
            campo.type === "email" &&
            campo.validity.typeMismatch
        ) {
            mensagemErro =
                "Informe um e-mail válido, como nome@exemplo.com.";
        } else if (
            campo.maxLength > 0 &&
            campo.value.length > campo.maxLength
        ) {
            mensagemErro = `Use no máximo ${campo.maxLength} caracteres.`;
        } else if (!campo.validity.valid) {
            mensagemErro = "Confira o valor informado neste campo.";
        }

        const erro = document.querySelector(`#erro-${campo.id}`);

        if (erro) {
            erro.textContent = mensagemErro;
            erro.hidden = mensagemErro === "";
        }

        campo.setAttribute(
            "aria-invalid",
            String(mensagemErro !== "")
        );

        return mensagemErro === "";
    }

    function limparRascunho() {
        abrirRascunho.hidden = true;
        abrirRascunho.removeAttribute("href");
        feedback.hidden = true;
    }

    campos.forEach((campo) => {
        campo.addEventListener("blur", () => validarCampo(campo));

        campo.addEventListener("input", () => {
            limparRascunho();

            if (campo.getAttribute("aria-invalid") === "true") {
                validarCampo(campo);
            }
        });

        campo.addEventListener("change", limparRascunho);
    });

    function atualizarContador() {
        const usados = mensagem.value.length;
        const limite = mensagem.maxLength;

        contador.textContent = `${usados} / ${limite} caracteres`;
        contador.classList.toggle(
            "alerta",
            limite - usados <= 20
        );
    }

    mensagem.addEventListener("input", atualizarContador);
    atualizarContador();

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const camposInvalidos = campos.filter(
            (campo) => !validarCampo(campo)
        );

        feedback.hidden = false;

        if (camposInvalidos.length > 0) {
            feedback.dataset.tipo = "erro";
            feedback.textContent =
                "Revise os campos indicados. Nenhuma mensagem foi enviada.";
            camposInvalidos[0].focus();
            return;
        }

        const dados = new FormData(formulario);
        const nome = dados.get("nome").trim();
        const email = dados.get("email").trim();
        const assunto = dados.get("assunto").trim();
        const mensagemTexto = dados.get("mensagem").trim();

        const titulo = `Contato pelo currículo — ${assunto}`;
        const corpo = [
            `Nome: ${nome}`,
            `E-mail: ${email}`,
            "",
            mensagemTexto
        ].join("\n");

        abrirRascunho.href =
            `${formulario.action}?subject=${encodeURIComponent(titulo)}` +
            `&body=${encodeURIComponent(corpo)}`;

        abrirRascunho.hidden = false;

        feedback.dataset.tipo = "orientacao";
        feedback.textContent =
            "Rascunho preparado. Nada foi enviado. Use o link para abrir seu aplicativo de e-mail e concluir o envio por lá.";
    });
}

async function inicializarCopiaEmail() {
    const botaoCopiar = document.querySelector("#copiar-email");
    const linkEmail = document.querySelector(
        '.contato-card a[href^="mailto:"]'
    );
    const feedback = document.querySelector("#feedback-copia");

    if (!botaoCopiar || !linkEmail || !feedback) return;

    botaoCopiar.addEventListener("click", async () => {
        const email = linkEmail
            .getAttribute("href")
            .replace("mailto:", "");

        try {
            await navigator.clipboard.writeText(email);
            feedback.textContent = "E-mail copiado!";
        } catch {
            feedback.textContent =
                `A cópia automática não está disponível. Selecione e copie: ${email}`;
        }
    });
}

function atualizarAnoRodape() {
    const anoRodape = document.querySelector("[data-ano]");

    if (anoRodape) {
        anoRodape.textContent = new Date().getFullYear();
    }
}

inicializarMenuMobile();
inicializarPapelDinamico();
inicializarNavegacaoAtiva();
inicializarRevelacao();
inicializarProgresso();
inicializarVoltarAoTopo();
inicializarCarrosselPortfolio();
inicializarFormulario();
inicializarCopiaEmail();
atualizarAnoRodape();
