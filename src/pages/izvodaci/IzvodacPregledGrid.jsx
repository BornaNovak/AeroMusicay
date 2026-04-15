import { Button, Card, Row, Col, Container } from "react-bootstrap";

export default function IzvodacPregledGrid({ 
    izvodaci, 
    navigate, 
    brisanje, 
    dohvatiNazivZanra // Dodano iz props-a
}) {
    return (
        <Container className="py-3 px-0">
            <Row>
                {izvodaci && izvodaci.map((izvodac) => (
                    <Col key={izvodac.sifra} xs={12} md={6} lg={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Body className="text-center d-flex flex-column justify-content-center">
                                <Card.Title className="fw-bold text-dark mb-2">
                                    {izvodac.naziv}
                                </Card.Title>
                                
                                {/* Prikaz žanra diskretnijim stilom */}
                                <div className="text-muted small">
                                    Žanr: <span className="fw-semibold text-secondary">
                                        {dohvatiNazivZanra(izvodac.dominantniZanr)}
                                    </span>
                                </div>
                            </Card.Body>

                            <Card.Footer className="bg-white border-top-0 d-flex gap-2 pb-3">
                                <Button
                                    size="sm"
                                    className="flex-fill"
                                    onClick={() => navigate(`/izvodaci/${izvodac.sifra}`)}
                                >
                                    Promijeni
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    className="flex-fill"
                                    onClick={() => brisanje(izvodac.sifra)}
                                >
                                    Obriši
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}