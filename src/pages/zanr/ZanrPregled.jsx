import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'
import ZanrService from '../../services/zanrovi/ZanrService'

export default function ZanrPregled() {
    const [zanrovi, setZanrovi] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        ucitajZanrove()
    }, [])

    async function ucitajZanrove() {
        await ZanrService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati žanrove.')
                return
            }
            setZanrovi(odgovor.data)
        })
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati?')) {
            return
        }
        await ZanrService.obrisi(sifra)
        ucitajZanrove()
    }

    return (
        <>
            <Link to={RouteNames.ZANR_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje novog žanra
            </Link>
            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th>Naziv žanra</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {zanrovi && zanrovi.map((z) => (
                        <tr key={z.sifra}>
                            <td>{z.naziv}</td>
                            <td>
                                <Button size="sm" onClick={() => { navigate(`/zanrovi/${z.sifra}`) }}>
                                    Promjeni
                                </Button>
                                &nbsp;&nbsp;
                                <Button size="sm" variant="danger" onClick={() => { obrisi(z.sifra) }}>
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