# Proyecto de implementación de Scanner y Parser

## Descripción

Este proyecto es una implementación de un analizador léxico y sintáctico basado en Autómatas Finitos Determinísticos (AFD), Autómatas de Pila Determinista (APD) y un parser LL(1). Está diseñado para analizar un lenguaje de programación personalizado que incluye declaraciones de variables, asignaciones, expresiones, condicionales y una función imprime.

### Flujo de Trabajo

1. El scanner genera tokens de uno en uno conforme se leen los caracteres del código.
2. El parser identifica qué autómata o parser secundario debe ser llamado para procesar los siguientes tokens.
3. Si el autómata o parser secundario reconoce la estructura, el parser principal continúa con el siguiente token.

## Cómo ejecutar el proyecto

Puede ver el proyecto en funcionamiento en [este enlace](https://divorcedlance.github.io/scanner-parser/).

Si desea ejecutar el proyecto de manera local, siga estos pasos:

1. Clone el repositorio en su máquina local:

```
git clone https://github.com/divorcedlance/scanner-parser.git
```

2. Acceda al directorio del proyecto:

```
cd scanner-parser
```

3. Abra el archivo `index.html` en su navegador. **Nota:** Puede que necesite utilizar un servidor local para que el JavaScript se cargue correctamente. Puede usar una extensión como "Live Server" en Visual Studio Code o cualquier otro servidor web local que prefiera.

## Interfaz de Usuario

La interfaz de usuario se divide en dos secciones principales: el área de código y el área de salida. El área de código se utiliza para ingresar el código fuente y el área de salida se utiliza para mostrar los resultados del análisis.

<!-- TODO: Añadir imagen de la interfaz de usuario -->

### Área de Código

El área de código tiene un área de texto que se puede utilizar para ingresar el código fuente. También tiene 2 botones uno para copiar el código fuente y otro para usar un ejemplo de código aleatorio.

### Área de Salida

El área de salida tiene un área de texto que se utiliza para mostrar los resultados del análisis. También tiene un botón para copiar el texto de salida al portapapeles.

## Implementación del scanner

El scanner, también conocido como analizador léxico, es responsable de transformar el código fuente en una secuencia de tokens, que se utilizan posteriormente en el análisis sintáctico.

### Inicialización
Cuando se crea un objeto de la clase `Scanner`, se inicializan varios atributos:

- `code`: El código fuente que se analizará.
- `TokenType`: Una enumeración de los diferentes tipos de tokens que se pueden encontrar.
- `palabrasReservadas`: Un listado de palabras que el lenguaje reconoce como reservadas.
- `linea`: Un contador que mantiene el seguimiento de la línea actual del código fuente.
- `tokenGenerator`: Una referencia al generador que produce tokens uno a uno.

### Generación de tokens
Para convertir el código en tokens, utilizamos un generador que itera sobre cada carácter del código fuente:

El procedimiento es sencillo:

- Se itera sobre cada carácter.
- Si se encuentra un salto de línea, se aumenta el contador de líneas y se clasifica el lexema si existe.
- Si se encuentra un espacio, símbolo u operador, se clasifica el lexema acumulado y se reinicia. En el caso de símbolos u operandos, estos también se clasifican.
- Si se encuentra una letra o un número, se añade al lexema.
- Cualquier otro carácter se trata como desconocido.

### Clasificación de lexemas
Una vez que se ha identificado un lexema, es necesario determinar a qué tipo de token pertenece. Esto se logra a través del método `clasificarLexema`:

El método verifica si el lexema es:

- Una palabra reservada.
- Un identificador válido.
- Un número (entero o decimal).
- Un operador.
- Un símbolo.
- O cualquier otro carácter desconocido.

Si se encuentra un lexema desconocido, se muestra un mensaje de error utilizando la función `displayError`.

### Obteniendo tokens sucesivos
El método `getToken` permite obtener el siguiente token del código fuente. Internamente, utiliza el generador para obtener tokens y manejar casos especiales, como múltiples saltos de línea consecutivos:

Al final del código fuente, se devuelve un token especial `EOF` que indica el final del archivo.

## Implementación del parser

La clase `Parser` está diseñada para analizar la sintaxis de un lenguaje de programación utilizando varias técnicas, como Autómatas Finitos Deterministas (AFD), Autómatas de Pila Determinista (APD) y un parser LL(1). El parser se encarga de decidir qué técnica utilizar en base al token inicial de una nueva estructura.

### Tokens Iniciales

#### Palabras Reservadas
* `si`, `sino`, `fsi`, `mientras`, `fmientras`: Gestionados por APD.
* `enter`, `real`: Gestionados por AFD1.
* `imprime`: Gestionado por AFD2.

#### Identificadores
* Gestionados por AFD3.

### **1. Autómatas Finitos Deterministas (AFD)**

Estos se utilizan para reconocer estructuras simples como declaraciones de variables, la función `imprime`, asignaciones y condicionales.

#### AFD1: Declaración de Variables

![AFD1](diagramas/AFD1.png)

$$
\begin{aligned}
q0, \text{entero} \implies q1 \\
q0, \text{real} \implies q1 \\
q1, \text{ID} \implies q2 \\
q2, \text{=} \implies q3 \\
q2, \text{,} \implies q1 \\
q2, \text{\\n} \implies qf \\
q3, \text{EXP} \implies q4 \\
q4, \text{,} \implies q1 \\
q4, \text{\\n} \implies qf \\
\end{aligned}
$$

Estado inicial: $q0$  
Estados finales: $qf$

```js
this.AFD1 = {
  'name': 'declaración de variables',
  'q0': { 'entero': 'q1', 'real': 'q1' },
  'q1': { 'ID': 'q2' },
  'q2': { ',': 'q1', '=': 'q3', '\n': 'qf', 'EOF': 'qf' },
  'q3': { 'EXP': 'q4' },
  'q4': { ',': 'q1', '\n': 'qf', 'EOF': 'qf' },
  'estado_final': ['qf']
};
```

#### AFD2: Función imprime

![AFD2](diagramas/AFD2.png)

$$
\begin{aligned}
q0, \text{imprime} \implies q1 \\
q1, \text{EXP} \implies q2 \\
q2, \text{,} \implies q1 \\
q2, \text{\\n} \implies qf \\
\end{aligned}
$$

Estado inicial: $q0$  
Estados finales: $qf$

```js
this.AFD2 = {
  'name': 'funcion imprime',
  'q0': { 'imprime': 'q1' },
  'q1': { 'EXP': 'q2' },
  'q2': { ',': 'q1', '\n': 'qf', 'EOF': 'qf' },
  'estado_final': ['qf']
};
```

#### AFD3: Asignación

![AFD3](diagramas/AFD3.png)

$$
\begin{aligned}
q0, \text{ID} \implies q1 \\
q1, \text{=} \implies q2 \\
q2, \text{EXP} \implies q3 \\
q3, \text{\\n} \implies qf \\
\end{aligned}
$$

Estado inicial: $q0$  
Estados finales: $qf$

```js
this.AFD3 = {
  'name': 'asignación',
  'q0': { 'ID': 'q1' },
  'q1': { '=': 'q2' },
  'q2': { 'EXP': 'q3' },
  'q3': { '\n': 'qf', 'EOF': 'qf' },
  'estado_final': ['qf']
};
```

#### AFD4: Condición

![AFD4](diagramas/AFD4.png)

$$
\begin{aligned}
q0, \text{(} \implies q1 \\
q1, \text{EXP} \implies q2 \\
q2, \text{>} \implies q3 \\
q2, \text{<} \implies q3 \\
q3, \text{EXP} \implies q4 \\
q4, \text{)} \implies q 5 \\
q5, \text{\\n} \implies qf \\
\end{aligned}
$$

Estado inicial: $q0$ 
Estados finales: $qf$

```js
this.AFD4 = {
  'name': 'condición',
  'q0': { '(': 'q1' },
  'q1': { 'EXP': 'q2' },
  'q2': { '<': 'q3', '>': 'q3' },
  'q3': { 'EXP': 'q4' },
  'q4': { ')': 'q5' },
  'q5': { '\n': 'qf' },
  'estado_final': ['qf']
};
```

### **2. Autómatas de Pila Determinista (APD)**

Estos se emplean para analizar estructuras de control, como `si`, `sino` y `mientras`.

$$
\begin{aligned}
q0, \text{si}, - &\implies q0, \text{ si} \\
q0, \text{sino}, \text{si} &\implies q0, \text{ sino} \\
q0, \text{fsi}, \text{sino} &\implies q0, \ \&\& \\
q0, \text{fsi}, \text{si} &\implies q0, \ \& \\
q0, \text{mientras}, - &\implies q0, \text{ mientras} \\
q0, \text{fmientras}, \text{mientras} &\implies q0, \& \\
q0, \$, \text{PO} &\implies qf, - \\
\end{aligned}
$$

Estado inicial: q0  
Estados finales: qf

```js
this.APD = {
  'q0': {
    'si': { 'P0': { 'estado': 'q0', 'pila': '+' }, '-': { 'estado': 'q0', 'pila': '+' } },
    'sino': { 'si': { 'estado': 'q0', 'pila': '+' } },
    'fsi': { 'sino': { 'estado': 'q0', 'pila': '&&' }, 'si': { 'estado': 'q0', 'pila': '&' } },
    'mientras': { 'P0': { 'estado': 'q0', 'pila': '+' }, '-': { 'estado': 'q0', 'pila': '+' } },
    'fmientras': { 'mientras': { 'estado': 'q0', 'pila': '&' } }
  }
};
```

### **3. Parser LL(1)**

Se usa para analizar expresiones matemáticas, identificando estructuras como términos, factores y operadores.
#### Gramática
Para las expresiones algebraicas usaremos la gramática $G$ dada por la tupla $G = (N, T, P, E)$, donde $N$ es el conjunto de no terminales, $T_e$ es el conjunto de terminales, $P$ es el conjunto de reglas de producción y $E$ es el símbolo inicial.

**Símbolos No Terminales:** 
- $N = \{E, T, F, G\}$

**Símbolos Terminales:** 
- $T_e = \{+, -, *, /, \ \hat{ \ } \, (, ), \text{ID}, \text{NUM}\}$

**Reglas de Producción:**

$$
\begin{aligned}
E &\implies T+E \\
&\implies T-E \\
&\implies T \\
T &\implies F*T \\
&\implies F/T \\
&\implies F \\
F &\implies G \ \hat{ \ } \ F \\
 &\implies G \\
G &\implies (E)\\
 &\implies ID\\
 &\implies NUM\\
\end{aligned}
$$

#### Factorización
Para evitar ambigüedades y preparar nuestra gramática para el análisis LL(1), hemos factorizado la gramática original:

$$
\begin{aligned}
&1. &E &\implies TX \\
\\
&2. &X &\implies +E \\
&3. &X &\implies -E \\
&4. &X &\implies \lambda \\
\\
&5. &T &\implies FY \\
\\
&6. &Y &\implies *T \\
&7. &Y &\implies /T \\
&8. &Y &\implies \lambda \\
\\
&9. &F &\implies GZ \\
\\
&10. &Z &\implies \ \hat{ \ } \ F \\
&11. &Z &\implies \lambda \\
\\
&12. &G &\implies (E) \\
&13. &G &\implies ID \\
&14. &G &\implies NUM \\
\end{aligned}
$$

#### Conjuntos de Símbolos Directores
Los conjuntos de símbolos directores nos ayudan a tomar decisiones en el análisis sintáctico descendente, indicando cuándo aplicar una regla particular:

![Simbolos Directores](diagramas/Simbolos_directores.png)

Con esto ya podemos implementar el parser LL(1) en nuestro código:

```js
  
evaluarExpresion() {
// Verifica que la expresión sea válida utilizando el parser LL(1)
  try {
    this.E();
  } catch (error) {
    return false;   
  }
  return true;
}
  
// Método E
E() {
  this.T();
  this.X();
}

// Método X
X() {
  switch (this.currentToken.value) {
	  case '+':
		  this.match('+');
		  this.E();
		  break;
	  case '-':
		  this.match('-');
		  this.E();
		  break;
	  case 'EOF':
	  case '\n':
	  case ',':
	  case '<':
	  case '>':
	  case ')':
		  // Lambda
		  break;
	  default:
		  throw new Error(`Token innesperado en X: "${this.currentToken.value}"`);
  }
}

// Método T
T() {
  this.F();
  this.Y();
}

// Método Y
Y() {
  switch (this.currentToken.value) {
	  case '*':
		  this.match('*');
		  this.T();
		  break;
	  case '/':
		  this.match('/');
		  this.T();
		  break;
	  case '+':
	  case '-':
	  case 'EOF':
	  case '\n':
	  case ',':
	  case '<':
	  case '>':
	  case ')':
		  // Lambda
		  break;
	  default:
		  throw new Error(`Token innesperado en Y: "${this.currentToken.value}"`);
  }
}

// Método F
F() {
  this.G();
  this.Z();
}

// Método Z
Z() {
  switch (this.currentToken.value) {
	  case '^':
		  this.match('^');
		  this.F();
		  break;
	  case '*':
	  case '/':
	  case '+':
	  case '-':
	  case 'EOF':
	  case '\n':
	  case ',':
	  case '<':
	  case '>':
	  case ')':
		  // Lambda
		  break;
	  default:
		  throw new Error(`Token innesperado en Z: "${this.currentToken.value}"`);
  }
}

// Método G
G() {
  switch (this.currentToken.value) {
	  case '(':
		  this.match('(');
		  this.E();
		  this.match(')');
		  break;
	  case 'ID':
		  this.match('ID');
		  break;
	  case 'NUM':
		  this.match('NUM');
		  break;
	  default:
		  throw new Error(`Token innesperado en G: "${this.currentToken.value}"`);
  }
}
```

### **Funciones Clave**

#### **Constructor**
- Inicializa los diferentes autómatas (AFD y APD) y otras propiedades.
  
#### **getToken()**
- Obtiene el siguiente token del escáner (`scanner`) y lo almacena en `currentToken`.

#### **evaluarAFD(afd)**
- Toma un AFD como argumento y evalúa la secuencia de tokens.
- Si la secuencia no sigue las reglas del AFD, genera un error.

#### **evaluarAPD()**
- Evalúa el APD para estructuras de control.
- Si no hay una transición definida en el APD basada en el estado actual y el token, genera un error.

#### **actualizarPila(tokenApilado)**
- Modifica la pila del APD según las operaciones definidas.

#### **evaluarExpresion()**
- Evalúa la corrección sintáctica de una expresión usando el parser LL(1).

#### **E, X, T, Y, F, Z, G**
- Representan la gramática del parser LL(1) y analizan las expresiones.

#### **parse()**
- Función principal del analizador.
- Itera a través de los tokens y, basándose en el token actual, decide qué técnica (AFD, APD, LL(1)) usar.

## Descripción de la implementación

El proceso de análisis de código se ejecuta a través de la función `run`, que actúa como un conductor que guía el flujo del código a través de varias etapas, desde su entrada hasta la producción de un resultado. Aquí te presento un desglose paso a paso:

## Descripción de la implementación

* El scanner genera uno por uno tokens a partir del código dado. Cada token tiene un tipo y un valor, además de la información para ubicarlo en el código fuente. 
  * Si el token es desconocido, se genera un error léxico. 
  * Si se llega al final del código fuente, se genera un token especial `EOF` que indica el final del archivo.
* El parser identifica qué autómata o parser secundario debe ser llamado para procesar los tokens.
* Cuando se encuentra un token inicial, se llama al AFD o APD correspondiente para evaluar la secuencia de tokens.
  - En el caso de los AFD se usa el método `evaluarAFD` para evaluar la secuencia de tokens. Este método genera un error si la secuencia no sigue las reglas del AFD. Además en el caso de que en el estado actual tengamos una transición valida usando una expresión se usará el parser secundario LL(1) a través del método `evaluarExpresion` para evaluarla.
  - En el caso del APD se usa el método `evaluarAPD` para evaluar la secuencia de tokens. El APD se encarga principalmente de las estructuras de control, como "si", "sino", "mientras" y sus respectivas finalizaciones. Este método genera un error si la secuencia no sigue las reglas del APD. Además en el caso de que la estructura requiera una condicional se llamará al `AFD4` para evaluar la condicional.
* Si el AFD o APD reconoce la estructura, el parser principal continúa con el siguiente token como inicial.
* Si en algún momento se genera un error, el parser principal se detiene y se muestra el mensaje de error.
* Si el parser principal llega al final del código fuente, se muestra un mensaje de éxito.

## Implementación en Código

### Estructura del Proyecto

El proyecto se organiza en múltiples archivos y módulos para facilitar la separación de responsabilidades y la mantenibilidad del código:

- `index.html`: Interfaz gráfica del usuario para la entrada del código y visualización de resultados.
- `styles.css`: Hoja de estilos para la interfaz gráfica.
- `app.js`: Contiene la función principal para ejecutar el compilador y manejar la interfaz de usuario.
- `scanner.js`: Contiene la implementación del analizador léxico.
- `parser.js`: Implementa el analizador sintáctico y decide qué autómata llamar.
- `error.js`: Contiene la implementación del sistema de manejo de errores.
- `example_code.js`: Contiene una lista de ejemplos de código que se pueden utilizar para probar el compilador.

### Funciones Principales

#### Función `run()`

Esta función se invoca cada vez que se presiona el botón "Ejecutar" o se utiliza el atajo `Ctrl+Enter`. Coordina la ejecución del analizador léxico y sintáctico y actualiza la salida en la interfaz de usuario.

#### Eventos DOM

Se utilizan eventos DOM para gestionar la interacción con el usuario, como la actualización de números de línea en tiempo real y el desplazamiento del área de texto.

#### Copiar al Portapapeles

Se proporcionan funciones para copiar el código y la salida al portapapeles del usuario, mejorando así la usabilidad del proyecto.

#### Ejemplos de Código

Se proporciona una lista de ejemplos de código que se pueden utilizar para probar el compilador.

### Tratamiento de Errores

El proyecto tiene un sistema robusto para el manejo de errores, que proporciona mensajes de error detallados que especifican el tipo y la línea del error. El sistema de manejo de errores se implementa en el archivo `error.js` y se utiliza en el scanner y el parser. Este no solo permite imprimir el error sino también saltar a la ubicación del token que lo generó en el código fuente.

### Código:

index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Scanner-Parser</title>
  <link rel="stylesheet" href="css/styles.css">
  <script src="https://kit.fontawesome.com/03cff3d805.js" crossorigin="anonymous"></script>
</head>
<body>
  <div class="button-container">
    <button id="run-button"><i class="fa-solid fa-play"></i>Ejecutar</button>
    
  </div>
  
  <div class="container">
    <div class="left">
      <label>
        <i class="fa-solid fa-code"></i>
        Código
        <div class="icon-container">
          <i  id="random-code-button" class="fa-solid fa-shuffle"></i>
          <i  id="copy-code-button" class="fa-regular fa-clipboard"></i>
        </div>
      </label>
      <div class="code-container">
        <textarea id="line-numbers" readonly></textarea>
        <textarea id="code" autofocus cols="30" rows="10"></textarea>
      </div>
    </div>
    <div class="right">
      <label><i class="fa-solid fa-terminal"></i>Salida<i id="copy-output-button" class="fa-regular fa-clipboard"></i></label>
      <textarea id="output" readonly></textarea>
    </div>
  </div>
  
  <script type="module" src="js/app.js"></script>
  <script type="module" src="js/error.js"></script>
  <script type="module" src="js/example_code.js"></script>
  <script type="module" src="js/parser.js"></script>
  <script type="module" src="js/scanner.js"></script>
</body>
</html>
```

styles.css
```css
* {
  margin: 0;
  padding: 0;
  font-family: 'Poppins' ,sans-serif;
  box-sizing: border-box;
}
body {
  background:#454545;
  color: #fff;
}
.container {
  width: 100%;
  height: 93vh;
  padding: 20px;
  display: flex;
}

.button-container {
  width: 100%;
  height: 5vh;
  padding: 0px;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.left, .right {
  flex-basis: 100%;
  padding: 10px;
}

textarea {
  width: 100%;
  height: 95%;
  background: #1f1f1f;
  color: #fff;
  padding: 10px 20px;
  border: 0;
  outline: 0;
  font-size: 18px;
  resize: none;
}

textarea#output {
  background: #fff;
  color: #1f1f1f;
}

label i {
  margin-right: 10px;
  margin-left: 10px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 10px;
  width: auto;
}

button i {
  margin-right: 10px;
}

label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000;
  height: 30px;
}

