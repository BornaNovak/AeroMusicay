import { Button, Col, Form, Row, Container, Card, Table } from "react-bootstrap";
import { RouteNames } from "../../constants";
import PjesmaService from "../../services/pjesme/PjesmaService";
import AlbumService from "../../services/albumi/AlbumService";
import ZanrService from "../../services/zanrovi/ZanrService";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PjesmaNovi() {
    const navigate = useNavigate();
    const [albumi, setAlbumi] = useState([]);
    const [zanrovi, setZanrovi] = useState([]); // Svi žanrovi s backenda
    const [odabraniZanrovi, setOdabraniZanrovi] = useState([]); // Žanrovi dodani u tablicu
    const [pretragaZanrova, setPretragaZanrova] = useState('');
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false);
    const [odabraniIndex, setOdabraniIndex] = useState(-1);

    useEffect(() => {
        ucitajAlbume();
        ucitajZanrove();
    }, []);

    async function ucitajAlbume() {
        const odgovor = await AlbumService.get();
        if (odgovor.success) setAlbumi(odgovor.data);
    }

    async function ucitajZanrove() {
        const odgovor = await ZanrService.get();
        if (odgovor.success) setZanrovi(odgovor.data);
    }

    // --- Logika za rad sa žanrovima (kao s polaznicima) ---
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
            setOdabraniIndex(-1);
        }
    }

    async function dodaj(pjesma) {
        const odgovor = await PjesmaService.dodaj(pjesma);
        if (odgovor.success) {
            navigate(RouteNames.PJESME);
        }
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        // Validacija
        if (!podaci.get('naziv') || podaci.get('naziv').trim().length < 2) {
            alert('Naziv pjesme mora imati najmanje 2 znaka!');
            return;
        }

        dodaj({
            naziv: podaci.get('naziv'),
            album: parseInt(podaci.get('album')), 
            // Šaljemo niz šifri odabranih žanrova
            zanr: odabraniZanrovi.map(z => z.sifra), 
            trajanje: parseInt(podaci.get('trajanje')) || 0
        });
    }

    return (
        <Container className="mt-4">
            <h3 className="mb-4">Unos nove pjesme</h3>
            <Form onSubmit={odradiSubmit}>
                <Row>
                    {/* LIJEVA STRANA: Osnovni podaci */}
                    <Col md={6}>
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <Card.Title className="mb-4 text-primary">Podaci o pjesmi</Card.Title>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Naziv pjesme</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="naziv" 
                                        placeholder="npr. Stairway to Heaven"
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Album</Form.Label>
                                    <Form.Select name="album" required>
                                        <option value="">Odaberite album</option>
                                        {albumi && albumi.map(a => (
                                            <option key={a.sifra} value={a.sifra}>{a.naziv}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Trajanje (u sekundama)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="trajanje" 
                                        placeholder="npr. 240"
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* DESNA STRANA: Autocomplete za Žanrove */}
                    <Col md={6}>
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <Card.Title className="mb-4 text-primary">Žanrovi</Card.Title>

                                <Form.Group className="mb-3 position-relative">
                                    <Form.Label className="fw-bold">Dodaj žanr</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pretraži žanrove (npr. Rock)..."
                                        value={pretragaZanrova}
                                        onChange={(e) => {
                                            setPretragaZanrova(e.target.value);
                                            setPrikaziAutocomplete(e.target.value.length > 0);
                                            setOdabraniIndex(-1);
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                    
                                    {prikaziAutocomplete && filtrirajZanrove().length > 0 && (
                                        <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                            {filtrirajZanrove().map((z, index) => (
                                                <div
                                                    key={z.sifra}
                                                    className="p-2"
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

                                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>Naziv žanra</th>
                                                <th className="text-center" style={{ width: '80px' }}>Akcija</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {odabraniZanrovi.map(z => (
                                                <tr key={z.sifra}>
                                                    <td className="align-middle">{z.naziv}</td>
                                                    <td className="text-center">
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm" 
                                                            onClick={() => ukloniZanr(z.sifra)}
                                                        >
                                                            Ukloni
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    {odabraniZanrovi.length === 0 && (
                                        <p className="text-muted small">Niste odabrali niti jedan žanr.</p>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <hr className="my-4" />

                <div className="d-flex justify-content-end gap-2 mb-5">
                    <Link to={RouteNames.PJESME} className="btn btn-danger px-4">
                        Odustani
                    </Link>
                    <Button type="submit" variant="success" className="px-4">
                        Spremi pjesmu
                    </Button>
                </div>
            </Form>
        </Container>
    );
}