import { useEffect, useState } from 'react'
import PjesmaService from '../../services/pjesme/PjesmaService'
import AlbumService from '../../services/albumi/AlbumService'
import ZanrService from '../../services/zanrovi/ZanrService'

import { Button, Table } from 'react-bootstrap'
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'
import { albumi } from '../../services/albumi/AlbumPodaci'
import { zanrovi } from '../../services/zanrovi/ZanrPodaci'

export default function PjesmaPregled() {
    const [pjesme, setPjesme] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        ucitajPjesme()
    }, [])

    async function ucitajPjesme() {
        await PjesmaService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati pjesme.')
                return
            }
            setPjesme(odgovor.data)
        })
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati?')) {
            return
        }
        await PjesmaService.obrisi(sifra)
        ucitajPjesme()
    }

    const formatirajTrajanje = (ukupnoSekundi) => {
        if (!ukupnoSekundi) return "0:00"
        const minute = Math.floor(ukupnoSekundi / 60)
        const sekunde = ukupnoSekundi % 60
        return `${minute}:${sekunde.toString().padStart(2, '0')}`
    }

    const dohvatiNazivAlbuma = (sifraAlbuma) => {
        const album = albumi.find(a => a.sifra === parseInt(sifraAlbuma))
        return album ? album.naziv : 'Nepoznat album'
    }

    const dohvatiNazivZanra = (sifraZanra) => {
        const zanr = zanrovi.find(z => z.sifra === parseInt(sifraZanra))
        return zanr ? zanr.naziv : 'Nepoznat žanr'
    }

    return (
        <>
            <Link to={RouteNames.PJESME_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje nove pjesme
            </Link>
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>Naziv pjesme</th>
                        <th>Album</th>
                        <th>Žanr</th>
                        <th>Trajanje</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {pjesme && pjesme.map((pjesma) => (
                        <tr key={pjesma.sifra}>
                            <td>{pjesma.naziv}</td>
                            <td>{dohvatiNazivAlbuma(pjesma.album)}</td>
                            <td>{dohvatiNazivZanra(pjesma.zanr)}</td>
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
        </>
    )
}