.fa-clipboard {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
}

.code-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

#line-numbers {
  padding: 10px 0;
  color: #fff;
  font-size: 18px;
  line-height: 1.5;
  white-space: pre;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: #1f1f1f;
  width: 30px;
  text-align: right;
  /* margin-right: 5px; */
  height: 95%;
}

textarea {
  margin-left: 0px;
  font-size: 18px;
  line-height: 1.5;
  padding: 10px 20px;
  flex-grow: 1;
}

#run-button {
  background-color: #1f1f1f; 
  color: #fff; 
  padding: 5px 20px; 
  border: none; 
  cursor: pointer; 
  border-radius: 5px; 
  font-size: 16px; 
}


#run-button:hover {
  background-color: #2f2f2f;
}
```

app.js

```js
// Importar los módulos scanner y parser
import { Scanner } from './scanner.js';
import { Parser } from './parser.js';
import { get_example_code } from './example_code.js';

// Función principal para correr el compilador
function run() {
  let code = document.getElementById('code').value;
  let output = document.getElementById('output');

  // Limpiar la salida anterior
  output.value = '';

  let scanner = new Scanner(code);
  let parser = new Parser(scanner);

  let res = parser.parse();
  if (res) {
    output.value += "El código es válido\n";
  } else {
    output.value += "El código no es válido\n";
  }
}

