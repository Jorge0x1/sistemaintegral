// "a, b ,, c" → ["a", "b", "c"]
export function aLista(texto: string) {
  return texto
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function deLista(items: string[]) {
  return items.join(', ')
}

// "" → null; para selects y escalas que se guardan como número
export function aNumero(texto: string) {
  return texto ? Number(texto) : null
}
