import { Link, useNavigate, useParams } from "react-router-dom";
import IzvodacService from "../../services/izvodaci/IzvodacService";
import ZanrService from "../../services/zanrovi/ZanrService"; // 1. Import servisa
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap";

export default function IzvodacPromjena() {
    const navigate = useNavigate();
    const params = useParams();
    const [izvodac, setIzvodac] = useState({});
    const [zanrovi, setZanrovi] = useState([]); // 2. State za listu žanrova

    useEffect(() => {
        ucitajPodatke();
    }, []);

    // 3. Učitavamo i izvođača i listu žanrova
    async function ucitajPodatke() {
        // Dohvat žanrova
        const resZanrovi = await ZanrService.get();
        if (resZanrovi.success) setZanrovi(resZanrovi.data);

        // Dohvat izvođača
        const resIzvodac = await IzvodacService.getBySifra(params.sifra);
        if (!resIzvodac.success) {
            alert('Nije moguće učitati podatke o izvođaču');
            return;
        }
        setIzvodac(resIzvodac.data);
    }

    async function promjeni(izvodacPodaci) {
        await IzvodacService.promjeni(params.sifra, izvodacPodaci).then(() => {
            navigate(RouteNames.IZVODACI);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length < 3) {
            alert('Naziv izvođača mora imati najmanje 3 znaka!')
            return
        }

        promjeni({
            naziv: podaci.get('naziv'),
            dominantniZanr: parseInt(podaci.get('dominantniZanr'))
        });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #198754', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary"> Uredi Izvođača</h3>
                            </div>

                            <Form onSubmit={odradiSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">Naziv izvođača</Form.Label>
                                    <Form.Control 
                                        className="bg-light"
                                        type="text" 
                                        name="naziv" 
                                        required 
                                        defaultValue={izvodac.naziv} 
                                    />
                                </Form.Group>

                                {/* 5. Padajuća lista za žanrove */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">Žanr</Form.Label>
                                    <Form.Select 
                                        name="dominantniZanr" 
                                        className="bg-light"
                                        value={izvodac.dominantniZanr || ""} 
                                        onChange={(e) => setIzvodac({...izvodac, dominantniZanr: parseInt(e.target.value)})}
                                    >
                                        <option value="">Odaberite žanr...</option>
                                        {zanrovi && zanrovi.map((z) => (
                                            <option key={z.sifra} value={z.sifra}>
                                                {z.naziv}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <hr className="my-4 opacity-25" />

                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.IZVODACI} className="text-decoration-none">
                                            <Button 
                                                variant="danger" 
                                                className="w-100 py-2 shadow-sm fw-bold rounded-pill"
                                            >
                                                Odustani
                                            </Button>
                                        </Link>
                                    </Col>
                                    <Col xs={6}>
                                        <Button 
                                            type="submit" 
                                            variant="success" 
                                            className="w-100 py-2 shadow-sm fw-bold rounded-pill"
                                        >
                                            Spremi
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}