// ---- Manejo del JS de la página ----

// Al cargar el DOM, añadimos eventos para manejar las líneas
function update_lines() {
  const codeTextArea = document.getElementById("code");
  const lineNumbersDiv = document.getElementById("line-numbers");

  // Actualizamos números de línea
  function updateLineNumbers() {
    const lines = codeTextArea.value.split("\n").length;
    let lineNumbers = "";

    for (let i = 1; i <= lines; i++) {
      lineNumbers += i + "\n";
    }

    lineNumbersDiv.textContent = lineNumbers;
  }

  // Eventos para actualizar y sincronizar las líneas
  codeTextArea.addEventListener("input", updateLineNumbers);
  codeTextArea.addEventListener("scroll", function () {
    lineNumbersDiv.scrollTop = codeTextArea.scrollTop;
  });

  updateLineNumbers();
}
document.addEventListener("DOMContentLoaded", update_lines);

// Función para copiar texto al portapapeles
async function copyToClipboard(textAreaId) {
  const textArea = document.getElementById(textAreaId);
  const text = textArea.value; // Obtener el texto del textarea

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('No se pudo copiar el texto', err);
  }
}

// Evento para ejecutar el compilador con Ctrl+Enter
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.code === 'Enter') {
      run();
  }
});

// Obtener botones y añadir eventos de clic

