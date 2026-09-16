// --- VARIABLES GLOBALES ---
let numeroAnterior = '';
let numeroActual = '';
let operador = '';

// Usamos un Array para guardar el historial (Cumple requisito de colección/array)
let historial = [];

// Array simple con los textos de los botones para no repetir HTML
const botonesCalculadora = [
    'C', 'DEL', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
];

// --- NAVEGACIÓN (Cambiar contenido sin alterar la página) ---

// Función que arranca todo cuando carga la página
function iniciarApp() {
    crearMenu();
    mostrarSeccion('Calculadora'); // Mostramos la calculadora por defecto
}

function crearMenu() {
    let nav = document.getElementById('barra-navegacion');
    let secciones = ['Calculadora', 'Historial'];

    // Bucle FOR para crear los botones del menú (Cumple estructura FOR)
    for (let i = 0; i < secciones.length; i++) {
        let boton = document.createElement('button');
        boton.innerText = secciones[i];
        boton.className = 'btn-nav';
        
        // Al hacer clic, carga la sección correspondiente
        boton.onclick = function() {
            mostrarSeccion(secciones[i]);
        };
        nav.appendChild(boton);
    }
}

function mostrarSeccion(nombre) {
    let contenedor = document.getElementById('app-contenedor');

    // Bucle WHILE para limpiar la pantalla sin recargar la web (Cumple estructura WHILE)
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }

    // Estructura IF para decidir qué pantalla armar (Cumple estructura IF)
    if (nombre === 'Calculadora') {
        armarCalculadora(contenedor);
    } else if (nombre === 'Historial') {
        armarHistorial(contenedor);
    }
}

// --- ARMADO DE PANTALLAS DESDE JS (Mínimo HTML) ---

function armarCalculadora(contenedor) {
    let caja = document.createElement('div');
    caja.className = 'caja-calc';

    let pantalla = document.createElement('div');
    pantalla.id = 'pantalla-calc';
    pantalla.className = 'visor-texto';
    pantalla.innerText = '0';
    caja.appendChild(pantalla);

    let grilla = document.createElement('div');
    grilla.className = 'grilla-teclas';

    // Bucle FOR para crear todos los botones matemáticos
    for (let i = 0; i < botonesCalculadora.length; i++) {
        let textoBoton = botonesCalculadora[i];
        let btn = document.createElement('button');
        btn.innerText = textoBoton;
        btn.className = 'tecla';

        // Pintamos de otro color las acciones y operadores
        if (textoBoton === 'C' || textoBoton === 'DEL') {
            btn.classList.add('accion');
        } else if (['%', '/', '*', '-', '+', '='].includes(textoBoton)) {
            btn.classList.add('operacion');
        }

        // Cuando hacen clic, mandamos el texto a una función central que decide qué hacer
        btn.onclick = function() {
            procesarClic(textoBoton);
        };
        
        grilla.appendChild(btn);
    }

    caja.appendChild(grilla);
    contenedor.appendChild(caja);
    
    // Mostramos los valores actuales
    actualizarPantalla();
}

function armarHistorial(contenedor) {
    let caja = document.createElement('div');
    caja.className = 'panel-info';
    caja.innerHTML = '<h2>Historial de Operaciones</h2>';

    let lista = document.createElement('ul');
    lista.id = 'lista-historial';

    if (historial.length === 0) {
        lista.innerHTML = '<p>No hay cálculos guardados todavía.</p>';
    } else {
        // Recorremos el Array del historial
        for (let i = 0; i < historial.length; i++) {
            let li = document.createElement('li');
            li.innerText = historial[i];
            lista.appendChild(li);
        }
    }

    caja.appendChild(lista);
    contenedor.appendChild(caja);
}

// --- LÓGICA DE LA CALCULADORA ---

function procesarClic(tecla) {
    // Clasificamos qué botón se tocó
    if (tecla >= '0' && tecla <= '9') {
        // Si es un número
        if (operador === '') {
            numeroAnterior += tecla;
        } else {
            numeroActual += tecla;
        }
    } else if (tecla === '.') {
        // Si es un punto decimal
        if (operador === '' && !numeroAnterior.includes('.')) {
            numeroAnterior += '.';
        } else if (operador !== '' && !numeroActual.includes('.')) {
            numeroActual += '.';
        }
    } else if (tecla === 'C') {
        // Limpiar todo
        numeroAnterior = '';
        numeroActual = '';
        operador = '';
    } else if (tecla === 'DEL') {
        // Borrar el último caracter
        if (numeroActual !== '') {
            numeroActual = numeroActual.slice(0, -1);
        } else if (operador !== '') {
            operador = '';
        } else if (numeroAnterior !== '') {
            numeroAnterior = numeroAnterior.slice(0, -1);
        }
    } else if (tecla === '=') {
        calcular();
    } else {
        // Es un operador matemático (+, -, *, /, %)
        if (numeroAnterior !== '' && numeroActual !== '') {
            calcular(); // Si ya hay dos números, calculamos el resultado parcial
        }
        operador = tecla;
    }
    
    actualizarPantalla();
}

function calcular() {
    if (numeroAnterior === '' || numeroActual === '' || operador === '') {
        return; // Faltan datos, salimos de la función
    }

    let n1 = parseFloat(numeroAnterior);
    let n2 = parseFloat(numeroActual);
    let resultado = 0;
    let textoOperacion = numeroAnterior + ' ' + operador + ' ' + numeroActual;

    // Estructura SWITCH para resolver las matemáticas (Cumple estructura SWITCH)
    switch (operador) {
        case '+':
            resultado = n1 + n2;
            break;
        case '-':
            resultado = n1 - n2;
            break;
        case '*':
            resultado = n1 * n2;
            break;
        case '/':
            if (n2 === 0) {
                resultado = 'Error';
            } else {
                resultado = n1 / n2;
            }
            break;
        case '%':
            resultado = n1 % n2; // Calculamos el resto/módulo
            break;
    }

    // Si no hubo error por dividir por cero, guardamos en el historial
    if (resultado !== 'Error') {
        // Redondear para evitar decimales infinitos de JS
        resultado = Math.round(resultado * 100000000) / 100000000;
        historial.push(textoOperacion + ' = ' + resultado);
    }

    // Preparamos las variables para el siguiente cálculo
    numeroAnterior = resultado.toString();
    operador = '';
    numeroActual = '';
}

function actualizarPantalla() {
    let pantalla = document.getElementById('pantalla-calc');
    
    // Si la pantalla no existe (porque estamos en el historial), no hacemos nada
    if (!pantalla) return; 

    if (numeroAnterior === '') {
        pantalla.innerText = '0';
    } else if (operador === '') {
        pantalla.innerText = numeroAnterior;
    } else if (numeroActual === '') {
        pantalla.innerText = numeroAnterior + ' ' + operador;
    } else {
        pantalla.innerText = numeroAnterior + ' ' + operador + ' ' + numeroActual;
    }
}

// Ejecutamos la app al cargar el archivo
iniciarApp();
