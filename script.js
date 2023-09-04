"use strict";

// ventana modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCerrarModal = document.querySelector(".btn--cerrar-modal");
const btnAbrirModal = document.querySelectorAll(".btn--mostrar-modal");
const encabezado = document.querySelector(".encabezado");
// scroll suave
const btnIrA = document.querySelector(".btn--ir-a");
const seccion1 = document.querySelector("#seccion--1");
// operaciones
const tabs = document.querySelectorAll(".operaciones__tab");
const tabsContenedor = document.querySelector(".operaciones__tab-contenedor");
const tabsContenido = document.querySelectorAll(".operaciones__contenido");
// nav
const nav = document.querySelector(".nav");
const navTamaño = nav.getBoundingClientRect().height;
// secciones
const totalSecciones = document.querySelectorAll(".seccion");
// tarjetas imagenes
const tarjetasImg = document.querySelectorAll("img[data-src]");
// nav menu responsivo
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector(".nav__menu");

// ----------- cookie ---------------
const cookie = () => {
  const mensaje = document.createElement("div");
  mensaje.classList.add("cookie-mensaje");
  mensaje.innerHTML =
    "Utilizamos cookies para mejorar la funcionalidad, análisis y experiencia de usuario. <button class = 'btn btn--cerrar-cookie'>Entendido!</button>";
  encabezado.prepend(mensaje);

  // --------------- estilo ---------------
  mensaje.style.backgroundColor = "#37383d";
  mensaje.style.height =
    Number.parseFloat(getComputedStyle(mensaje).height) + 30 + "px";

  document
    .querySelector(".btn--cerrar-cookie")
    .addEventListener("click", function () {
      mensaje.remove();
    });
};
cookie();

// --------------- modal ---------------
const abrirModal = function (e) {
  e.preventDefault();
  modal.classList.remove("oculto");
  overlay.classList.remove("oculto");
};

const cerrarModal = function () {
  modal.classList.add("oculto");
  overlay.classList.add("oculto");
};

btnAbrirModal.forEach((btn) => btn.addEventListener("click", abrirModal));

for (let i = 0; i < btnAbrirModal.length; i++)
  btnAbrirModal[i].addEventListener("click", abrirModal);

btnCerrarModal.addEventListener("click", cerrarModal);
overlay.addEventListener("click", cerrarModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("oculto")) {
    cerrarModal();
  }
});

// --------------- scroll suave ---------------
btnIrA.addEventListener("click", function (e) {
  const s1coords = seccion1.getBoundingClientRect();
  seccion1.scrollIntoView({ behavior: "smooth" });
});

// --------------- ir al link son suavidad ---------------
document.querySelector(".nav__menu").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    console.log("Link: ", id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// --------------- operaciones ---------------
tabsContenedor.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operaciones__tab");
  console.log(clicked);

  if (!clicked) return;

  // ocultando tab
  tabs.forEach((t) => t.classList.remove("operaciones__tab--activo"));
  tabsContenido.forEach((c) =>
    c.classList.remove("operaciones__contenido--activo")
  );

  // activando tab
  clicked.classList.add("operaciones__tab--activo");
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operaciones__contenido--${clicked.dataset.tab}`)
    .classList.add("operaciones__contenido--activo");
});

// --------------- opcando links del nav ---------------
const handlerHover = function (e) {
  console.log(this, e.currentTarget);
  // lo usamos básicamente para deshacer lo que hacemos al desplazar el mouse. Entonces:
  // lo opuesto a mouseenter es mouseleave
  // lo opuesto a mouseover es mouseout
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;

    const siblings = link.closest(".nav").querySelectorAll(".nav__link");

    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", handlerHover.bind(0.5));
nav.addEventListener("mouseout", handlerHover.bind(1));

// --------------- sticky nav ---------------
const stickyNav = function (entradas) {
  const [entrada] = entradas;

  if (!entrada.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObeservador = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navTamaño}px`,
});
headerObeservador.observe(encabezado);

// --------------- secciones con suavidad ---------------

const revelarSeccion = function (entradas, observador) {
  const [entrada] = entradas;

  if (!entrada.isIntersecting) return;
  entrada.target.classList.remove("seccion--oculto");
  observador.unobserve(entrada.target);
};

const seccionObservador = new IntersectionObserver(revelarSeccion, {
  root: null,
  threshold: 0.2, //20%
});

totalSecciones.forEach(function (seccion) {
  seccionObservador.observe(seccion);
  seccion.classList.add("seccion--oculto");
});

// --------------- revelando suavemente los elementos ---------------
const cargarImg = function (entradas, observador) {
  const [entrada] = entradas;

  if (!entrada.isIntersecting) return;
  entrada.target.src = entrada.target.dataset.src;
  entrada.target.addEventListener("load", function () {
    entrada.target.classList.remove("lazy-img");
  });
  //   una vez eliminada las clases se desactiva el observador
  observador.unobserve(entrada.target);
};

const imgObservador = new IntersectionObserver(cargarImg, {
  root: null,
  threshold: 0,
  rootMargin: "-200px",
});

tarjetasImg.forEach((img) => imgObservador.observe(img));

// --------------- slider ---------------
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnIzq = document.querySelector(".slider__btn--izq");
  const btnDer = document.querySelector(".slider__btn--der");
  let curSlide = 0;
  const maxSlide = slides.length;
  const puntoContainer = document.querySelector(".puntos");

  const crearPuntos = function () {
    slides.forEach((_, i) =>
      puntoContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="puntos__punto" data-slide="${i}"></button>`
      )
    );
  };

  const puntoActivo = function (slide) {
    document
      .querySelectorAll(".puntos__punto")
      .forEach((punto) => punto.classList.remove("puntos__punto--activo"));

    document
      .querySelector(`.puntos__punto[data-slide="${slide}"]`)
      .classList.add("puntos__punto--activo");
  };

  const irAlSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const siguienteSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    irAlSlide(curSlide);
    puntoActivo(curSlide);
  };

  const anteriorSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    irAlSlide(curSlide);
    puntoActivo(curSlide);
  };

  const init = function () {
    irAlSlide(0);
    crearPuntos();
    puntoActivo(0);
  };
  init();

  // --------------- event handlers ---------------
  btnDer.addEventListener("click", siguienteSlide);
  btnIzq.addEventListener("click", anteriorSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") anteriorSlide();
    e.key === "ArrowRight" && siguienteSlide();
  });

  puntoContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("puntos__punto")) {
      const { slide } = e.target.dataset;
      console.log(slide);
      irAlSlide(slide);
      puntoActivo(slide);
    }
  });
};
slider();

// nav menu responsive
navToggle.addEventListener("click", () => {
  console.log("first");
  navMenu.classList.toggle("nav__menu_activo");
});
