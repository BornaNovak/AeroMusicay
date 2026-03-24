import { useEffect, useState } from 'react';
import IzvodacService from '../../services/izvodaci/IzvodacService';
import { Table } from 'react-bootstrap';
import FormatDatuma from '../../components/FormatDatuma';
import { RouteNames } from '../../constants';
import { Link } from 'react-router-dom';
import { PatternFormat } from 'react-number-format';

export default function IzvodacPregled() {
   const [izvodaci, setIzvodaci] = useState([])

   useEffect(() => {ucitajIzvodace()}, [])

   async function ucitajIzvodace(){
    await IzvodacService.get().then((odgovor) => {
        setIzvodaci(odgovor.data)
    })
   }
   return(
    <>
    <Link to={RouteNames.IZVODACI_NOVI} className="btn btn-success w-100 my-3">
        Dodavanje novog izvodaca
    </Link>
    <Table>
        <thead>
            <tr>
                <th>Naziv izvođača</th>
                <th>Zanr</th>
                <th>Pjesma</th>
                <th>Album</th>
                <th>Trajanje</th>
                <th>Datum izdavanja</th>
                <th>Akcije</th>
            </tr>
        </thead>
        <tbody>
            {izvodaci && izvodaci.map((izvodac)=>(
                <tr>
                    <td>{izvodac.naziv}</td>
                    <td>{izvodac.zanr}</td>
                    <td>{izvodac.pjesma}</td>
                    <td>{izvodac.album}</td>
                    <td className="text-end">
                        <PatternFormat 
                        displayType='text'
                        format='#:##'
                        value={izvodac.trajanje}
                        />
                    </td>
                    <td>
                        <FormatDatuma datum={izvodac.datumIzdavanja} prikazZadano='-' />
                    </td>
                    <td>{izvodac.akcija}</td>
                </tr>
            ))}
        </tbody>
    </Table>
    </>
   )
}