document.getElementById('run-button').addEventListener('click', run);

document.getElementById('copy-code-button').addEventListener('click', function() {
  copyToClipboard('code');
});

document.getElementById('random-code-button').addEventListener('click', function() {
  let example_code = get_example_code();
  document.getElementById('code').value = example_code;
  update_lines();
});

document.getElementById('copy-output-button').addEventListener('click', function() {
  copyToClipboard('output');
});
```

error.js

```js
export function displayError(typeError, token, info='') {
  // Asignar un valor legible al token de error
  if (token.value === "\n") {
    token.valuePrint = "\\n";
  } else if (token.value === " ") {
    token.valuePrint = "espacio en blanco";
  } else if (token.value === "EOF") {
    token.valuePrint = "final de cadena";
  } else {
    token.valuePrint = token.value;
  }
  let messageError;
  
  // Asignar un mensaje de error dependiendo del tipo de error
  if (typeError === "Error Léxico") {
    messageError = `El lexema '${token.valuePrint}' es desconocido.`;
  } else if (typeError === "Error Sintáctico") {
    messageError = `${info}. El token '${token.valuePrint}' es inesperado.`;
  }

  // Mover el cursor al final del token de error
  const codeArea = document.getElementById('code');
  let startPos = 0;
  for (let i = 0; i < token.linea - 1; i++) {
    startPos = codeArea.value.indexOf('\n', startPos) + 1;
  }
  codeArea.focus();
  codeArea.setSelectionRange(token.index, token.index);
  
  // Mostrar el mensaje en el textarea de salida
  const output = document.getElementById('output');
  output.value += `${typeError} en linea ${token.linea}, columna ${token.index-startPos}: ${messageError}\n`;
}
```

scanner.js

```js
import { displayError } from './error.js';

