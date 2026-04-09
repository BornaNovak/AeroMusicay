import { useEffect, useState } from 'react'
import PjesmaService from '../../services/pjesme/PjesmaService'
import { Button, Table, Container } from 'react-bootstrap'
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'



export default function PjesmaPregled() {
    const [pjesme, setPjesme] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        ucitajPjesme()
    }, [])

    async function ucitajPjesme() {
        const odgovor = await PjesmaService.get();
        if (!odgovor.success) {
            alert('Nije moguće učitati pjesme.');
            return;
        }
        setPjesme(odgovor.data);
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati pjesmu?')) {
            return;
        }
        await PjesmaService.obrisi(sifra);
        ucitajPjesme();
    }

    const formatirajTrajanje = (ukupnoSekundi) => {
        if (!ukupnoSekundi) return "0:00";
        const minute = Math.floor(ukupnoSekundi / 60);
        const sekunde = ukupnoSekundi % 60;
        return `${minute}:${sekunde.toString().padStart(2, '0')}`;
    };
    const dohvatiNazivAlbuma = (sifraAlbuma) => {
       // const album = albumi.find(a => a.sifra === sifraAlbuma);
      //  return album ? album.naziv : 'Nepoznat album';
      return "zavrsi"
    };

    const dohvatiNazivZanra = (sifraZanra) => {
        //const zanr = zanrovi.find(z => z.sifra === sifraZanra);
       // return zanr ? zanr.naziv : 'Nepoznat žanr';
       return "zavrsi"
    };

    return (
        <Container>
            <Link to={RouteNames.PJESME_NOVI} className="btn btn-success w-100 my-3 fw-bold shadow-sm">
                Dodaj novu pjesmu
            </Link>

            <Table striped hover responsive className="shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Naziv pjesme</th>
                        <th>Album</th>
                        <th>Žanr</th>
                        <th className="text-center">Trajanje</th>
                        <th className="text-end">Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {pjesme && pjesme.map((pjesma) => (
                        <tr key={pjesma.sifra}>
                            <td className="fw-bold">{pjesma.naziv}</td>
                            <td>{dohvatiNazivAlbuma(pjesma.album)}</td>
                            <td>{dohvatiNazivZanra(pjesma.zanr)}</td>
                            <td className="text-center">{formatirajTrajanje(pjesma.trajanje)}</td>
                            <td className="text-end">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    onClick={() => { navigate(`${RouteNames.PJESME_PREGLED}/${pjesma.sifra}`) }}
                                >
                                    Uredi
                                </Button>
                                &nbsp;&nbsp;
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={() => { obrisi(pjesma.sifra) }}
                                >
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}