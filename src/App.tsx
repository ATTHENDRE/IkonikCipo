import { useState, useEffect } from "react";
import type { Cipo } from "./tipus";

function App() {

  const[cipo, setCipo] = useState<Cipo[]>([])

  const[marka, setMarka] = useState<string>("")
  const[meret, setMeret] = useState<number>()
  const[megjelenes, setMegjelenes] = useState<Date>()
  const[elerheto, setElerheto] = useState<boolean>(true)


  useEffect(()=>{
    async function fetchCipo() {
      try{
        const response = await fetch('http://localhost:3000/cipok')
        const data : Cipo[] = await response.json()
        setCipo(data)
      } catch(err){
        console.log(err)
      }

    }
    fetchCipo()
  },[])

  async function CipoFelv(e){
    e.preventDefault();
    const ujCipo = {
      marka: marka,
      meret: meret,
      megjelenes: megjelenes,
      elerheto: elerheto
    }
    try{
      const response = await fetch("http://localhost:3000/cipok",{
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(ujCipo)
      })
      const cipo : Cipo = await response.json();
      setCipo((e)=> [...e, cipo])
      setMarka("")
      setMeret(undefined)
      setMegjelenes(undefined)
      setElerheto(true)
    } catch(err){
      console.log(err)
    }
  }


  return (
    <>
      <h2>Cipok</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Márka</th>
            <th>Méret</th>
            <th>Megjelenés</th>
            <th>Elérhető</th>
          </tr>
        </thead>
        <tbody>
          {cipo.map((c)=>(
            <tr key={c.id}>
              <td>{c.marka}</td>
              <td>{c.meret}</td>
              <td>{new Date(c.megjelenes).toLocaleDateString("hu-HU")}</td>
              <td>{c.elerheto ? "Igen" : "Nem"}</td>
            </tr>
          ))}
        </tbody>
      </table>

        <form onSubmit={CipoFelv}>
  <label htmlFor="marka">Márka:</label>
  <input
    type="text"
    name="marka"
    id="marka"
    value={marka}
    onChange={(e) => setMarka(e.target.value)}
    required
  />
  <br />

  <label htmlFor="meret">Méret:</label>
  <input
    type="number"
    name="meret"
    id="meret"
    value={meret ?? ""}
    onChange={(e) => setMeret(Number(e.target.value))}
    required
  />
  <br />

  <label htmlFor="megjelenes">Megjelenés:</label>
  <input
    type="date"
    name="megjelenes"
    id="megjelenes"
    value={megjelenes?.toISOString().split("T")[0] ?? ""}
    onChange={(e) => setMegjelenes(e.target.value ? new Date(`${e.target.value}T00:00:00`) : undefined)}
    required
  />
  <br />

  <label htmlFor="elerheto">Elérhetőség:</label>
  <select
    name="elerheto"
    id="elerheto"
    value={String(elerheto)}
    onChange={(e) => setElerheto(e.target.value === "true")}
  >
    <option value="true">Igen</option>
    <option value="false">Nem</option>
  </select>
  <br />

  <button type="submit">Felvétel</button>
</form>

    </>
  )
}

export default App
