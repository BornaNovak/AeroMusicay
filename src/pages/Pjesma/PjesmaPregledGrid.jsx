import { Button, Card, Row, Col, Container } from "react-bootstrap";
import { formatirajTrajanje } from "../../utils";

export default function PjesmaPregledGrid({ 
    pjesme, 
    navigate, 
    brisanje, 
    generirajPDF, 
    dohvatiNazivAlbuma,
    dohvatiNaziveZanrova
}) {
    return (
        <Container className="py-3 px-0">
            <Row className="justify-content-center">
                {pjesme && pjesme.map((pjesma) => (
                    // xs={12} osigurava da kartica ide preko cijele širine na mobitelu, kao na tvojoj slici
                    <Col key={pjesma.sifra} xs={12} className="mb-3">
                        <Card className="shadow-sm border-light">
                            <Card.Body>
                                {/* NASLOV: Naziv pjesme */}
                                <Card.Title className="fw-bold text-dark mb-3">
                                    {pjesma.naziv}
                                </Card.Title>
                                
                                {/* DETALJI: Album, Žanrovi, Trajanje */}
                                <div className="mb-2">
                                    <span className="text-muted">Album: </span>
                                    <span className="fw-semibold text-dark">
                                        {dohvatiNazivAlbuma(pjesma.album)}
                                    </span>
                                </div>

                                <div className="mb-2">
                                    <span className="text-muted">Žanrovi: </span>
                                    <span className="fw-semibold text-dark">
                                        {dohvatiNaziveZanrova(pjesma.zanr)}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <span className="text-muted">Trajanje: </span>
                                    <span className="fw-semibold text-dark">
                                        {formatirajTrajanje(pjesma.trajanje)}
                                    </span>
                                </div>

                                {/* GUMBI: Identičan raspored i boje kao na slici albuma */}
                                <div className="d-flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        className="flex-fill shadow-sm"
                                        onClick={() => navigate(`/pjesme/${pjesma.sifra}`)}
                                    >
                                        Promjeni
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        className="flex-fill shadow-sm"
                                        onClick={() => brisanje(pjesma.sifra)}
                                    >
                                        Obriši
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="info"
                                        className="flex-fill shadow-sm text-white"
                                        onClick={() => generirajPDF(pjesma)}
                                    >
                                        PDF
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}