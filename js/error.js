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
  
