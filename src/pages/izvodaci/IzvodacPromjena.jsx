import {Link, useNavigate, useParams } from "react-router-dom";
import IzvodacService from "../../services/izvodaci/IzvodacService";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function IzvodacPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [izvodac, setIzvodac] = useState({})
    const [aktivan, setAktivan] = useState(false)

    useEffect(() => {
        ucitajIzvodac()
    },[])

    async function ucitajIzvodac(){
        await IzvodacService.getBySifra(params.sifra).then((odgovor)=>{
            const s = odgovor.data
            s.datumIzdavanja = s.datumIzdavanja.substring(0,10)
            setIzvodac(s)
            set.Aktivan(s.aktivan)
        })
    }

    async function promjeni(izvodac){
        await IzvodacService.promjeni(params.sifra,izvodac).then(()=>{
            navigate(RouteNames.IZVODACI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            zanr: podaci.get('zanr'),
            pjesma: podaci.get('pjesma'),
            album: podaci.get('album'),
            trajanje: parseInt(podaci.get('trajanje')),
            datumIzdavanja: new Date(podaci.get('datumIzdavanja')).toISOString()
        })
    }

return(
    <>
        <h3>Izmjena podataka glazbe</h3>
        <Form onSubmit={odradiSubmit}>
                <Form.Group controlID="naziv">
                    <Form.Label>Naziv izvodača</Form.Label>
                    <Form.Control type="text" name="naziv" required defaultValue={izvodac.naziv}/>
                </Form.Group>

                <Form.Group controlID="zanr">
                    <Form.Label>Žanr</Form.Label>
                    <Form.Control type="text" name="zanr" defaultValue={izvodac.zanr}/>
                </Form.Group>

                <Form.Group controlID="pjesma">
                    <Form.Label>Pjesma</Form.Label>
                    <Form.Control type="text" name="pjesma" required defaultValue={izvodac.pjesma}/>
                </Form.Group>

                <Form.Group controlID="album">
                    <Form.Label>Album</Form.Label>
                    <Form.Control type="text,number" name="album" defaultValue={izvodac.album}/>
                </Form.Group>

                <Form.Group controlID="trajanje">
                    <Form.Label>Trajanje</Form.Label>
                    <Form.Control type="number" name="trajanje" step={1} defaultValue={izvodac.trajanje}/>
                </Form.Group>

                <Form.Group controlID="datumIzdavanja">
                    <Form.Label>Datum izdavanja</Form.Label>
                    <Form.Control type="date" name="datumIzdavanja" defaultValue={izvodac.datumIzdavanja}/>
                </Form.Group>


                <Row className="mt-4">
                    <Col>
                        <Link to={RouteNames.IZVODACI} className="btn btn-danger">
                        Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Promjeni
                        </Button>
                    </Col>
                </Row>
            </Form>
    </>
)
}