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

// ----- Manejo del JS de la página -----

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
