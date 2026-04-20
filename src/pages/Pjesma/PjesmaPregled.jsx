import { useEffect, useState } from 'react'
import PjesmaService from '../../services/pjesme/PjesmaService'
import AlbumService from '../../services/albumi/AlbumService'
import ZanrService from '../../services/zanrovi/ZanrService'
import { formatirajTrajanje } from '../../utils'
import { Button, Table, Container } from 'react-bootstrap'
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'


export default function PjesmaPregled() {
    const [pjesme, setPjesme] = useState([])
    const [albumi, setAlbumi] = useState([])
    const [zanrovi, setZanrovi] = useState([]) 
    const navigate = useNavigate();

    useEffect(() => {
        ucitajPodatke()
    }, [])

    async function ucitajPodatke() {
        const resPjesme = await PjesmaService.get();
        const resAlbumi = await AlbumService.get();
        const resZanrovi = await ZanrService.get();

        if (resPjesme.success) setPjesme(resPjesme.data);
        if (resAlbumi.success) setAlbumi(resAlbumi.data);
        if (resZanrovi.success) setZanrovi(resZanrovi.data);
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati?')) return;
        await PjesmaService.obrisi(sifra);
        const res = await PjesmaService.get();
        if (res.success) setPjesme(res.data);
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
                            {/* Ovdje se sada koristi uvezena funkcija iz utils.js */}
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
        </Container>
    )
}