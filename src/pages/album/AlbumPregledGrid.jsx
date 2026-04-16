import { Button, Card, Row, Col, Container } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";

export default function AlbumPregledGrid({ 
    albumi, 
    navigate, 
    brisanje, 
    dohvatiNazivIzvodaca,
    generirajPDF // <-- Dodano u propse
}) {
    return (
        <Container className="py-3 px-0">
            <Row>
                {albumi && albumi.map((album) => (
                    <Col key={album.sifra} xs={12} md={6} lg={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <Card.Title className="fw-bold text-dark mb-3">
                                    {album.naziv}
                                </Card.Title>
                                
                                <div className="mb-2">
                                    <span className="text-muted">Izvođač: </span>
                                    <span className="fw-semibold">
                                        {dohvatiNazivIzvodaca(album.izvodac)}
                                    </span>
                                </div>

                                <div className="mb-0">
                                    <span className="text-muted">Datum izdavanja: </span>
                                    <span>
                                        <FormatDatuma datum={album.datumIzdavanja} />
                                    </span>
                                </div>
                            </Card.Body>

                            <Card.Footer className="bg-white border-top-0 d-flex gap-2 pb-3">
                                <Button
                                    size="sm"
                                    className="flex-fill"
                                    onClick={() => navigate(`/albumi/${album.sifra}`)}
                                >
                                    Promjeni
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    className="flex-fill"
                                    onClick={() => brisanje(album.sifra)}
                                >
                                    Obriši
                                </Button>
                                {/* NOVI GUMB ZA PDF */}
                                <Button
                                    size="sm"
                                    variant="info"
                                    className="flex-fill text-white"
                                    onClick={() => generirajPDF(album)}
                                >
                                    PDF
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}