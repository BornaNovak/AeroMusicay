import { Link, useNavigate, useParams } from "react-router-dom";
import PjesmaService from "../../services/pjesme/PjesmaService";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap";
import { albumi } from "../../services/albumi/AlbumPodaci";

export default function PjesmaPromjena() {
    const navigate = useNavigate();
    const params = useParams();
    const [pjesma, setPjesma] = useState(null);

    useEffect(() => {
        ucitajPjesmu();
    }, []);

    async function ucitajPjesmu() {
        const odgovor = await PjesmaService.getBySifra(params.sifra);
        if (!odgovor.success) {
            alert('Nije moguće učitati podatke o pjesmi');
            return;
        }
        setPjesma(odgovor.data);
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
            zanr: parseInt(podaci.get('zanr')),
            trajanje: parseInt(podaci.get('trajanje')) || 0
        });
    }

    if (!pjesma) return <div className="text-center mt-5">Učitavanje...</div>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #0d6efd', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary">Uredi Pjesmu: {pjesma.naziv}</h3>
                            </div>

                            <Form onSubmit={odradiSubmit}>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-dark">Naziv pjesme</Form.Label>
                                            <Form.Control 
                                                className="bg-light"
                                                type="text" 
                                                name="naziv" 
                                                defaultValue={pjesma.naziv}
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-dark">Album</Form.Label>
                                            <Form.Select name="album" className="bg-light" defaultValue={pjesma.album} required>
                                                {albumi.map(a => (
                                                    <option key={a.sifra} value={a.sifra}>
                                                        {a.naziv}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-dark">Žanr</Form.Label>
                                            <Form.Select name="zanr" className="bg-light" defaultValue={pjesma.zanr} required>
                                                {zanrovi.map(z => (
                                                    <option key={z.sifra} value={z.sifra}>
                                                        {z.naziv}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold text-dark">Trajanje (u sekundama)</Form.Label>
                                            <Form.Control 
                                                className="bg-light"
                                                type="number" 
                                                name="trajanje" 
                                                defaultValue={pjesma.trajanje}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4 opacity-25" />

                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.PJESME} className="text-decoration-none">
                                            <Button variant="danger" className="w-100 py-2 shadow-sm fw-bold rounded-pill">
                                                Odustani
                                            </Button>
                                        </Link>
                                    </Col>
                                    <Col xs={6}>
                                        <Button type="submit" variant="primary" className="w-100 py-2 shadow-sm fw-bold rounded-pill">
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