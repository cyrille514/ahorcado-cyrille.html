// Enlazado del array de palabras
const PALABRAS = [
  'REACT',
  'JAVASCRIPT',
  'COMPONENTE',
  'PROGRAMACION',
  'DESARROLLO',
  'DESPLIEGUE',
  'INTERFAZ',
  'VARIABLE'
];

// Sélecteurs des éléments du SVG pour les erreurs
const partesCuerpo = [
  "#cabeza",
  "#tronco",
  "#brazo-izq",
  "#brazo-der",
  "#pierna-izq",
  "#pierna-der"
];

// Palette de couleurs pour les touches cliquées
const coloresTeclas = [
  "bg-rose-600/90 border-rose-800 text-white",
  "bg-orange-600/90 border-orange-800 text-white",
  "bg-amber-600/90 border-amber-800 text-white",
  "bg-emerald-600/90 border-emerald-800 text-white",
  "bg-teal-600/90 border-teal-800 text-white",
  "bg-cyan-600/90 border-cyan-800 text-white",
  "bg-indigo-600/90 border-indigo-800 text-white",
  "bg-fuchsia-600/90 border-fuchsia-800 text-white",
  "bg-pink-600/90 border-pink-800 text-white"
];

// Variables d'état du jeu
let PALABRA, TECLADO, ERROR, MENSAJE, PUNTUACION_ELEM;
let palabraRandom = "";
let palabraAdivinada = [];
const intentos = 6;
let error = 0;
let puntuacion = 0; // Lógica de Puntuación

document.addEventListener("DOMContentLoaded", () => {
  PALABRA = document.getElementById('palabra');
  TECLADO = document.getElementById('teclado');
  ERROR = document.getElementById('error');
  MENSAJE = document.getElementById('mensaje');
  PUNTUACION_ELEM = document.getElementById('puntuacion');

  const btnEmpezar = document.getElementById('btn-empezar');
  if (btnEmpezar) {
    btnEmpezar.addEventListener('click', empezar);
  }
});

function pintarErrores() {
  if (error > 0 && error <= partesCuerpo.length) {
    const parte = document.querySelector(partesCuerpo[error - 1]);
    if (parte) {
      parte.classList.remove("hidden");
      parte.style.display = "block";
    }
  }
  ERROR.innerHTML = `${error}/${intentos}`;
}

function pintarPalabra() {
  PALABRA.innerHTML = '';
  palabraAdivinada.forEach(letra => {
    const box = document.createElement('div');
    box.className = "w-9 h-11 sm:w-11 sm:h-13 bg-slate-950 border-2 border-purple-500/40 rounded-xl flex items-center justify-center font-mono text-xl sm:text-2xl font-black text-fuchsia-300 shadow-md shadow-purple-950/50";
    box.innerText = letra === '_' ? '' : letra;
    PALABRA.appendChild(box);
  });
}

function empezar() {
  palabraRandom = PALABRAS[Math.floor(Math.random() * PALABRAS.length)].toUpperCase();
  palabraAdivinada = Array(palabraRandom.length).fill('_');

  document.querySelectorAll(".parte-cuerpo").forEach(parte => {
    parte.classList.add("hidden");
    parte.style.display = "none";
  });

  error = 0;
  MENSAJE.innerHTML = "";
  MENSAJE.className = "text-base sm:text-lg font-bold mt-2 min-h-[28px]";
  pintarErrores();
  pintarPalabra();
  teclado();
}

function teclado() {
  TECLADO.innerHTML = '';

  const filas = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  filas.forEach((fila) => {
    const filaDiv = document.createElement("div");
    filaDiv.className = "flex justify-center gap-1.5 w-full my-1";

    fila.forEach((letra) => {
      const button = document.createElement("button");
      button.id = letra;
      button.className = `
        w-8 h-10 sm:w-11 sm:h-12 
        font-mono font-bold text-slate-200 text-sm sm:text-base
        bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600
        border-b-4 border-slate-950 active:border-b-0 active:translate-y-1
        rounded-lg shadow-md transition-all duration-75
        disabled:border-b-0 disabled:translate-y-1 disabled:cursor-not-allowed
        flex items-center justify-center select-none
      `;
      button.addEventListener("click", () => pulsar(letra));
      button.innerHTML = letra;
      filaDiv.appendChild(button);
    });

    TECLADO.appendChild(filaDiv);
  });
}

function deshabilitarTeclado() {
  const botones = TECLADO.querySelectorAll("button");
  botones.forEach(btn => btn.disabled = true);
}

function pulsar(letra) {
  const boton = document.getElementById(letra);
  if (boton) {
    boton.disabled = true;
    const colorAleatorio = coloresTeclas[Math.floor(Math.random() * coloresTeclas.length)];
    boton.classList.remove("bg-slate-800/80", "hover:bg-slate-700", "text-slate-200", "border-slate-950");
    boton.classList.add(...colorAleatorio.split(" "));
  }

  if (palabraRandom.includes(letra)) {
    for (let i = 0; i < palabraRandom.length; i++) {
      if (palabraRandom[i] === letra) {
        palabraAdivinada[i] = letra;
      }
    }
    pintarPalabra();

    // Lógica de Puntuación: Victoria (+10 puntos)
    if (!palabraAdivinada.includes('_')) {
      puntuacion += 10;
      PUNTUACION_ELEM.innerHTML = puntuacion;
      MENSAJE.className = "text-base sm:text-lg font-bold mt-2 text-emerald-400";
      MENSAJE.innerHTML = "¡Felicidades! Has ganado 10 puntos 🎉";
      deshabilitarTeclado();
    }
  } else {
    error++;
    pintarErrores();

    // Lógica de Puntuación: Derrota (-5 puntos, minimum 0)
    if (error >= intentos) {
      puntuacion = Math.max(0, puntuacion - 5);
      PUNTUACION_ELEM.innerHTML = puntuacion;
      MENSAJE.className = "text-base sm:text-lg font-bold mt-2 text-rose-400";
      MENSAJE.innerHTML = `¡Has perdido! La palabra era: <strong class="underline">${palabraRandom}</strong> (-5 pts)`;
      
      PALABRA.innerHTML = '';
      palabraRandom.split('').forEach(l => {
        const box = document.createElement('div');
        box.className = "w-9 h-11 sm:w-11 sm:h-13 bg-rose-950/60 border-2 border-rose-500/50 rounded-xl flex items-center justify-center font-mono text-xl sm:text-2xl font-black text-rose-300 shadow-md";
        box.innerText = l;
        PALABRA.appendChild(box);
      });

      deshabilitarTeclado();
    }
  }
}