export class Scanner {
  constructor(code) {
    // Código de entrada.
    this.code = code;

    // Definición de los tipos de tokens y las palabras reservadas.
    this.TokenType = {
      PALABRA_RESERVADA: "PALABRA_RESERVADA",
      ID: "ID",
      NUM: "NUM",
      OPERADOR: "OPERADOR",
      SIMBOLO: "SIMBOLO",
      DESCONOCIDO: "DESCONOCIDO",
      EOF: "EOF",
    };

    // Listado de palabras reservadas del lenguaje.
    this.palabrasReservadas = ["entero", "real", "si", "sino", "mientras", "fmientras", "fsi", "imprime", "verdadero", "falso"];

    // Inicialización del contador de líneas
    this.linea = 1;
    
    this.tokenGenerator = null;
    this.lastToken = null;
  }

  // Generador que devuelve tokens uno por uno.
  *getGenerator() {
    let lexema = "";
    // Iterar sobre cada caracter del código y dividir en lexemas
    for (let i = 0; i < this.code.length; i++) {
      const char = this.code[i];

      if (char === '\n') {
        // Si el caracter es un salto de línea, clasificar el lexema y reiniciar el contador de líneas.
        if (lexema) {
          yield this.clasificarLexema(lexema, i);
          lexema = "";
        }
        // Clasificar el salto de línea y continuar.
        yield this.clasificarLexema('\n', i);
        this.linea++;
      } else if (char.match(/[\s,()=+\-*/^<>|&]/)) {
        if (lexema) {
          // Si el caracter es un espacio o un símbolo, clasificar el lexema y continuar.
          yield this.clasificarLexema(lexema, i);
          lexema = "";
        }
        if (!char.match(/\s/)) {
          // Si el caracter es un símbolo, clasificar el lexema del símbolo y continuar.
          yield this.clasificarLexema(char, i+1);
        }
      } else if (char.match(/[a-zA-Z0-9\.]/)) {
        // Si el caracter es un número o una letra, añadirlo al lexema.
        lexema += char;
      } else if (char) {
        // Si el caracter es desconocido, clasificar el lexema y continuar.
        yield this.clasificarLexema(char, i+1);
      }
    }
    if (lexema) {
      yield this.clasificarLexema(lexema, this.code.length);
    }
  }

