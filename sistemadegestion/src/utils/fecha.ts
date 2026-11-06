export function formatoFecha(iso: string | null) {
  if (!iso) return 'NA'
  const [anio, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${anio}`
}
