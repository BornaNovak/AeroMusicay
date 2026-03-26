import { useEffect, useState } from 'react';
import IzvodacService from '../../services/izvodaci/IzvodacService';
import { Button, Table } from 'react-bootstrap';
import FormatDatuma from '../../components/FormatDatuma';
import { RouteNames } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import { PatternFormat } from 'react-number-format';

export default function IzvodacPregled() {
   const [izvodaci, setIzvodaci] = useState([])
   const navigate = useNavigate();
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
    <Table striped hover responsive>
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
                <tr key={izvodac.sifra}>
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
                    <td>
                        <Button onClick={()=>{navigate(`/izvodaci/${izvodac.sifra}`)}}>
                            Promjeni
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
    </>
   )
}