  // Método para clasificar un lexema y asignarle un tipo de token.
  clasificarLexema(lexema, index) {
    // Si el lexema es una palabra reservada.
    if (this.palabrasReservadas.includes(lexema)) {
      return { type: this.TokenType.PALABRA_RESERVADA, value: lexema, linea: this.linea, index: index };
    }
    // Si el lexema es un identificador válido.
    if (lexema.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      return { type: this.TokenType.ID, value: 'ID', linea: this.linea, index: index };
    }
    // Si el lexema es un número, puede ser entero o decimal.
    if (lexema.match(/^[0-9]+(\.[0-9]+)?$/)) {
      return { type: this.TokenType.NUM, value: 'NUM', linea: this.linea, index: index };
    }
    // Si el lexema es un operador.
    if (lexema.match(/[=+\-*/^<>|&]/)) {
      return { type: this.TokenType.OPERADOR, value: lexema, linea: this.linea, index: index };
    }
    // Si el lexema es un símbolo.
    if (lexema.match(/[\n,()]/)) {
      return { type: this.TokenType.SIMBOLO, value: lexema, linea: this.linea, index: index };
    }
    // Si el lexema es desconocido.
    let tokenDesconocido = { type: this.TokenType.DESCONOCIDO, value: lexema, linea: this.linea, index: index };
    displayError("Error Léxico", tokenDesconocido);
    return tokenDesconocido;
  }

  // Método para obtener el siguiente token.
  getToken() {
    if (!this.tokenGenerator) {
        this.tokenGenerator = this.getGenerator();
    }

    // Manejo de multiples saltos de línea
    const result = this.tokenGenerator.next();
    let actualToken;
    if (!result.done) {
      actualToken = result.value;
      if (!(actualToken.value === "\n" && (this.lastToken == null || this.lastToken.value === "\n"))) {
        this.lastToken = result.value;
        return result.value;
      } else {
        return this.getToken();
      }
    } else {
      // Si se llega al final del archivo, devolver un token EOF.
      return { type: this.TokenType.EOF, value: 'EOF', linea: this.linea, index: this.code.length };
    }
  }
}
```

parser.js

```js
import { displayError } from './error.js';

