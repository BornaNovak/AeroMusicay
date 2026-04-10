import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Container, Card } from "react-bootstrap";
import { RouteNames } from "../../constants";
import ZanrService from "../../services/zanrovi/ZanrService";

export default function ZanrPromjena() {
    const navigate = useNavigate();
    const params = useParams();
    const [zanr, setZanr] = useState({});

    useEffect(() => {
        ucitajZanr();
    }, []);

    async function ucitajZanr() {
        const odgovor = await ZanrService.getBySifra(params.sifra);
        if (!odgovor.success) {
            alert('Nije moguće učitati podatke o žanru');
            return;
        }
        setZanr(odgovor.data);
    }

    async function promjeni(zanrPodaci) {
        const odgovor = await ZanrService.promjeni(params.sifra, zanrPodaci);
        if (odgovor.success) {
            navigate(RouteNames.ZANROVI || RouteNames.ZANR_PREGLED); 
        } else {
            alert(odgovor.message);
        }
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);
        const nazivZanra = podaci.get('naziv');

        if (!nazivZanra || nazivZanra.trim().length < 2) {
            alert('Naziv žanra mora imati najmanje 2 znaka!');
            return;
        }

        promjeni({
            naziv: nazivZanra.trim()
        });
    }

    if (!zanr) return <div className="text-center mt-5">Učitavanje podataka...</div>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #0d6efd', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary">Uredi Žanr: {zanr.naziv}</h3>
                            </div>

                            <Form onSubmit={odradiSubmit}>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold text-dark">Naziv žanra</Form.Label>
                                            <Form.Control 
                                                className="bg-light"
                                                type="text" 
                                                name="naziv" 
                                                defaultValue={zanr.naziv}
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4 opacity-25" />

                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.ZANR_PREGLED} className="text-decoration-none">
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