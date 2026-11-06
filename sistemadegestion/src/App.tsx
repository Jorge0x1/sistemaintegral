import { useState } from 'react'
import Bienvenida from './components/Bienvenida/Bienvenida'
import GestionCalidad from './components/GestionCalidad/GestionCalidad'

function App() {
  const [gestionCalidad, setGestionCalidad] = useState(false)

  return gestionCalidad ? (
    <GestionCalidad onVolver={() => setGestionCalidad(false)} />
  ) : (
    <Bienvenida onAbrir={() => setGestionCalidad(true)} />
  )
}

export default App
