import { Button, Col, Form, Row, Container, Card } from "react-bootstrap";
import { RouteNames } from "../../constants";
import ZanrService from "../../services/zanrovi/ZanrService";
import { Link, useNavigate } from "react-router-dom";

export default function ZanrNovi() {
    const navigate = useNavigate();

    async function dodaj(zanr) {
        const odgovor = await ZanrService.dodaj(zanr);
        if (odgovor.success) {
            navigate(RouteNames.ZANR_PREGLED); 
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

        dodaj({
            naziv: nazivZanra.trim()
        });
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #198754', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary">Unos novog žanra</h3>
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
                                                placeholder="npr. Heavy Metal, Jazz, Pop..."
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4 opacity-25" />
                                
                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.ZANR_PREGLED} className="text-decoration-none">
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
                                            Spremi žanr
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