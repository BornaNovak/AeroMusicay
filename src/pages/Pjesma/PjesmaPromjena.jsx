import { Link, useNavigate, useParams } from "react-router-dom";
import PjesmaService from "../../services/pjesme/PjesmaService";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Container, Card, Table } from "react-bootstrap";
import { albumi } from "../../services/albumi/AlbumPodaci";
import { zanrovi } from "../../services/zanrovi/ZanrPodaci"; 

export default function PjesmaPromjena() {
    const navigate = useNavigate();
    const params = useParams();
    
    const [pjesma, setPjesma] = useState(null);
    const [odabraniZanrovi, setOdabraniZanrovi] = useState([]);
    const [pretragaZanrova, setPretragaZanrova] = useState('');
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false);
    const [odabraniIndex, setOdabraniIndex] = useState(-1);

    useEffect(() => {
        ucitajPjesmu();
    }, []);

    // Kada se pjesma učita, sinkroniziraj niz odabranih žanrova
    useEffect(() => {
        if (pjesma && pjesma.zanr) {
            // Filtriramo podatke iz ZanrPodaci na temelju šifri u pjesma.zanr nizu
            const postojeci = zanrovi.filter(z => pjesma.zanr.includes(z.sifra));
            setOdabraniZanrovi(postojeci);
        }
    }, [pjesma]);

    async function ucitajPjesmu() {
        const odgovor = await PjesmaService.getBySifra(params.sifra);
        if (!odgovor.success) {
            alert('Nije moguće učitati podatke o pjesmi');
            return;
        }
        setPjesma(odgovor.data);
    }

    // --- FUNKCIJE ZA ŽANROVE (Autocomplete logika) ---
    function dodajZanr(zanr) {
        if (!odabraniZanrovi.find(z => z.sifra === zanr.sifra)) {
            setOdabraniZanrovi([...odabraniZanrovi, zanr]);
        }
        setPretragaZanrova('');
        setPrikaziAutocomplete(false);
        setOdabraniIndex(-1);
    }

    function ukloniZanr(sifra) {
        setOdabraniZanrovi(odabraniZanrovi.filter(z => z.sifra !== sifra));
    }

    function filtrirajZanrove() {
        if (!pretragaZanrova) return [];
        return zanrovi.filter(z => 
            !odabraniZanrovi.find(oz => oz.sifra === z.sifra) &&
            z.naziv.toLowerCase().includes(pretragaZanrova.toLowerCase())
        );
    }

    function handleKeyDown(e) {
        const filtrirani = filtrirajZanrove();
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOdabraniIndex(prev => prev < filtrirani.length - 1 ? prev + 1 : prev);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setOdabraniIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtrirani.length > 0) {
            e.preventDefault();
            dodajZanr(filtrirani[odabraniIndex]);
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false);
        }
    }

    async function promjeni(pjesmaPodaci) {
        const odgovor = await PjesmaService.promjeni(params.sifra, pjesmaPodaci);
        if (odgovor.success) {
            navigate(RouteNames.PJESME);
        }
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length < 2) {
            alert('Naziv pjesme mora imati najmanje 2 znaka!');
            return;
        }

        promjeni({
            naziv: podaci.get('naziv'),
            album: parseInt(podaci.get('album')),
            // Šaljemo niz šifri žanrova
            zanr: odabraniZanrovi.map(z => z.sifra), 
            trajanje: parseInt(podaci.get('trajanje')) || 0
        });
    }

    if (!pjesma) return <div className="text-center mt-5">Učitavanje...</div>;

    return (
        <Container className="mt-4">
            <h3 className="mb-4">Uredi pjesmu: {pjesma.naziv}</h3>
            <Form onSubmit={odradiSubmit}>
                <Row>
                    {/* LIJEVA STRANA: Podaci o pjesmi */}
                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Podaci o pjesmi</Card.Title>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Naziv</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="naziv" 
                                        defaultValue={pjesma.naziv} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Album</Form.Label>
                                    <Form.Select name="album" defaultValue={pjesma.album} required>
                                        {albumi.map(a => (
                                            <option key={a.sifra} value={a.sifra}>{a.naziv}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Trajanje (sekunde)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="trajanje" 
                                        defaultValue={pjesma.trajanje} 
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* DESNA STRANA: Odabir žanrova */}
                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Žanrovi</Card.Title>

                                <Form.Group className="mb-3 position-relative">
                                    <Form.Label className="fw-bold">Dodaj žanr</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pretraži žanrove (npr. Rock...)"
                                        value={pretragaZanrova}
                                        onChange={(e) => {
                                            setPretragaZanrova(e.target.value);
                                            setPrikaziAutocomplete(e.target.value.length > 0);
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                    
                                    {prikaziAutocomplete && filtrirajZanrove().length > 0 && (
                                        <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{zIndex: 1000}}>
                                            {filtrirajZanrove().map((z, index) => (
                                                <div
                                                    key={z.sifra}
                                                    className="p-2 cursor-pointer"
                                                    style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: index === odabraniIndex ? '#0d6efd' : 'white',
                                                        color: index === odabraniIndex ? 'white' : 'black'
                                                    }}
                                                    onClick={() => dodajZanr(z)}
                                                    onMouseEnter={() => setOdabraniIndex(index)}
                                                >
                                                    {z.naziv}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>

                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Naziv žanra</th>
                                            <th style={{width: '80px'}}>Akcija</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {odabraniZanrovi.map(z => (
                                            <tr key={z.sifra}>
                                                <td>{z.naziv}</td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => ukloniZanr(z.sifra)}>
                                                        Ukloni
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {odabraniZanrovi.length === 0 && <p className="text-muted">Nema odabranih žanrova.</p>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={RouteNames.PJESME} className="btn btn-secondary px-4">Odustani</Link>
                    <Button type="submit" variant="success" className="px-4">Spremi izmjene</Button>
                </div>
            </Form>
        </Container>
    );
}