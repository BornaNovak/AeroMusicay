import { useEffect, useState } from 'react'
import { Button, Table, Pagination, Container } from 'react-bootstrap'
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'
import ZanrService from '../../services/zanrovi/ZanrService'

export default function ZanrPregled() {
    const [zanrovi, setZanrovi] = useState([])
    
    // State za straničenje
    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);
    
    const navigate = useNavigate();

    // Reagiraj na promjenu stranice
    useEffect(() => {
        ucitajZanrove()
    }, [stranica])

    async function ucitajZanrove() {
        const odgovor = await ZanrService.getPage(stranica, 8);
        
        if (!odgovor.success) {
            alert('Nije moguće učitati žanrove.')
            return
        }
        
        setZanrovi(odgovor.data);
        setUkupnoStranica(odgovor.totalPages);
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati?')) {
            return
        }
        await ZanrService.obrisi(sifra)
        ucitajZanrove()
    }

    // --- ISPRAVLJENA LOGIKA ZA DINAMIČKE GUMBE PAGINACIJE ---
    let items = [];
    
    // Određujemo granice centralnog bloka (5 stranica)
    let startPage = Math.max(1, stranica - 2);
    let endPage = Math.min(ukupnoStranica, startPage + 4);

    // Balansiranje ako smo blizu kraja da uvijek vidimo 5 brojeva
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // 1. LIJEVI DINAMIČKI RASPON: Prikazuje od 1 do (startPage - 1)
    if (startPage > 1) {
        const rangeText = startPage - 1 === 1 ? "1" : `1-${startPage - 1}`;
        items.push(
            <Pagination.Item key="left-range" onClick={() => setStranica(1)}>
                {rangeText}
            </Pagination.Item>
        );
    }

    // 2. CENTRALNI BLOK (do 5 brojeva)
    for (let number = startPage; number <= endPage; number++) {
        items.push(
            <Pagination.Item 
                key={number} 
                active={number === stranica} 
                onClick={() => setStranica(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    // 3. DESNI DINAMIČKI RASPON: Prikazuje od (endPage + 1) do zadnje stranice
    if (endPage < ukupnoStranica) {
        const rangeText = endPage + 1 === ukupnoStranica ? `${ukupnoStranica}` : `${endPage + 1}-${ukupnoStranica}`;
        items.push(
            <Pagination.Item key="right-range" onClick={() => setStranica(ukupnoStranica)}>
                {rangeText}
            </Pagination.Item>
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
                        <th className="text-center">Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {zanrovi && zanrovi.map((z) => (
                        <tr key={z.sifra}>
                            <td className="align-middle">{z.naziv}</td>
                            <td className="text-center align-middle">
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

            {/* Prikaz ispravljene navigacije stranica */}
            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination>
                        <Pagination.Prev 
                            disabled={stranica === 1} 
                            onClick={() => setStranica(stranica - 1)}
                        >
                            « PREVIOUS
                        </Pagination.Prev>

                        {items}

                        <Pagination.Next 
                            disabled={stranica === ukupnoStranica} 
                            onClick={() => setStranica(stranica + 1)}
                        >
                            NEXT »
                        </Pagination.Next>
                    </Pagination>
                </div>
            )}
        </Container>
    )
}