// Clase Parser que evalúa la sintaxis de los tokens utilizando Autómatas de Pila Determinista (APD), Autómatas Finitos Deterministas (AFD) y un parser LL(1)
export class Parser {
  constructor(scanner) {

    this.scanner = scanner;
    this.currentToken = null;

    // Inicialización de la pila y del estado del APD
    this.pila = [{'value': 'P0'}]; // Pila para el APD
    this.estadoAPD = 'q0'; // Estado inicial del APD

    // Definición de los autómatas de estados finitos (AFD) para distintas estructuras

    // AFD1 para declaración de variables
    this.AFD1 = {
      'name': 'declaración de variables',
      'q0': { 'entero': 'q1', 'real': 'q1' },
      'q1': { 'ID': 'q2' },
      'q2': { ',': 'q1', '=': 'q3', '\n': 'qf', 'EOF': 'qf' },
      'q3': { 'EXP': 'q4' },
      'q4': { ',': 'q1', '\n': 'qf', 'EOF': 'qf' },
      'estado_final': ['qf']
    };
    
    // AFD2 para la función imprime
    this.AFD2 = {
      'name': 'funcion imprime',
      'q0': { 'imprime': 'q1' },
      'q1': { 'EXP': 'q2' },
      'q2': { ',': 'q1', '\n': 'qf', 'EOF': 'qf' },
      'estado_final': ['qf']
    };
    
    // AFD3 para asignaciones
    this.AFD3 = {
      'name': 'asignación',
      'q0': { 'ID': 'q1' },
      'q1': { '=': 'q2' },
      'q2': { 'EXP': 'q3' },
      'q3': { '\n': 'qf', 'EOF': 'qf' },
      'estado_final': ['qf']
    };
    
    // AFD4 para condicionales
    this.AFD4 = {
      'name': 'condicional',
      'q0': { '(': 'q1' },
      'q1': { 'EXP': 'q2' },
      'q2': { '<': 'q3', '>': 'q3' },
      'q3': { 'EXP': 'q4' },
      'q4': { ')': 'q5' },
      'q5': { '\n': 'qf' },
      'estado_final': ['qf']
    };
    
    // Definición del autómata de pila (APD) para estructuras de control

    this.APD = {
      'q0': {
        'si': { 'P0': { 'estado': 'q0', 'pila': '+' }, '-': { 'estado': 'q0', 'pila': '+' } },
        'sino': { 'si': { 'estado': 'q0', 'pila': '+' } },
        'fsi': { 'sino': { 'estado': 'q0', 'pila': '&&' }, 'si': { 'estado': 'q0', 'pila': '&' } },
        'mientras': { 'P0': { 'estado': 'q0', 'pila': '+' }, '-': { 'estado': 'q0', 'pila': '+' } },
        'fmientras': { 'mientras': { 'estado': 'q0', 'pila': '&' } }
      }
    };
  }

 // Pide el siguiente token al scanner y lo guarda en currentToken
 getToken() {
    this.currentToken = this.scanner.getToken();
  }

  // Evalúa un AFD dado
  evaluarAFD(afd) {
    let estado = 'q0';
    do {
      if (afd[estado] && afd[estado][this.currentToken.value]) {
        estado = afd[estado][this.currentToken.value];
        this.getToken();
      } else if (afd[estado] && afd[estado]['EXP']) {
        if (this.evaluarExpresion()) {
          estado = afd[estado]['EXP'];
        } else {
          displayError("Error Sintáctico", this.currentToken, `Error en la ${afd['name']}`);
          return false; // error de sintaxis
        }
      } else {
        displayError("Error Sintáctico", this.currentToken, `Error en la ${afd['name']}`);
        return false; // error de sintaxis
      } 
    } while (this.currentToken && estado !== 'qf')
  
    // Verificación del estado final
    return afd['estado_final'].includes(estado);
  }
  
  // Evalúa el APD de estructuras de control
  evaluarAPD() {
    let topePila = this.pila[this.pila.length - 1];
    const transicion = this.APD[this.estadoAPD][this.currentToken.value][topePila.value] || this.APD[this.estadoAPD][this.currentToken.value]['-'];
    
    if (transicion) {
      this.estadoAPD = transicion.estado;
      this.actualizarPila(transicion.pila);
      this.getToken();
      return true;
    } else {
      displayError("Error Sintáctico", this.currentToken, `Error de estructura de control`);
      return false; // error de sintaxis
    }
  }
  
  // Actualiza la pila del APD
  actualizarPila(tokenApilado) {
    switch (tokenApilado) {
      case "&": // Se desempila el token que está en el tope de la pila
        this.pila.pop();
        break;
      case "&&": // Se desempilan los dos tokens que están en el tope de la pila
        this.pila.pop();
        this.pila.pop();
        break;
      case "+": // Se apila el token actual
        this.pila.push(this.currentToken);
        break;
      case "-": // En el caso de que el token sea - no se hace nada
        break;
      default:
        break;
    }
  }
  
  evaluarFinalAPD() {
    // Verifica que la pila esté vacía al final del análisis
    if (this.pila[this.pila.length-1].value !== 'P0') {
      // En caso de error
      displayError("Error Sintáctico", this.pila[this.pila.length-1], `Error de estructura de control`);
      return false;
    }
    return true;
  }

  evaluarExpresion() {
    // Verifica que la expresión sea válida utilizando el parser LL(1)
    try {
      this.E();
    } catch (error) {
      return false;   
    }
    return true;
  }

  match(expectedToken) {
    // Función de utilidad para consumir un token
    if (this.currentToken.value === expectedToken) {
        this.currentToken = this.scanner.getToken();
    } else {
        throw new Error(`Token innesperado. Se esperaba el token "${expectedToken}" pero se encontró: "${this.currentToken.value}".`);
    }
  }

  // ---- Parser LL(1) ----
  // Método E
  E() {
      this.T();
      this.X();
  }

