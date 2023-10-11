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
        if (lexema) {
          yield this.clasificarLexema(lexema, i);
          lexema = "";
        }
        yield this.clasificarLexema('\n', i);
        this.linea++;
      } else if (char.match(/[\s,()=+\-*/^<>|&]/)) {
        if (lexema) {
          yield this.clasificarLexema(lexema, i);
          lexema = "";
        }
        if (!char.match(/\s/)) {
          yield this.clasificarLexema(char, i+1);
        }
      } else if (char.match(/[a-zA-Z0-9\.]/)) {
        lexema += char;
      } else if (char) {
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
    }
    return { type: this.TokenType.EOF, value: 'EOF', linea: this.linea, index: this.code.length };
  }
}