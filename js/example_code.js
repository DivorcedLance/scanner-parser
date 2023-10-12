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