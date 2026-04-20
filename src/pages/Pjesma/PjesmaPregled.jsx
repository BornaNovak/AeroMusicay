import { useEffect, useState } from 'react'
import PjesmaService from '../../services/pjesme/PjesmaService'
import AlbumService from '../../services/albumi/AlbumService'
import ZanrService from '../../services/zanrovi/ZanrService'
import { formatirajTrajanje } from '../../utils'
import { Button, Table, Container, Pagination } from 'react-bootstrap' // Dodan Pagination
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'


export default function PjesmaPregled() {
    const [pjesme, setPjesme] = useState([])
    const [albumi, setAlbumi] = useState([])
    const [zanrovi, setZanrovi] = useState([]) 
    
    // NOVO: State za straničenje
    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);
    
    const navigate = useNavigate();

    // useEffect sada prati promjenu 'stranica'
    useEffect(() => {
        ucitajPodatke()
    }, [stranica])

    async function ucitajPodatke() {
        // POZIVAMO getPage umjesto get
        const resPjesme = await PjesmaService.getPage(stranica, 8);
        const resAlbumi = await AlbumService.get();
        const resZanrovi = await ZanrService.get();

        if (resPjesme.success) {
            setPjesme(resPjesme.data);
            setUkupnoStranica(resPjesme.totalPages); // Spremamo broj stranica
        }
        if (resAlbumi.success) setAlbumi(resAlbumi.data);
        if (resZanrovi.success) setZanrovi(resZanrovi.data);
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati?')) return;
        await PjesmaService.obrisi(sifra);
        ucitajPodatke(); // Osvježavamo trenutnu stranicu
    }

    // --- LOGIKA ZA GUMBE STRANIČENJA ---
    let items = [];
    for (let number = 1; number <= ukupnoStranica; number++) {
        items.push(
            <Pagination.Item 
                key={number} 
                active={number === stranica} 
                onClick={() => setStranica(number)}
            >
                {number}
            </Pagination.Item>,
        );
    }

    const dohvatiNazivAlbuma = (sifraAlbuma) => {
        const album = albumi.find(a => a.sifra === parseInt(sifraAlbuma))
        return album ? album.naziv : 'Nepoznat album'
    }

    const dohvatiNaziveZanrova = (pjesmaZanrovi) => {
        if (!pjesmaZanrovi || pjesmaZanrovi.length === 0) return 'Nema žanra';
        if (Array.isArray(pjesmaZanrovi)) {
            return pjesmaZanrovi
                .map(sifra => {
                    const z = zanrovi.find(g => g.sifra === sifra);
                    return z ? z.naziv : null;
                })
                .filter(n => n !== null)
                .join(', '); 
        }
        const zanr = zanrovi.find(z => z.sifra === parseInt(pjesmaZanrovi));
        return zanr ? zanr.naziv : 'Nepoznat žanr';
    }

    return (
        <Container>
            <Link to={RouteNames.PJESME_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje nove pjesme
            </Link>
            
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>Naziv pjesme</th>
                        <th>Album</th>
                        <th>Žanrovi</th>
                        <th>Trajanje</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {pjesme && pjesme.map((pjesma) => (
                        <tr key={pjesma.sifra}>
                            <td>{pjesma.naziv}</td>
                            <td>{dohvatiNazivAlbuma(pjesma.album)}</td>
                            <td>{dohvatiNaziveZanrova(pjesma.zanr)}</td>
                            <td>{formatirajTrajanje(pjesma.trajanje)}</td>
                            <td>
                                <Button size="sm" onClick={() => { navigate(`/pjesme/${pjesma.sifra}`) }}>
                                    Promjeni
                                </Button>
                                &nbsp;&nbsp;
                                <Button size="sm" variant="danger" onClick={() => { obrisi(pjesma.sifra) }}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* PRIKAZ STRANIČENJA NA DNU */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination>{items}</Pagination>
            </div>
        </Container>
    )
}