  // Método X
  X() {
      switch (this.currentToken.value) {
          case '+':
              this.match('+');
              this.E();
              break;
          case '-':
              this.match('-');
              this.E();
              break;
          case 'EOF':
          case '\n':
          case ',':
          case '<':
          case '>':
          case ')':
              // Lambda
              break;
          default:
              throw new Error(`Token innesperado en X: "${this.currentToken.value}"`);
      }
  }

  // Método T
  T() {
      this.F();
      this.Y();
  }

  // Método Y
  Y() {
      switch (this.currentToken.value) {
          case '*':
              this.match('*');
              this.T();
              break;
          case '/':
              this.match('/');
              this.T();
              break;
          case '+':
          case '-':
          case 'EOF':
          case '\n':
          case ',':
          case '<':
          case '>':
          case ')':
              // Lambda
              break;
          default:
              throw new Error(`Token innesperado en Y: "${this.currentToken.value}"`);
      }
  }

  // Método F
  F() {
      this.G();
      this.Z();
  }

  // Método Z
  Z() {
      switch (this.currentToken.value) {
          case '^':
              this.match('^');
              this.F();
              break;
          case '*':
          case '/':
          case '+':
          case '-':
          case 'EOF':
          case '\n':
          case ',':
          case '<':
          case '>':
          case ')':
              // Lambda
              break;
          default:
              throw new Error(`Token innesperado en Z: "${this.currentToken.value}"`);
      }
  }

  // Método G
  G() {
      switch (this.currentToken.value) {
          case '(':
              this.match('(');
              this.E();
              this.match(')');
              break;
          case 'ID':
              this.match('ID');
              break;
          case 'NUM':
              this.match('NUM');
              break;
          default:
              throw new Error(`Token innesperado en G: "${this.currentToken.value}"`);
      }
  }

  // Método principal para el análisis sintáctico
  parse() {
    this.getToken();
    // Se evalúan los tokens hasta llegar al final del archivo
    while (this.currentToken && this.currentToken.type !== "EOF") {
      let success = false;

      // Se decide qué técnica usar basándose en el token actual
      if (["si", "sino", "fsi", "mientras", "fmientras"].includes(this.currentToken.value)) {
        // Se evalúa el APD de estructuras de control
        if (this.currentToken.value === "si" || this.currentToken.value === "mientras") {
          // Se evalúa el AFD de condicionales
          success = this.evaluarAPD(this.currentToken) && this.evaluarAFD(this.AFD4);
        } else {
          success = this.evaluarAPD(this.currentToken);
          if (success) {
            if (this.currentToken.value === '\n' || this.currentToken.value === 'EOF') {
              this.getToken();
            } else {
              displayError("Error Sintáctico", this.currentToken);
              return false;
            }
          }
        }
        
      } else if (this.currentToken.value === "entero" || this.currentToken.value === "real") {
        // Se evalúa el AFD de declaración de variables
        success = this.evaluarAFD(this.AFD1);
      } else if (this.currentToken.value === "imprime") {
        // Se evalúa el AFD de la función imprime
        success = this.evaluarAFD(this.AFD2);
      } else if (this.currentToken.value === "ID") {
        // Se evalúa el AFD de asignaciones
        success = this.evaluarAFD(this.AFD3);
      }

      if (!success) {
        return false;
      }
    }

    if (!this.evaluarFinalAPD()) {
      return false;
    }
    
    return true;
  }
}
```

example_code.js

```js
// Lista de códigos de ejemplo para el editor
export let example_code_list = [
  `entero a,b=3
  real x=2.1 ,y=8.4
  si (a>b)
    x=3
    b=4
  sino
    mientras (b<7)
      y=9
    fmientras
  fsi
  imprime a,b,x`,

  `real altura,peso=72.5
  si (peso>70)
    altura=1.80
  sino
    altura=1.65
  fsi
  imprime altura,peso`,

  `entero i,j=0
  mientras (i<10)
    i=i+1
    j=j+2
  fmientras
  imprime i,j`,
  `entero cont1=0,cont2=1
  si (cont1<cont2)
    cont1=1
    cont2=2
  fsi
  imprime cont1,cont2`,

  `real calificacion, promedio=0
  si (calificacion>6)
    promedio=calificacion
  sino
    mientras (promedio<6)
      calificacion=calificacion+1
      promedio=calificacion
    fmientras
  fsi
  imprime promedio`,

  `real x = 9.45, y = 8.2
  si (a>b)
    x=3
    b=4
  sino
    mientras (b<7)
      y=9
    fmientras
  fsi
  imprime a,b,x
  `,

  `real a,b,c=0
  a=1
  b=2
  mientras (b-a>0.01)
    c=(a+b)/2
    si (fa*fc<0)
      b=c
    sino
      a=c
    fsi
  fmientras
  imprime c
  `,
]

// Función para obtener un código de ejemplo
export function get_example_code(index = -1) {
  if (index >= 0 && index < example_code_list.length) {
    return example_code_list[index];
  } else {
    return example_code_list[Math.floor(Math.random() * example_code_list.length)];
  }
}
```