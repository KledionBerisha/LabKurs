import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation } from 'react-router-dom';
import { EditIcon } from '../icons';
import { Button } from '@windmill/react-ui';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui';

function Pacienti(props) {
  const location = useLocation();
  const patient = (location.state && location.state.patient) || null;
  console.log('Pacienti.jsx patient object:', patient); // DEBUG LOG
  const [details, setDetails] = useState({
    alergji: null,
    kartelaVaksinimit: null,
    nderhyrje: null,
    semundjeKronike: null,
    medikamente: null,
    analizaEkzaminime: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalField, setModalField] = useState('');
  const [modalValue, setModalValue] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (patient && (patient.pacientiId || patient.id || patient.pacientId || patient.numriPersonal)) {
      // Try all possible patient ID fields
      const id = patient.pacientiId || patient.pacientiID || patient.id || patient.pacientId || patient.numriPersonal;
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.accessToken || user?.token || user?.access_token;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      console.log('Pacienti.jsx using id for fetch:', id); // DEBUG LOG
      Promise.all([
        fetch(`http://localhost:8080/api/alergjia/pacienti/${id}`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/kartelavaksinimit/pacienti/${id}`, { headers}).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/nderhyrje/pacienti/${id}`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/semundjekronike/pacienti/${id}`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/medikamente/pacienti/${id}`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/ankesaanaliza/pacienti/${id}`, { headers }).then(r => r.ok ? r.json() : []),
      ]).then(([alergji, kartelaVaksinimit, nderhyrje, semundjeKronike, medikamente, analizaEkzaminime]) => {
        console.log('Fetched details:', {
          alergji, kartelaVaksinimit, nderhyrje, semundjeKronike, medikamente, analizaEkzaminime
        }); // DEBUG LOG
        setDetails({ alergji, kartelaVaksinimit, nderhyrje, semundjeKronike, medikamente, analizaEkzaminime });
      });
    }
  }, [patient]);

  if (!patient) {
    return (
      <>
        <PageTitle>Pacienti</PageTitle>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <p>Asnjë pacient i zgjedhur.</p>
        </div>
      </>
    );
  }

  function openEditModal(field, value){
    setModalField(field);
    if (Array.isArray(value)){
      setModalValue(value.map(v => v.pershkrimi).join(', '));
      setEditValue(value.map(v => v.pershkrimi).join(', '));
    } else if (typeof value === 'boolean') {
      setModalValue(value ? 'Po' : 'Jo');
      setEditValue(value ? 'Po' : 'Jo');
    } else {
      setModalValue(value);
      setEditValue(value);
    }
    setIsModalOpen(true);
  }

  function closeEditModal(){
    setIsModalOpen(false);
    setModalField('');
    setModalValue('');
  }

  function handleSave() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.accessToken || user?.token || user?.access_token;
    if (!token) {
      alert('Nuk jeni i loguar. Ju lutem identifikohuni përsëri.');
      // optional: redirect to login
      // history.push('/login');
      return;
    }
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const id = patient.pacientiId || patient.pacientiID || patient.id || patient.pacientId || patient.numriPersonal;

    let endpoint = '';
    let payload = {};
    let method = 'PUT';

    if(modalField === 'Emri dhe Mbiemri'){
      endpoint = `http://localhost:8080/api/pacientet/${id}`;
      payload = {...patient, emriMbiemri: editValue };
    } else if (modalField === 'Numri Personal') {
      endpoint = `http://localhost:8080/api/pacientet/${id}`;
      payload = { ...patient, numriPersonal: editValue };
    } else if (modalField === 'Data e Lindjes') {
      endpoint = `http://localhost:8080/api/pacientet/${id}`;
      payload = { ...patient, ditelindja: editValue };
    } else if (modalField === 'Adresa') {
      endpoint = `http://localhost:8080/api/pacientet/${id}`;
      payload = { ...patient, vendbanimiEmri: editValue };
    } else if (modalField === 'Gjinia') {
      endpoint = `http://localhost:8080/api/pacientet/${id}`;
      payload = { ...patient, gjinia: editValue };
    } else if (modalField === 'Sigurimi Shëndetësor') {
      endpoint = `http://localhost:8080/api/pacientet/${id}`;
      payload = { ...patient, sigurimShendetsor: editValue === 'Po' };
    }
    // Array fields
    else if (modalField === 'Alergji') {
      endpoint = `http://localhost:8080/api/alergjia/pacienti/${id}`;
      payload = editValue.split(',').map(pershkrimi => ({ pershkrimi: pershkrimi.trim() }));
      method = 'PUT';
    } else if (modalField === 'Kartela Vaksinimit') {
      endpoint = `http://localhost:8080/api/kartelavaksinimit/pacienti/${id}`;
      payload = editValue.split(',').map(pershkrimi => ({ pershkrimi: pershkrimi.trim() }));
      method = 'PUT';
    } else if (modalField === 'Ndërhyrje Operative') {
      endpoint = `http://localhost:8080/api/nderhyrje/pacienti/${id}`;
      payload = editValue.split(',').map(pershkrimi => ({ pershkrimi: pershkrimi.trim() }));
      method = 'PUT';
    } else if (modalField === 'Sëmundje Kronike') {
      endpoint = `http://localhost:8080/api/semundjekronike/pacienti/${id}`;
      payload = editValue.split(',').map(pershkrimi => ({ pershkrimi: pershkrimi.trim() }));
      method = 'PUT';
    } else if (modalField === 'Medikamente') {
      endpoint = `http://localhost:8080/api/medikamente/pacienti/${id}`;
      payload = editValue.split(',').map(pershkrimi => ({ pershkrimi: pershkrimi.trim() }));
      method = 'PUT';
    } else if (modalField === 'Examinime') {
      endpoint = `http://localhost:8080/api/ankesaanaliza/pacienti/${id}`;
      payload = editValue.split(',').map(pershkrimi => ({ pershkrimi: pershkrimi.trim() }));
      method = 'PUT';
    }

    if (!endpoint) {
      console.error('No endpoint selected for modalField:', modalField);
      return;
    }

    console.log('Sending update', { endpoint, method, headers, payload }); // DEBUG

    fetch(endpoint, {
      method,
      headers,
      body: JSON.stringify(payload),
    })
      .then(async res => {
        const text = await res.text();
        let body;
        try { body = text ? JSON.parse(text) : null; } catch(e) { body = text; }
        if (!res.ok) {
          console.error('Update failed response:', res.status, body);
          // show backend message if present
          const message = body?.error || body?.message || `Server returned ${res.status}`;
          throw new Error(message);
        }
        return body;
      })
        .then(data => {
          if (modalField === 'Emri dhe Mbiemri') patient.emriMbiemri = editValue;
          else if (modalField === 'Numri Personal') patient.numriPersonal = editValue;
          else if (modalField === 'Data e Lindjes') patient.ditelindja = editValue;
          else if (modalField === 'Adresa') patient.vendbanimiEmri = editValue;
          else if (modalField === 'Gjinia') patient.gjinia = editValue;
          else if (modalField === 'Sigurimi Shëndetësor') patient.sigurimShendetsor = editValue === 'Po';
          else if (modalField === 'Alergji') setDetails(prev => ({ ...prev, alergji: payload }));
          else if (modalField === 'Kartela Vaksinimit') setDetails(prev => ({ ...prev, kartelaVaksinimit: payload }));
          else if (modalField === 'Ndërhyrje Operative') setDetails(prev => ({ ...prev, nderhyrje: payload }));
          else if (modalField === 'Sëmundje Kronike') setDetails(prev => ({ ...prev, semundjeKronike: payload }));
          else if (modalField === 'Medikamente') setDetails(prev => ({ ...prev, medikamente: payload }));
          else if (modalField === 'Examinime') setDetails(prev => ({ ...prev, analizaEkzaminime: payload }));
          closeEditModal();
          alert('U ruajt me sukses!');
        })
        .catch(err => {
          alert("Gabime gjate ruajtjes!");
          console.error(err);
        });
  }

  return (
    <>
      <PageTitle>Pacienti</PageTitle>
      <TableContainer>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse border border-gray-200 dark:border-gray-700">
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Emri dhe Mbiemri</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {patient.emriMbiemri}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Emri dhe Mbiemri', patient.emriMbiemri)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Numri Personal</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {patient.numriPersonal}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Numri Personal', patient.numriPersonal)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Data e Lindjes</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {patient.ditelindja ? new Date(patient.ditelindja).toLocaleDateString() : ''}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Data e Lindjes', patient.ditelindja)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Adresa</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {patient.vendbanimiEmri || patient.vendbanimiID}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Adresa', patient.vendbanimiEmri)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Gjinia</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {patient.gjinia || ''}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Gjinia', patient.gjinia)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Sigurim Shëndetësor</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {patient.sigurimShendetsor ? 'Po' : 'Jo'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Sigurimi Shëndetësor', patient.sigurimShendetsor)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Alergji</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.alergji && details.alergji.length > 0 ? details.alergji.map(a => a.pershkrimi).join(', ') : 'Asnjë alergji e raportuar.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Alergji', details.alergji)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>  
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Kartela e Vaksinimit</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.kartelaVaksinimit && details.kartelaVaksinimit.length > 0 ? details.kartelaVaksinimit.map(k => k.pershkrimi).join(', ') : 'Te gjitha vaksinat e marrura.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Kartela Vaksinimit', details.kartelaVaksinimit)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Ndërhyrje Operative</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.nderhyrje && details.nderhyrje.length > 0 ? details.nderhyrje.map(n => n.pershkrimi).join(', ') : 'Asnjë ndërhyrje operative.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Ndërhyrje Operative', details.nderhyrje)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Sëmundje Kronike</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.semundjeKronike && details.semundjeKronike.length > 0 ? details.semundjeKronike.map(s => s.pershkrimi).join(', ') : 'Asnjë sëmundje kronike.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Sëmundje Kronike', details.semundjeKronike)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Medikamente</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.medikamente && details.medikamente.length > 0 ? details.medikamente.map(m => m.pershkrimi).join(', ') : 'Asnjë medikament.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Medikamente', details.medikamente)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Examinime</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.analizaEkzaminime && details.analizaEkzaminime.length > 0 ? details.analizaEkzaminime.map(e => e.pershkrimi).join(', ') : 'Asnjë ekzaminim.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Examinime', details.analizaEkzaminime)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edito: {modalField}</ModalHeader>
        <ModalBody>
          <label className="block text-sm mb-2">Vlera e re:</label>
          <input
            className="block w-full border rounded p-2 mb-2 text-black"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeEditModal}>
            Mbyll
          </Button>
          <Button onClick={handleSave}>
            Ruaj
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Pacienti;