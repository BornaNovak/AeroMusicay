import { Button, Card, Row, Col, Container } from "react-bootstrap";
import { NumericFormat } from "react-number-format";

export default function AlbumPregledGrid({ albumi, navigate, brisanje, dohvatiNazivIzvodaca, dohvatiNazivZanra }) {
    return (
        <Container className="py-3 px-0">
            <Row>
                {albumi && albumi.map((album) => (
                    <Col key={album.sifra} xs={12} md={6} lg={4} className="mb-4">
                        <Card className="shadow-sm h-100 border-0">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3 border-bottom-0">
                                <span className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                                    {album.naziv}
                                </span>
                            </Card.Header>

                            <Card.Body>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Izvođač:</span>
                                    <span className="fw-semibold text-primary">
                                        {dohvatiNazivIzvodaca(album.izvodac)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Žanr:</span>
                                    <span className="badge bg-light text-dark border">
                                        {dohvatiNazivZanra(album.zanr)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Godina:</span>
                                    <span className="fw-bold">
                                        {/* Ako imaš cijenu ili godinu, koristi NumericFormat */}
                                        <NumericFormat
                                            value={album.godinaIzdavanja}
                                            displayType={'text'}
                                            thousandSeparator=''
                                        />
                                    </span>
                                </div>
                            </Card.Body>

                            <Card.Footer className="bg-white border-top-0 d-flex gap-2 pb-3">
                                <Button
                                    variant="outline-primary"
                                    className="flex-fill rounded-pill"
                                    onClick={() => navigate(`/albumi/${album.sifra}`)}
                                >
                                    Promijeni
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="flex-fill rounded-pill"
                                    onClick={() => brisanje(album.sifra)}
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