import { displayError } from './error.js';

// Clase Parser que evalúa la sintaxis de los tokens utilizando Autómatas de Pila Determinista (APD) y Autómatas Finitos Deterministas (AFD)
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

  getToken() {
    this.currentToken = this.scanner.getToken();
  }

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
  
  actualizarPila(tokenApilado) {
    switch (tokenApilado) {
      case "&":
        this.pila.pop();
        break;
      case "&&":
        this.pila.pop();
        this.pila.pop();
        break;
      case "+":
        this.pila.push(this.currentToken);
        break;
      // En el caso de que el token sea - no se hace nada
      default:
        break;
    }
  }
  
  evaluarFinalAPD() {
    if (this.pila[this.pila.length-1].value !== 'P0') {
      // En caso de error
      displayError("Error Sintáctico", this.pila[this.pila.length-1], `Error de estructura de control`);
      return false;
    }
    return true;
  }

  evaluarExpresion() {
    try {
      this.E();
    } catch (error) {
      return false;   
    }
    return true;
  }

  // Función de utilidad para consumir un token
  match(expectedToken) {
    if (this.currentToken.value === expectedToken) {
        this.currentToken = this.scanner.getToken();
    } else {
        throw new Error(`Token innesperado. Se esperaba el token "${expectedToken}" pero se encontró: "${this.currentToken.value}".`);
    }
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

  // Método principal para el análisis sintáctico
  parse() {
    this.getToken();
    while (this.currentToken && this.currentToken.type !== "EOF") {
      let success = false;

      // Se decide qué técnica usar basándose en el token actual
      if (["si", "sino", "fsi", "mientras", "fmientras"].includes(this.currentToken.value)) {
        if (this.currentToken.value === "si" || this.currentToken.value === "mientras") {
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
        success = this.evaluarAFD(this.AFD1, [this.currentToken]);
      } else if (this.currentToken.value === "imprime") {
        success = this.evaluarAFD(this.AFD2, [this.currentToken]);
      } else if (this.currentToken.value === "ID") {
        success = this.evaluarAFD(this.AFD3, [this.currentToken]);
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