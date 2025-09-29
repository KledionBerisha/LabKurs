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

export default function LigjeruesDheLigjerata() {
  const [ligjerues, setLigjerues] = useState([])
  const [ligjerata, setLigjerata] = useState([])
  const [ligjeruesForm, setLigjeruesForm] = useState({lecturerID: null, lecturerName: "", departament: "", email: ""});
  const [ligjerataForm, setLigjerataForm] = useState({ id: null, name: "", lecturerId: ""});

  useEffect(() => {
    fetchLigjerues();
    fetchLigjerata();
  },[]);

  async function fetchLigjerues(){
    try {
      const res = await fetchWithAuth(`${API_BASE}/ligjeruesi`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setLigjerues(list);
    } catch(e) {
      console.error("fetLigjerues", e);
      setLigjerues([]);
    }
  }

  async function fetchLigjerata(){
    try{
      const res = await fetchWithAuth(`${API_BASE}/ligjerata`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setLigjerata(list);
    }catch(e) {
      console.error("fetchLigjerata", e);
      setLigjerata([]);
    }
  }

  async function submitLigjerues(e){
    e.preventDefault();
    try{
        const payload = {
            lecturerName: ligjeruesForm.lecturerName,
            departament: ligjeruesForm.departament,
            email: ligjeruesForm.email
        };
        if(ligjeruesForm.lecturerID){
            await fetchWithAuth(`${API_BASE}/ligjeruesi/${ligjeruesForm.lecturerID}`, {
                method: "PUT",
                headers: { ...(await getAuthHeaders()) },
                body: JSON.stringify(payload)
            });
        }else {
            await fetchWithAuth(`${API_BASE}/ligjeruesi`, {
            method: "POST",
            headers: { ...(await getAuthHeaders()) },
            body: JSON.stringify(payload)
            });
        }
        setLigjeruesForm({ lecturerID: null, lecturerName: "", departament: "", email: "" });
        fetchLigjerues();
    }catch(e) {
        console.error("submitLigjerues", e);
    }
}
  async function submitLigjerata(e){
    e.preventDefault();
    try{
        const payload = {
            name: ligjerataForm.name,
            LecturerID: ligjerataForm.lecturerId ? Number(ligjerataForm.lecturerId) : null,
            };
        if(ligjerataForm.id){
            await fetchWithAuth(`${API_BASE}/ligjerata/${ligjerataForm.id}`, {
            method: "PUT",
            headers: {...(await getAuthHeaders())},
            body: JSON.stringify(payload),
        });
      } else {
            await fetchWithAuth(`${API_BASE}/ligjerata`, {
          method: "POST",
          headers: {...(await getAuthHeaders())},
          body: JSON.stringify(payload),
        });
      }
      setLigjerataForm({ id: null, name: "", lecturerId: ""});
      fetchLigjerata();
    }catch(e){
      console.error("submitLigjerata", e)
    }
  }

  function startEditLigjerues(s){
    setLigjeruesForm({
      lecturerID: s.lecturerID,
      lecturerName: s.lecturerName || "",
      departament: s.departament || "",
      email: s.email || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth"});
  }

  async function deleteLigjerataById(id) {
    try {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) { console.error("invalid id", id); return;}
        await fetchWithAuth (`${API_BASE}/ligjerata/${numericId}`, {
        method: "DELETE",
        headers: {...(await getAuthHeaders())}
      });
      fetchLigjerata();
    }catch(e) {
      console.error ("deleteLigjerataById", e)
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
      <h1 className="text-2xl font-bold mb-4">Ligjerues dhe Ligjerata</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Shto nje Ligjerues</h2>
        <form onSubmit={submitLigjerues} className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1"
            placeholder="Name"
            value={ligjeruesForm.lecturerName}
            onChange={(e) => setLigjeruesForm({ ...ligjeruesForm, lecturerName: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="Departament"
            value={ligjeruesForm.departament}
            onChange={(e) => setLigjeruesForm({ ...ligjeruesForm, departament: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="Email"
            value={ligjeruesForm.email}
            onChange={(e) => setLigjeruesForm({ ...ligjeruesForm, email: e.target.value })}
            required
          />
        <button className="bg-blue-600 text-white px-3 py-1" type="submit">
            {ligjeruesForm.lecturerID ? "Update" : "Create"}
        </button>
        {ligjeruesForm.lecturerID && (
            <button type="button"
              className="bg-gray-500 text-white px-3 py-1"
              onClick={() => setLigjeruesForm({ lecturerID: null, lecturerName: "", departament: "", email: "" })}>
                Cancel
            </button>
        )}
        </form>

        <h2 className="text-xl font-semibold">Ligjeruesit</h2>
        <table className="w-full border-collapse" border="1">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">LecturerName</th>
              <th className="px-2 py-1">Departament</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {ligjerues.map((s) => (
              <tr key={s.lecturerID}>
                <td className="px-2 py-1 text-center">{s.lecturerID}</td>
                <td className="px-2 py-1">{s.lecturerName}</td>
                <td className="px-2 py-1">{s.departament}</td>
                <td className="px-2 py-1">{s.email}</td>
                <td className="px-2 py-1">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    onClick={() => startEditLigjerues(s)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {ligjerues.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-2 text-gray-600">Nuk ka ligjerues</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Krijo / Ndrysho Ligjerata</h2>
        <form onSubmit={submitLigjerata} className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1"
            placeholder="LectureName"
            value={ligjerataForm.name}
            onChange={(e) => setLigjerataForm({ ...ligjerata, name: e.target.value })}
            required
          />
          <select
            className="border px-2 py-1"
            value={ligjerataForm.lecturerId}
            onChange={(e) => setLigjerataForm({ ...ligjerataForm, lecturerId: e.target.value })}
          >
            <option value="">-- Ska ligjerues --</option>
            {ligjerues.map((p) => (
              <option key={p.lecturerID} value={p.lecturerID}>
                {p.lecturerName}
              </option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-3 py-1" type="submit">
            {ligjerataForm.id ? "Update" : "Create"}
          </button>
          {ligjerataForm.id && (
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-1"
              onClick={() => setLigjerataForm({ id: null, name: "", lecturerId: ""})}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Ligjeratat</h2>
        <table className="w-full border-collapse" border="1">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">LectureName</th>
              <th className="px-2 py-1">Ligjeruesi</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ligjerata.map((s) => (
              <tr key={s.lectureID}>
                <td className="px-2 py-1 text-center">{s.lectureID}</td>
                <td className="px-2 py-1">{s.lectureName}</td>
                <td className="px-2 py-1">{s.ligjerues ? s.ligjerues.lecturerName : "-"}</td>
                <td className="px-2 py-1">
                  <button
                    className="bg-red-600 text-white px-2 py-1"
                    onClick={() => deleteLigjerataById(s.lectureID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {ligjerata.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-2 text-gray-600">Nuk ka ligjerata</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}