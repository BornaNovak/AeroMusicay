import { Button, Col, Form, Row } from "react-bootstrap"
import { RouteNames } from "../../constants"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import { Link, useNavigate } from "react-router-dom"

export default function IzvodacNovi(){
    const navigate = useNavigate()

    async function dodaj(izvodac){
        await IzvodacService.dodaj(izvodac).then(()=>{
            navigate(RouteNames.IZVODACI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci= new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            zanr: podaci.get('zanr'),
            pjesma: podaci.get('pjesma'),
            album: podaci.get('album'),
            trajanje: parseInt(podaci.get('trajanje')),
            datumIzdavanja: new Date(podaci.get('datumIzdavanja')).toISOString(),
            akcija: podaci.get('akcija')
        })
    }



    return (
        <>
            <h3>Unos novog izvodaca</h3>
            <Form onSubmit={odradiSubmit}>
                <Form.Group controlID="naziv">
                    <Form.Label>Naziv izvodaca</Form.Label>
                    <Form.Control type="text" name="naziv" required/>
                </Form.Group>

                <Form.Group controlID="zanr">
                    <Form.Label>Zanr</Form.Label>
                    <Form.Control type="text" name="zanr"/>
                </Form.Group>

                <Form.Group controlID="pjesma">
                    <Form.Label>Pjesma</Form.Label>
                    <Form.Control type="text" name="pjesma" required/>
                </Form.Group>

                <Form.Group controlID="album">
                    <Form.Label>Album</Form.Label>
                    <Form.Control type="text,number" name="album"/>
                </Form.Group>

                <Form.Group controlID="trajanje">
                    <Form.Label>Trajanje</Form.Label>
                    <Form.Control type="number" name="trajanje" step={1}/>
                </Form.Group>

                <Form.Group controlID="datumIzdavanja">
                    <Form.Label>Datum izdavanja</Form.Label>
                    <Form.Control type="date" name="datumIzdavanja"/>
                </Form.Group>

                <Form.Group controlID="akcija">
                    <Form.Label>Akcija</Form.Label>
                    <Form.Control type="text" name="akcija"/>
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.IZVODACI} className="btn btn-danger">
                        Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novi smjer
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}