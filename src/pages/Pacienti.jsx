import React from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { TableContainer } from '@windmill/react-ui';

function Pacienti() {
  return (
    <>
      <PageTitle>Pacienti</PageTitle>
      <TableContainer>
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse border border-gray-200 dark:border-gray-700">
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Emri dhe Mbiemri</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">John Doe</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Numri Personal</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">123456789</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Data e Lindjes</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">01/01/1980</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Adresa</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">123 Main St, City</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Gjinia</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">M</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Sigurim Shëndetësor</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">Po</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Alergji</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">Asnjë alergji e raportuar.</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Kartela e Vaksinimit</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">Te gjitha vaksinat e marrura.</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Ndërhyrje Operative</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">Asnjë ndërhyrje operative.</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Sëmundje Kronike</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">Diabet dhe hipertension.</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Medikamente</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">Metformin, Losartan.</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">Examinime</td>
                <td className="border border-gray-200 dark:border-gray-700 p-2" colSpan="3">Analiza gjaku dhe EKG.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TableContainer>
    </>
  );
}

export default Pacienti;