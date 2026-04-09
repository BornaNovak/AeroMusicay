import { useEffect, useState } from 'react'
import { Button, Table, Container } from 'react-bootstrap'
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
        const odgovor = await ZanrService.get();
        if (!odgovor.success) {
            alert('Nije moguće učitati žanrove.');
            return;
        }
        setZanrovi(odgovor.data);
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati žanr?')) {
            return;
        }
        const odgovor = await ZanrService.obrisi(sifra);
        if (odgovor.success) {
            ucitajZanrove();
        } else {
            alert(odgovor.message);
        }
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-secondary">Pregled Žanrova</h2>
                <Link to={RouteNames.ZANR_NOVI} className="btn btn-success fw-bold shadow-sm px-4">
                     Dodaj novi žanr
                </Link>
            </div>

            <Table striped hover responsive className="shadow-sm rounded overflow-hidden">
                <thead className="table-dark text-uppercase small">
                    <tr>
                        <th>Naziv žanra</th>
                        <th className="text-end">Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {zanrovi && zanrovi.length > 0 ? (
                        zanrovi.map((z) => (
                            <tr key={z.sifra}>
                                <td className="fw-bold align-middle">
                                    {z.naziv}
                                </td>
                                <td className="text-end align-middle">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => { navigate(`${RouteNames.ZANR_PROMJENA.replace(':sifra', z.sifra)}`) }}
                                    >
                                        Uredi
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={() => { obrisi(z.sifra) }}
                                    >
                                        Obriši
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center py-4 text-muted">
                                Nema pronađenih žanrova.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
}