import { useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import AlbumService from "../../services/albumi/AlbumService"
import IzvodacService from "../../services/izvodaci/IzvodacService"

export default function AlbumNovi(){
    const navigate = useNavigate();
    const [izvodaci, setIzvodaci] = useState([]);

    useEffect(() => {
        ucitajIzvodace();
    }, []);

    async function ucitajIzvodace() {
        await IzvodacService.get().then((odgovor) => {
            if (odgovor.success) {
                const jedinstveniIzvodaci = [];
                const nazivi = new Set();

                odgovor.data.forEach(izv => {
                    if (!nazivi.has(izv.naziv)) {
                        nazivi.add(izv.naziv);
                        jedinstveniIzvodaci.push(izv);
                    }
                });

                setIzvodaci(jedinstveniIzvodaci);
                // --------------------------------------
            }
        });
    }

    async function dodaj(album){
        await AlbumService.dodaj(album).then(()=>{
            navigate(RouteNames.ALBUMI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        dodaj({
            naziv: podaci.get('naziv'),
            izvodac: podaci.get('izvodac'), // Uzima vrijednost iz odabranog <option>
            datumIzdavanja: new Date(podaci.get('datumIzdavanja')).toISOString(),
        })
    }

    return ( 
        <>
        <h3>Unos novog albuma</h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv Albuma</Form.Label>
                <Form.Control type="text" name="naziv" required />
            </Form.Group>

            
            <Form.Group controlId="izvodac">
                <Form.Label>Izvođač</Form.Label>
                <Form.Select name="izvodac" required>
                    <option value="">Odaberite izvođača</option>
                    {izvodaci && izvodaci.map((i) => (
                        <option key={i.sifra} value={i.sifra}>
                            {i.naziv}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="datumIzdavanja">
                <Form.Label>Datum izdavanja</Form.Label>
                <Form.Control type="date" name="datumIzdavanja" required />
            </Form.Group>

        <Row className="mt-5">
            <Col>
            <Link to={RouteNames.ALBUMI} className="btn btn-danger">
                Odustani
            </Link>
            </Col>
            <Col>
            <Button type="submit" variant="success">
                Dodaj novi album
            </Button>
            </Col>
        </Row>
        </Form>
        </>
    )
}