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

  useEffect(() => {
    if (patient && (patient.pacientiId || patient.id || patient.pacientId || patient.numriPersonal)) {
      // Try all possible patient ID fields
      const id = patient.pacientiId || patient.pacientiID || patient.id || patient.pacientId || patient.numriPersonal;
      console.log('Pacienti.jsx using id for fetch:', id); // DEBUG LOG
      Promise.all([
        fetch(`http://localhost:8080/api/alergjia/pacienti/${id}`).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/kartelavaksinimit/pacienti/${id}`).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/nderhyrje/pacienti/${id}`).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/semundjekronike/pacienti/${id}`).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/medikamente/pacienti/${id}`).then(r => r.ok ? r.json() : []),
        fetch(`http://localhost:8080/api/ankesaanaliza/pacienti/${id}`).then(r => r.ok ? r.json() : []),
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
    setModalValue(value);
    setIsModalOpen(true);
  }

  function closeEditModal(){
    setIsModalOpen(false);
    setModalField('');
    setModalValue('');
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
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Alergji', patient.alergji)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>  
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Kartela e Vaksinimit</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.kartelaVaksinimit && details.kartelaVaksinimit.length > 0 ? details.kartelaVaksinimit.map(k => k.pershkrimi).join(', ') : 'Te gjitha vaksinat e marrura.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Kartela Vaksinimit', patient.kartelaVaksinimit)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Ndërhyrje Operative</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.nderhyrje && details.nderhyrje.length > 0 ? details.nderhyrje.map(n => n.pershkrimi).join(', ') : 'Asnjë ndërhyrje operative.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Ndërhyrje Operative', patient.nderhyrje)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Sëmundje Kronike</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.semundjeKronike && details.semundjeKronike.length > 0 ? details.semundjeKronike.map(s => s.pershkrimi).join(', ') : 'Asnjë sëmundje kronike.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Sëmundje Kronike', patient.semundjeKronike)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Medikamente</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.medikamente && details.medikamente.length > 0 ? details.medikamente.map(m => m.pershkrimi).join(', ') : 'Asnjë medikament.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Medikamente', patient.medikamente)}>
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Examinime</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">
                  {details.analizaEkzaminime && details.analizaEkzaminime.length > 0 ? details.analizaEkzaminime.map(e => e.pershkrimi).join(', ') : 'Asnjë ekzaminim.'}
                  <Button layout="link" size="icon" aria-label="Edit" className="ml-2" onClick={() => openEditModal('Examinime', patient.analizaEkzaminime)}>
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
          <p>Vlera aktuale: <strong>{modalValue}</strong></p>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeEditModal}>
            Mbyll
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Pacienti;