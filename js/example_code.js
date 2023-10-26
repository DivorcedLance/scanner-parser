// Lista de códigos de ejemplo para el editor
export let example_code_list = [
  `entero num=0, total=10
mientras (num<total)
  num = num + 2
  si (num>5)
    total = total + 1
  fsi
fmientras
imprime num, total`,

`entero contador=0, suma=0, limite=10
mientras (contador<limite)
  contador = contador + 1
  suma = suma + contador
  si (suma>25)
    suma = suma - contador
  fsi
fmientras
imprime contador, suma
`,

`real radio=5, area=0, pi=3.14
si (radio > 0)
  area = pi * radio^2
  si (area > 50)
    area = 50
  fsi
fsi
imprime area`,

`entero i=0, j=10, k=0
mientras (i<5)
  i = i + 1
  mientras (j>i)
    j = j - 1
    si (i + j > 10)
      k = i + j
    fsi
  fmientras
fmientras
imprime i, j, k`,

`real saldo=1000, retiro=500
si (saldo > retiro)
  saldo = saldo - retiro
  si (saldo < 300)
    retiro = 100
  fsi
sino
  retiro = 0
fsi
imprime saldo, retiro`,

`real num1=5.5, num2=2.2, resultado=0
si (num1 > num2)
  resultado = ((num1 * num2) + (num1 / num2) - (num2^2) + (3.0 * (num2 + 2))) / (2.5 + (num1 - num2))
  si (resultado < 0)
    resultado = resultado * (0-1)
  fsi
sino
  resultado = ((num2 * num1) - (num1 / (num2 + 1))) * (4^2) / (2.0 + (num1 * 3))
fsi
imprime resultado`,

]

// Función para obtener un código de ejemplo
export function get_example_code(index = -1) {
  if (index >= 0 && index < example_code_list.length) {
    return example_code_list[index];
  } else {
    return example_code_list[Math.floor(Math.random() * example_code_list.length)];
  }
}