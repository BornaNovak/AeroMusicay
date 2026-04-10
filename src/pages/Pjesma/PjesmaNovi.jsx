import { Button, Col, Form, Row, Container, Card } from "react-bootstrap";
import { RouteNames } from "../../constants";
import PjesmaService from "../../services/pjesme/PjesmaService";
import AlbumService from "../../services/albumi/AlbumService";
import ZanrService from "../../services/zanrovi/ZanrService";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PjesmaNovi() {
    const navigate = useNavigate();
    const [albumi, setAlbumi] = useState([]);
    const [zanrovi, setZanrovi] = useState([]);

    useEffect(() => {
        ucitajAlbume();
        ucitajZanrove();
    }, []);

    async function ucitajAlbume() {
        await AlbumService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati albume');
                return;
            }
            setAlbumi(odgovor.data);
        });
    }

    async function ucitajZanrove() {
        await ZanrService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati žanrove');
                return;
            }
            setZanrovi(odgovor.data);
        });
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

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length < 2) {
            alert('Naziv pjesme mora imati najmanje 2 znaka!');
            return;
        }

        dodaj({
            naziv: podaci.get('naziv'),
            album: parseInt(podaci.get('album')), 
            zanr: parseInt(podaci.get('zanr')),
            trajanje: parseInt(podaci.get('trajanje')) || 0
        });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #198754', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary"> Unos nove pjesme</h3>
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
                                                placeholder="npr. Stairway to Heaven"
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-dark">Album</Form.Label>
                                            <Form.Select name="album" className="bg-light" required>
                                                <option value="">Odaberi album...</option>
                                                {albumi && albumi.map(a => (
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
                                            <Form.Select name="zanr" className="bg-light" required>
                                                <option value="">Odaberi žanr...</option>
                                                {zanrovi && zanrovi.map(z => (
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
                                                placeholder="npr. 240"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4 opacity-25" />
                                
                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.PJESME} className="text-decoration-none">
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
                                            Spremi pjesmu
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