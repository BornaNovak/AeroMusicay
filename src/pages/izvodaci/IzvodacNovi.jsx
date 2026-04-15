import { Button, Col, Form, Row, Container, Card, InputGroup } from "react-bootstrap"
import { RouteNames } from "../../constants"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import ZanrService from "../../services/zanrovi/ZanrService" // 1. Uvezi ZanrService
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react" // 2. Uvezi hookove

export default function IzvodacNovi() {
    const navigate = useNavigate()
    const [zanrovi, setZanrovi] = useState([]) // State za pohranu žanrova

    // 3. Dohvati žanrove prilikom učitavanja komponente
    useEffect(() => {
        ucitajZanrove()
    }, [])

    async function ucitajZanrove() {
        const odgovor = await ZanrService.get()
        if (odgovor.success) {
            setZanrovi(odgovor.data)
        } else {
            alert('Greška pri učitavanju žanrova')
        }
    }

    async function dodaj(izvodac) {
        await IzvodacService.dodaj(izvodac).then(() => {
            navigate(RouteNames.IZVODACI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault()
        const podaci = new FormData(e.target)

        if (!podaci.get('naziv') || podaci.get('naziv').trim().length < 3) {
            alert('Naziv izvođača mora imati najmanje 3 znaka!')
            return
        }

        dodaj({
            naziv: podaci.get('naziv'),
            dominantniZanr: parseInt(podaci.get('dominantniZanr'))
        })
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #198754', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary"> Unos novog izvođača</h3>
                            </div>

                            <Form onSubmit={odradiSubmit}>
                                
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">Naziv izvođača</Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            className="bg-light"
                                            type="text" 
                                            name="naziv" 
                                            placeholder="npr. Oliver Dragojević"
                                            required 
                                        />
                                    </InputGroup>
                                </Form.Group>

                                {/* 5. Padajuća lista za odabir žanra */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">Odabir žanra</Form.Label>
                                    <Form.Select 
                                        name="dominantniZanr" 
                                        className="bg-light"
                                        required
                                    >
                                        <option value="">Odaberite dominantni žanr...</option>
                                        {zanrovi && zanrovi.map((z) => (
                                            <option key={z.sifra} value={z.sifra}>
                                                {z.naziv}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <hr className="my-4 opacity-25" />
                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.IZVODACI} className="text-decoration-none">
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
                                            Spremi izvođača
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}