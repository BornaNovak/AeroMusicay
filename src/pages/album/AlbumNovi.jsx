import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Container, Card, InputGroup } from "react-bootstrap";
import { RouteNames } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import AlbumService from "../../services/albumi/AlbumService";
import IzvodacService from "../../services/izvodaci/IzvodacService";

export default function AlbumNovi() {
    const navigate = useNavigate();
    const [izvodaci, setIzvodaci] = useState([]);

    useEffect(() => {
        ucitajIzvodace();
    }, []);

    async function ucitajIzvodace() {
        await IzvodacService.get().then((odgovor) => {
            if (odgovor.success) {
                const jedinstveniIzvodaci = [];
                const nazivi = new Set();

                odgovor.data.forEach(izv => {
                    if (!nazivi.has(izv.naziv)) {
                        nazivi.add(izv.naziv);
                        jedinstveniIzvodaci.push(izv);
                    }
                });

                setIzvodaci(jedinstveniIzvodaci);
            }
        });
    }

    async function dodaj(album) {
        await AlbumService.dodaj(album).then(() => {
            navigate(RouteNames.ALBUMI);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);
        dodaj({
            naziv: podaci.get('naziv'),
            izvodac: parseInt(podaci.get('izvodac')),
            datumIzdavanja: new Date(podaci.get('datumIzdavanja')).toISOString(),
        });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #198754', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary">Unos novog albuma</h3>
                            </div>

                            <Form onSubmit={odradiSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">Naziv Albuma</Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            className="border-start-0 bg-light"
                                            type="text" 
                                            name="naziv" 
                                            placeholder="Unesite naziv albuma"
                                            required 
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold text-dark">Izvođač</Form.Label>
                                            <Form.Select 
                                                className="bg-light cursor-pointer"
                                                name="izvodac" 
                                                required
                                            >
                                                <option value="">Odaberite...</option>
                                                {izvodaci && izvodaci.map((i) => (
                                                    <option key={i.sifra} value={i.sifra}>
                                                        {i.naziv}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold text-dark">Datum izdavanja</Form.Label>
                                            <Form.Control 
                                                className="bg-light"
                                                type="date" 
                                                name="datumIzdavanja" 
                                                required 
                                                onClick={(e) => e.target.showPicker()}
                                                onFocus={(e) => e.target.showPicker()}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr className="my-4 opacity-25" />

                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.ALBUMI} className="text-decoration-none">
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
                                            Dodaj novi album
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