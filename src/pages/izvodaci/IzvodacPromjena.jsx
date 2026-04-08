import { Link, useNavigate, useParams } from "react-router-dom";
import IzvodacService from "../../services/izvodaci/IzvodacService";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Container, Card, InputGroup } from "react-bootstrap";

export default function IzvodacPromjena() {
    const navigate = useNavigate();
    const params = useParams();
    const [izvodac, setIzvodac] = useState({});

    useEffect(() => {
        ucitajIzvodac();
    }, []);

    async function ucitajIzvodac() {
        await IzvodacService.getBySifra(params.sifra).then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati podatke o izvođaču');
                return;
            }
            const s = odgovor.data;
            if (s.datumIzdavanja) {
                s.datumIzdavanja = s.datumIzdavanja.substring(0, 10);
            }
            setIzvodac(s);
        });
    }

    async function promjeni(izvodacPodaci) {
        await IzvodacService.promjeni(params.sifra, izvodacPodaci).then(() => {
            navigate(RouteNames.IZVODACI);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        promjeni({
            naziv: podaci.get('naziv'),
            zanr: podaci.get('zanr'),
            pjesma: izvodac.pjesma || '',
            album: izvodac.album || '',
            trajanje: izvodac.trajanje || 0,
            datumIzdavanja: izvodac.datumIzdavanja ? new Date(izvodac.datumIzdavanja).toISOString() : new Date().toISOString()
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

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">Žanr</Form.Label>
                                    <Form.Control 
                                        className="bg-light"
                                        type="text" 
                                        name="zanr" 
                                        defaultValue={izvodac.zanr} 
                                    />
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
                                            Spremi izmjene
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