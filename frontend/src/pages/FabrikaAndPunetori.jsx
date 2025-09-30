import React, { useEffect, useState } from 'react';
import { getAuthHeaders, fetchWithAuth } from "../services/auth";

const API_BASE = "http://localhost:8080/api";

function normalizeListResponse(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.content && Array.isArray(data.content)) return data.content;
  if(data._embedded) {
    const keys = Object.keys(data._embedded);
    if(keys.length > 0 &&  Array.isArray(data._embedded[keys[0]])){
      return data._embedded[keys[0]];
    }
  }
  return [];
}

export default function FabrikaAndPunetori() {
  const [fabrika, setFabrika] = useState([])
  const [punetori, setPunetori] = useState([])
  const [fabrikaForm, setFabrikaForm] = useState({fabrikaID: null, emriFabrikes: "", lokacioni: ""});
  const [punetoriForm, setPunetoriForm] = useState({ punetoriID: null, emri: "", mbiemri: "", pozita: "", fabrikaId: ""});

  useEffect(() => {
    fetchFabrika();
    fetchPunetori();
  },[]);

  async function fetchFabrika(){
    try {
      const res = await fetchWithAuth(`${API_BASE}/fabrika`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setFabrika(list);
    } catch(e) {
      console.error("fetchFabrika", e);
      setFabrika([]);
    }
  }

  async function fetchPunetori(){
    try{
      const res = await fetchWithAuth(`${API_BASE}/punetori`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setPunetori(list);
    }catch(e) {
      console.error("fetchPunetori", e);
      setPunetori([]);
    }
  }

  async function submitFabrika(e){
    e.preventDefault();
    try{
        const payload = {
            emriFabrikes: fabrikaForm.emriFabrikes,
            lokacioni: fabrikaForm.lokacioni
        };
        if(fabrikaForm.fabrikaID){
            await fetchWithAuth(`${API_BASE}/fabrika/${fabrikaForm.fabrikaID}`, {
                method: "PUT",
                headers: { ...(await getAuthHeaders()) },
                body: JSON.stringify(payload)
            });
        }else {
            await fetchWithAuth(`${API_BASE}/fabrika`, {
            method: "POST",
            headers: { ...(await getAuthHeaders()) },
            body: JSON.stringify(payload)
            });
        }
        setFabrikaForm({fabrikaID: null, emriFabrikes: "", lokacioni: ""});
        fetchFabrika();
    }catch(e) {
        console.error("submitFabrika", e);
    }
}
  async function submitPunetori(e){
    e.preventDefault();
    try{
        const payload = {
            emri: punetoriForm.emri,
            mbiemri: punetoriForm.mbiemri,
            pozita: punetoriForm.birthYear,
            fabrika: punetoriForm.fabrikaId ? Number(punetoriForm.fabrikaId) : null,
            };
        if(punetoriForm.punetoriID){
            await fetchWithAuth(`${API_BASE}/punetori/${punetoriForm.punetoriID}`, {
            method: "PUT",
            headers: {...(await getAuthHeaders()), "Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
      } else {
            await fetchWithAuth(`${API_BASE}/punetori`, {
            method: "POST",
            headers: {...(await getAuthHeaders()), "Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
      }
      setPunetoriForm({ punetoriID: null, emri: "", mbiemri: "", pozita: "", fabrikaId: ""});
      fetchPunetori();
    }catch(e){
      console.error("submitPunetori", e)
    }
  }

  function startEditFabrika(s){
    setFabrikaForm({
        fabrikaID: s.teamID,
        emriFabrikes: s.emriFabrikes,
        lokacioni: s.lokacioni
    });
    window.scrollTo({ top: 0, behavior: "smooth"});
  }

  async function deletePunetoriById(id) {
    try {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) { console.error("invalid id", id); return;}
        await fetchWithAuth (`${API_BASE}/punetori/${numericId}`, {
        method: "DELETE",
        headers: {...(await getAuthHeaders())}
      });
      fetchPunetori();
    }catch(e) {
      console.error ("deletePunetoriById", e)
    }
  }

//   async function handleDeleteIdSubmit(e){
//     e.preventDefault();
//     if (!deleteId) return;
//     await deleteSatById(Number(deleteId));
//     setDeleteId("");
//   }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fabrika dhe Punetori</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Shto nje Fabrike</h2>
        <form onSubmit={submitFabrika} className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1"
            placeholder="EmriFabrikes"
            value={fabrikaForm.emriFabrikes}
            onChange={(e) => setFabrikaForm({ ...fabrikaForm, emriFabrikes: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="Lokacioni"
            value={fabrikaForm.lokacioni}
            onChange={(e) => setFabrikaForm({ ...fabrikaForm, lokacioni: e.target.value })}
            required
          />
        <button className="bg-blue-600 text-white px-3 py-1" type="submit">
            {fabrikaForm.fabrikaID ? "Update" : "Create"}
        </button>
        {fabrikaForm.fabrikaID && (
            <button type="button"
              className="bg-gray-500 text-white px-3 py-1"
              onClick={() => setFabrikaForm({fabrikaID: null, emriFabrikes: "", lokacioni: ""})}>
                Cancel
            </button>
        )}
        </form>

        <h2 className="text-xl font-semibold">Fabrika</h2>
        <table className="w-full border-collapse" border="1">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">FabrikaID</th>
              <th className="px-2 py-1">EmriFabrikes</th>
              <th className="px-2 py-1">Lokacioni</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {fabrika.map((s) => (
              <tr key={s.fabrikaID}>
                <td className="px-2 py-1 text-center">{s.fabrikaID}</td>
                <td className="px-2 py-1">{s.emriFabrikes}</td>
                <td className="px-2 py-1">{s.lokacioni}</td>
                <td className="px-2 py-1">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    onClick={() => startEditFabrika(s)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {fabrika.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-2 text-gray-600">Asnje fabrike</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
{/* { punetoriID: null, emri: "", mbiemri: "", pozita: "", fabrikaId: ""} */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Shto Punetor</h2>
        <form onSubmit={submitPunetori} className="flex gap-2 mt-2">
        <input
            className="border px-2 py-1"
            placeholder="PunetoriEmri"
            value={punetoriForm.emri}
            onChange={(e) => setPunetoriForm({ ...punetoriForm, emri: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="PunetoriMbiemri"
            value={punetoriForm.mbiemri}
            onChange={(e) => setPunetoriForm({ ...punetoriForm, mbiemri: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="PunetoriPozita"
            value={punetoriForm.pozita}
            onChange={(e) => setPunetoriForm({ ...punetoriForm, pozita: e.target.value })}
            required
          />
          <select
            className="border px-2 py-1"
            value={punetoriForm.fabrikaId}
            onChange={(e) => setPunetoriForm({ ...punetoriForm, fabrikaId: e.target.value })}
          >
            <option value="">-- No teams --</option>
            {fabrika.map((p) => (
              <option key={p.fabrikaID} value={p.fabrikaID}>
                {p.emriFabrikes}
              </option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-3 py-1" type="submit">
            {punetoriForm.punetoriID ? "Update" : "Create"}
          </button>
          {punetoriForm.punetoriID && (
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-1"
              onClick={() => setPunetoriForm({ punetoriID: null, emri: "", mbiemri: "", pozita: "", fabrikaId: ""})}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Punetori</h2>
        <table className="w-full border-collapse" border="1">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">PunetoriID</th>
              <th className="px-2 py-1">PunetoriEmri</th>
              <th className="px-2 py-1">PunetoriMbiemri</th>
              <th className="px-2 py-1">PunetoriPozita</th>
              <th className="px-2 py-1">Fabrika</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {punetori.map((s) => (
              <tr key={s.punetoriID}>
                <td className="px-2 py-1 text-center">{s.punetoriID}</td>
                <td className="px-2 py-1">{s.emri}</td>
                <td className="px-2 py-1">{s.mbiemri}</td>
                <td className="px-2 py-1">{s.pozita}</td>
                <td className="px-2 py-1">{s.fabrika ? s.fabrika.emriFabrikes : "-"}</td>
                <td className="px-2 py-1">
                  <button
                    className="bg-red-600 text-white px-2 py-1"
                    onClick={() => deletePunetoriById(s.punetoriID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {punetori.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-2 text-gray-600">Asnje Punetor</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}