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

export default function PlanetsAndSatellites232470151() {
  const [planets, setPlanets] = useState([])
  const [satellites, setSatellites] = useState([])
  const [planetForm, setPlanetForm] = useState({name: "", type: ""});
  const [satForm, setSatForm] = useState({ id: null, name: "", planetId: ""});
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    fetchPlanets();
    fetchSats();
  },[]);

  async function fetchPlanets(){
    try {
      const res = await fetchWithAuth(`${API_BASE}/planets`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setPlanets(list);
    } catch(e) {
      console.error("fetchPlanets", e);
      setPlanets([]);
    }
  }

  async function fetchSats(){
    try{
      const res = await fetchWithAuth(`${API_BASE}/satellites`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setSatellites(list);
    }catch(e) {
      console.error("fetchSats", e);
      setSatellites([]);
    }
  }

  async function submitPlanet(e){
    e.preventDefault();
    try {
      const res = await fetchWithAuth(`${API_BASE}/planets`, {
        method: "POST",
        headers: {...(await getAuthHeaders())},
        body: JSON.stringify(planetForm),
      })
      setPlanetForm({ name: "", type: ""});
      fetchPlanets();
    }catch(e) { 
      console.error("submitPlanet", e);
    }
  }

  async function submitSatellite(e){
    e.preventDefault();
    const payload = {
      name: satForm.name,
      planetId: satForm.planetId ? Number(satForm.planetId) : null,
    };
    try{
      let res;
      if(satForm.id){
        res = await fetchWithAuth(`${API_BASE}/satellites/${satForm.id}`, {
          method: "PUT",
          headers: {...(await getAuthHeaders())},
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetchWithAuth(`${API_BASE}/satellites`, {
          method: "POST",
          headers: {...(await getAuthHeaders())},
          body: JSON.stringify(payload),
        });
      }
      setSatForm({ id: null, name: "", planetId: ""});
      fetchSats();
    }catch(e){
      console.error("submitSatellites", e)
    }
  }

  function startEditSat(s){
    setSatForm({
      id: s.satellite232470151Id,
      name: s.name || "",
      planetId: s.planet ? s.planet.planet232470151Id : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth"});
  }

  async function deleteSatById(id) {
    try {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) { console.error("invalid id", id); return;}
      const res = await fetchWithAuth (`${API_BASE}/satellites/${numericId}`, {
        method: "DELETE",
        headers: {...(await getAuthHeaders())}
      });
      fetchSats();
    }catch(e) {
      console.error ("deleteSatById", e)
    }
  }

  async function handleDeleteIdSubmit(e){
    e.preventDefault();
    if (!deleteId) return;
    await deleteSatById(Number(deleteId));
    setDeleteId("");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Planets & Satellites</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Create Planet</h2>
        <form onSubmit={submitPlanet} className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1"
            placeholder="Name"
            value={planetForm.name}
            onChange={(e) => setPlanetForm({ ...planetForm, name: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="Type"
            value={planetForm.type}
            onChange={(e) => setPlanetForm({ ...planetForm, type: e.target.value })}
            required
          />
          <button className="bg-blue-600 text-white px-3 py-1" type="submit">Create</button>
        </form>

        <div className="mt-3">
          <strong>Existing planets:</strong>
          <ul className="mt-2">
            {planets.map((p) => (
              <li key={p.planet232470151Id}>
                {p.planet232470151Id} — {p.name} ({p.type})
              </li>
            ))}
            {planets.length === 0 && <li className="text-gray-600">No planets yet</li>}
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Create / Edit Satellite</h2>
        <form onSubmit={submitSatellite} className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1"
            placeholder="Satellite name"
            value={satForm.name}
            onChange={(e) => setSatForm({ ...satForm, name: e.target.value })}
            required
          />
          <select
            className="border px-2 py-1"
            value={satForm.planetId}
            onChange={(e) => setSatForm({ ...satForm, planetId: e.target.value })}
          >
            <option value="">-- No planet --</option>
            {planets.map((p) => (
              <option key={p.planet232470151Id} value={p.planet232470151Id}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-3 py-1" type="submit">
            {satForm.id ? "Update" : "Create"}
          </button>
          {satForm.id && (
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-1"
              onClick={() => setSatForm({ id: null, name: "", planetId: "" })}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Satellites (non-deleted)</h2>
        <table className="w-full border-collapse" border="1">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Planet</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {satellites.map((s) => (
              <tr key={s.satellite232470151Id}>
                <td className="px-2 py-1 text-center">{s.satellite232470151Id}</td>
                <td className="px-2 py-1">{s.name}</td>
                <td className="px-2 py-1">{s.planet ? s.planet.name : "-"}</td>
                <td className="px-2 py-1">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    onClick={() => startEditSat(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1"
                    onClick={() => deleteSatById(s.satellite232470151Id)}
                  >
                    Delete (soft)
                  </button>
                </td>
              </tr>
            ))}
            {satellites.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-2 text-gray-600">No satellites</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Delete satellite by ID (soft delete)</h2>
        <form className="flex gap-2 mt-2" onSubmit={handleDeleteIdSubmit}>
          <input
            className="border px-2 py-1"
            placeholder="Satellite ID to delete"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            type="number"
            required
          />
          <button className="bg-red-600 text-white px-3 py-1" type="submit">Delete by ID</button>
        </form>
      </section>
    </div>
  );
}