import { Button, Col, Form, Row, Container, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import { Link, useNavigate } from "react-router-dom"

export default function IzvodacNovi() {
    const navigate = useNavigate()

    async function dodaj(izvodac) {
        await IzvodacService.dodaj(izvodac).then(() => {
            navigate(RouteNames.IZVODACI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        // --- KONTROLA 1: Naziv izvođača ---
        if (!podaci.get('naziv') || podaci.get('naziv').trim().length < 3) {
            alert('Naziv izvođača mora imati najmanje 3 znaka!')
            return
        }

        /* --- ZAKOMENTIRANE KONTROLE KOJE VIŠE NISU POTREBNE ---
        // --- KONTROLA 2: Pjesma ---
        if (!podaci.get('pjesma') || podaci.get('pjesma').trim().length === 0) {
            alert('Naziv pjesme je obavezan!')
            return
        }

        // --- KONTROLA 3: Trajanje ---
        const trajanje = parseInt(podaci.get('trajanje'))
        if (isNaN(trajanje) || trajanje < 1 || trajanje > 500) {
            alert('Trajanje pjesme mora biti broj između 1 i 500 sekundi/minuta!')
            return
        }

        // --- KONTROLA 4: Datum izdavanja ---
        if (!podaci.get('datumIzdavanja') || podaci.get('datumIzdavanja') === "") {
            alert("Morate odabrati datum izdavanja!");
            return;
        }
        */

        dodaj({
            naziv: podaci.get('naziv'),
            zanr: podaci.get('zanr'),
            pjesma: '', 
            album: '',
            trajanje: 0,
            datumIzdavanja: new Date().toISOString() 
        })
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-4">Unos novog izvođača</Card.Title>
                    <Form onSubmit={odradiSubmit}>
                    
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="naziv" className="mb-3">
                                    <Form.Label className="fw-bold">Naziv izvođača</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="naziv" 
                                        placeholder="npr. Oliver Dragojević"
                                        required 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="zanr" className="mb-3">
                                    <Form.Label className="fw-bold">Žanr</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="zanr" 
                                        placeholder="npr. Pop, Rock"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* zakomentirani dijelovi form */}
                        {/* <Row>
                            <Col md={6}>
                                <Form.Group controlId="pjesma" className="mb-3">
                                    <Form.Label className="fw-bold">Pjesma</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="pjesma" 
                                        placeholder="Naziv pjesme"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="album" className="mb-3">
                                    <Form.Label className="fw-bold">Album</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="album" 
                                        placeholder="Naziv albuma"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="trajanje" className="mb-3">
                                    <Form.Label className="fw-bold">Trajanje</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="trajanje" 
                                        placeholder="u sekundama"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="datumIzdavanja" className="mb-3">
                                    <Form.Label className="fw-bold">Datum izdavanja</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        name="datumIzdavanja"
                                    />
                                </Form.Group>
                            </Col>
                        </Row> 
                        */}

                        <hr />

                        {/* Gumbi */}
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <Link to={RouteNames.IZVODACI} className="btn btn-danger px-4">
                                Odustani
                            </Link>
                            <Button type="submit" variant="success" className="px-4">
                                Dodaj novog izvođača
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}