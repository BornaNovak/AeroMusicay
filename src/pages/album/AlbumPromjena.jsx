import { useEffect, useState } from "react"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row, Container, Card, InputGroup } from "react-bootstrap"
import AlbumService from "../../services/albumi/AlbumService"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import { Link, useNavigate, useParams } from "react-router-dom"

export default function AlbumPromjena(){
    const navigate = useNavigate()
    const params = useParams()
    
    const [album, setAlbum] = useState({})
    const [izvodaci, setIzvodaci] = useState([])

    useEffect(()=>{
        ucitajPodatke()
    },[])

    async function ucitajPodatke(){
        await Promise.all([
            AlbumService.getBySifra(params.sifra),
            IzvodacService.get()
        ]).then(([odgovorAlbum, odgovorIzvodaci]) => {
            if(odgovorAlbum.success){
                const s = odgovorAlbum.data
                if(s.datumIzdavanja) s.datumIzdavanja = s.datumIzdavanja.substring(0,10)
                setAlbum(s)
            }
            if(odgovorIzvodaci.success){
                const jedinstveni = [];
                const nazivi = new Set();
                odgovorIzvodaci.data.forEach(izv => {
                    if (!nazivi.has(izv.naziv)) {
                        nazivi.add(izv.naziv);
                        jedinstveni.push(izv);
                    }
                });
                setIzvodaci(jedinstveni);
            }
        })
    }

    async function promjeni(noviAlbum){
        await AlbumService.promjeni(params.sifra, noviAlbum).then(()=> navigate(RouteNames.ALBUMI))
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            izvodac: podaci.get('izvodac'),
            datumIzdavanja: new Date(podaci.get('datumIzdavanja')).toISOString(),
        })
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0" style={{ borderTop: '5px solid #198754', borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-secondary"> Uredi Album</h3>
                            </div>

                            <Form onSubmit={odradiSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-dark">Naziv albuma</Form.Label>
                                    <InputGroup>
                                        <Form.Control 
                                            className="border-start-0 bg-light"
                                            type="text" 
                                            name="naziv" 
                                            required 
                                            defaultValue={album.naziv}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold text-dark">Izvođač</Form.Label>
                                            <Form.Select 
                                                className="bg-light cursor-pointer"
                                                name="izvodac" 
                                                value={album.izvodac || ""} 
                                                onChange={(e) => setAlbum({...album, izvodac: e.target.value})}
                                            >
                                                <option value="">Odaberite...</option>
                                                {izvodaci.map((i) => (
                                                    <option key={i.sifra} value={i.sifra}>{i.naziv}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold text-dark">Datum izdanja</Form.Label>
                                            <Form.Control 
                                                className="bg-light"
                                                type="date" 
                                                name="datumIzdavanja" 
                                                required 
                                                defaultValue={album.datumIzdavanja}
                                                onClick={(e) => e.target.showPicker()}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4 opacity-25" />

                                <Row>
                                    <Col xs={6}>
                                        <Link to={RouteNames.ALBUMI} className="text-decoration-none">
                                            <Button 
                                                variant="danger" 
                                                className="w-100 py-2 shadow-sm fw-bold rounded-pill" >
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
                                            Spremi promjene
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