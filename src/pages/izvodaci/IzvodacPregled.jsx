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


   async function obrisi(sifra){
    if(!confirm('Jeste li sigurni da želite obrisati?')){
        return
    }
    await IzvodacService.obrisi(sifra)
    ucitajIzvodace()
   }

   const formatirajTrajanje = (ukupnoSekundi) => {
    if (!ukupnoSekundi) return "0:00"
    const minute = Math.floor(ukupnoSekundi / 60)
    const sekunde = ukupnoSekundi % 60
    return `${minute}:${sekunde.toString().padStart(2, '0')}`
};

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
                        {formatirajTrajanje(izvodac.trajanje)}
                    </td>
                    <td>
                        <FormatDatuma datum={izvodac.datumIzdavanja} prikazZadano='-' />
                    </td>
                    <td>
                        <Button size="sm" onClick={()=>{navigate(`/izvodaci/${izvodac.sifra}`)}}>
                            Promjeni
                        </Button>
                        &nbsp;&nbsp;
                        <Button size="sm" variant="danger" onClick={()=>{obrisi(izvodac.sifra)}}>
                            Obrisi
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
    </>
   )
}