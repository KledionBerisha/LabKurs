import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';
import { useLocation } from 'react-router-dom';

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

  return (
    <>
      <PageTitle>Pacienti</PageTitle>
      <TableContainer>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse border border-gray-200 dark:border-gray-700">
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Emri dhe Mbiemri</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{patient.emriMbiemri}</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Numri Personal</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{patient.numriPersonal}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Data e Lindjes</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{patient.ditelindja ? new Date(patient.ditelindja).toLocaleDateString() : ''}</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Adresa</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{patient.vendbanimiEmri || patient.vendbanimiID}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Gjinia</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{patient.gjinia || ''}</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Sigurim Shëndetësor</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">{patient.sigurimShendetsor ? 'Po' : 'Jo'}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Alergji</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">{details.alergji && details.alergji.length > 0 ? details.alergji.map(a => a.pershkrimi).join(', ') : 'Asnjë alergji e raportuar.'}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Kartela e Vaksinimit</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">{details.kartelaVaksinimit && details.kartelaVaksinimit.length > 0 ? details.kartelaVaksinimit.map(k => k.pershkrimi).join(', ') : 'Te gjitha vaksinat e marrura.'}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Ndërhyrje Operative</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">{details.nderhyrje && details.nderhyrje.length > 0 ? details.nderhyrje.map(n => n.pershkrimi).join(', ') : 'Asnjë ndërhyrje operative.'}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Sëmundje Kronike</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">{details.semundjeKronike && details.semundjeKronike.length > 0 ? details.semundjeKronike.map(s => s.pershkrimi).join(', ') : 'Asnjë sëmundje kronike.'}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Medikamente</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">{details.medikamente && details.medikamente.length > 0 ? details.medikamente.map(m => m.pershkrimi).join(', ') : 'Asnjë medikament.'}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Examinime</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">{details.analizaEkzaminime && details.analizaEkzaminime.length > 0 ? details.analizaEkzaminime.map(e => e.pershkrimi).join(', ') : 'Asnjë ekzaminim.'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TableContainer>
    </>
  );
}

export default Pacienti;