import { useEffect, useState } from 'react'
import { Button, Table, Pagination, Container } from 'react-bootstrap' // Dodani Pagination i Container
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'
import ZanrService from '../../services/zanrovi/ZanrService'

export default function ZanrPregled() {
    const [zanrovi, setZanrovi] = useState([])
    
    // NOVO: State za straničenje
    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);
    
    const navigate = useNavigate();

    // Reagiraj na promjenu stranice
    useEffect(() => {
        ucitajZanrove()
    }, [stranica])

    async function ucitajZanrove() {
        // Koristimo getPage umjesto get (8 žanrova po stranici)
        const odgovor = await ZanrService.getPage(stranica, 8);
        
        if (!odgovor.success) {
            alert('Nije moguće učitati žanrove.')
            return
        }
        
        setZanrovi(odgovor.data);
        setUkupnoStranica(odgovor.totalPages); // Spremamo informaciju o ukupnom broju stranica
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati?')) {
            return
        }
        await ZanrService.obrisi(sifra)
        ucitajZanrove()
    }

    // Generiranje brojeva stranica za Pagination
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

    return (
        <Container>
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

            {/* Prikaz navigacije stranica na sredini */}
            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination>{items}</Pagination>
                </div>
            )}
        </Container>
    )
}