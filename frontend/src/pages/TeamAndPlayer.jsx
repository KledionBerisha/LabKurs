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

export default function TeamAndPlayer() {
  const [team, setTeam] = useState([])
  const [player, setPlayer] = useState([])
  const [teamForm, setTeamForm] = useState({teamID: null, teamName: ""});
  const [playerForm, setPlayerForm] = useState({ playerID: null, playerName: "", number: "", birthYear: "", teamId: ""});

  useEffect(() => {
    fetchTeam();
    fetchPlayer();
  },[]);

  async function fetchTeam(){
    try {
      const res = await fetchWithAuth(`${API_BASE}/team`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setTeam(list);
    } catch(e) {
      console.error("fetchTeam", e);
      setTeam([]);
    }
  }

  async function fetchPlayer(){
    try{
      const res = await fetchWithAuth(`${API_BASE}/player`);
      const data = await res.json();
      const list = normalizeListResponse(data);
      setPlayer(list);
    }catch(e) {
      console.error("fetchPlayer", e);
      setPlayer([]);
    }
  }

  async function submitTeam(e){
    e.preventDefault();
    try{
        const payload = {
            name: teamForm.teamName
        };
        if(teamForm.teamID){
            await fetchWithAuth(`${API_BASE}/team/${teamForm.teamID}`, {
                method: "PUT",
                headers: { ...(await getAuthHeaders()) },
                body: JSON.stringify(payload)
            });
        }else {
            await fetchWithAuth(`${API_BASE}/team`, {
            method: "POST",
            headers: { ...(await getAuthHeaders()) },
            body: JSON.stringify(payload)
            });
        }
        setTeamForm({teamID: null, teamName: ""});
        fetchTeam();
    }catch(e) {
        console.error("submitTeam", e);
    }
}
  async function submitPlayer(e){
    e.preventDefault();
    try{
        const payload = {
            Name: playerForm.playerName,
            Number: playerForm.number ? Number(playerForm.number) : null,
            BirthYear: playerForm.birthYear ? Number(playerForm.birthYear) : null,
            TeamID: playerForm.teamId ? Number(playerForm.teamId) : null,
            };
        if(playerForm.playerID){
            await fetchWithAuth(`${API_BASE}/player/${playerForm.playerID}`, {
            method: "PUT",
            headers: {...(await getAuthHeaders()), "Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
      } else {
            await fetchWithAuth(`${API_BASE}/player`, {
          method: "POST",
          headers: {...(await getAuthHeaders()), "Content-Type": "application/json"},
          body: JSON.stringify(payload),
        });
      }
      setPlayerForm({ playerID: null, playerName: "", number: "", birthYear: "", teamId: ""});
      fetchPlayer();
    }catch(e){
      console.error("submitPlayer", e)
    }
  }

  function startEditTeam(s){
    setTeamForm({
      teamID: s.teamID,
      teamName: s.name || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth"});
  }

  async function deletePlayerById(id) {
    try {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) { console.error("invalid id", id); return;}
        await fetchWithAuth (`${API_BASE}/player/${numericId}`, {
        method: "DELETE",
        headers: {...(await getAuthHeaders())}
      });
      fetchPlayer();
    }catch(e) {
      console.error ("deletePlayerById", e)
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
      <h1 className="text-2xl font-bold mb-4">Team and Players</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Add a Team</h2>
        <form onSubmit={submitTeam} className="flex gap-2 mt-2">
          <input
            className="border px-2 py-1"
            placeholder="Name"
            value={teamForm.teamName}
            onChange={(e) => setTeamForm({ ...teamForm, teamName: e.target.value })}
            required
          />
        <button className="bg-blue-600 text-white px-3 py-1" type="submit">
            {teamForm.teamID ? "Update" : "Create"}
        </button>
        {teamForm.teamID && (
            <button type="button"
              className="bg-gray-500 text-white px-3 py-1"
              onClick={() => setTeamForm({teamID: null, teamName: ""})}>
                Cancel
            </button>
        )}
        </form>

        <h2 className="text-xl font-semibold">Teams</h2>
        <table className="w-full border-collapse" border="1">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">TeamID</th>
              <th className="px-2 py-1">TeamName</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {team.map((s) => (
              <tr key={s.teamID}>
                <td className="px-2 py-1 text-center">{s.teamID}</td>
                <td className="px-2 py-1">{s.name}</td>
                <td className="px-2 py-1">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    onClick={() => startEditTeam(s)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-2 text-gray-600">No teams</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Add Player</h2>
        <form onSubmit={submitPlayer} className="flex gap-2 mt-2">
        <input
            className="border px-2 py-1"
            placeholder="PlayerName"
            value={playerForm.playerName}
            onChange={(e) => setPlayerForm({ ...playerForm, playerName: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="PlayerNumber"
            value={playerForm.number}
            onChange={(e) => setPlayerForm({ ...playerForm, number: e.target.value })}
            required
          />
          <input
            className="border px-2 py-1"
            placeholder="BirthYear"
            value={playerForm.birthYear}
            onChange={(e) => setPlayerForm({ ...playerForm, birthYear: e.target.value })}
            required
          />
          <select
            className="border px-2 py-1"
            value={playerForm.teamId}
            onChange={(e) => setPlayerForm({ ...playerForm, teamId: e.target.value })}
          >
            <option value="">-- No teams --</option>
            {team.map((p) => (
              <option key={p.teamID} value={p.teamID}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-3 py-1" type="submit">
            {playerForm.playerID ? "Update" : "Create"}
          </button>
          {playerForm.playerID && (
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-1"
              onClick={() => setPlayerForm({ playerID: null, playerName: "", number: "", birthYear: "", teamId: ""})}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Players</h2>
        <table className="w-full border-collapse" border="1">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">PlayerID</th>
              <th className="px-2 py-1">PlayerName</th>
              <th className="px-2 py-1">Number</th>
              <th className="px-2 py-1">BirthYear</th>
              <th className="px-2 py-1">Team</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {player.map((s) => (
              <tr key={s.playerID}>
                <td className="px-2 py-1 text-center">{s.playerID}</td>
                <td className="px-2 py-1">{s.name}</td>
                <td className="px-2 py-1">{s.number}</td>
                <td className="px-2 py-1">{s.birthYear}</td>
                <td className="px-2 py-1">{s.team ? s.team.name : "-"}</td>
                <td className="px-2 py-1">
                  <button
                    className="bg-red-600 text-white px-2 py-1"
                    onClick={() => deletePlayerById(s.playerID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {player.length === 0 && (
              <tr>
                <td colSpan="4" className="px-2 py-2 text-gray-600">No players</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}