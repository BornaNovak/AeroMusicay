import { Link, useNavigate, useParams } from "react-router-dom"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import { RouteNames } from "../../constants"
import { useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"

export default function IzvodacPromjena() {
    const navigate = useNavigate()
    const params = useParams()
    const [izvodac, setIzvodac] = useState({})
    // const [aktivan, setAktivan] = useState(false) //

    useEffect(() => {
        ucitajIzvodac()
    },[])

    async function ucitajIzvodac(){
        await IzvodacService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            // Provjera postoji li datum prije substringa da se izbjegne error
            if (s.datumIzdavanja) {
                s.datumIzdavanja = s.datumIzdavanja.substring(0,10)
            }
            setIzvodac(s)
            // setAktivan(s.aktivan) //
        })
    }

    async function promjeni(izvodacPodaci){
        await IzvodacService.promjeni(params.sifra, izvodacPodaci).then(()=>{
            navigate(RouteNames.IZVODACI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault()
        const podaci = new FormData(e.target)
        
        promjeni({
            naziv: podaci.get('naziv'),
            zanr: podaci.get('zanr'),
            // Zadržavamo stare podatke ili šaljemo prazno za zakomentirana polja
            pjesma: izvodac.pjesma || '', 
            album: izvodac.album || '',
            trajanje: izvodac.trajanje || 0,
            datumIzdavanja: izvodac.datumIzdavanja ? new Date(izvodac.datumIzdavanja).toISOString() : new Date().toISOString()
        })
    }

return(
    <>
        <h3>Izmjena podataka izvođača</h3>
        <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="naziv">
                    <Form.Label>Naziv izvođača</Form.Label>
                    <Form.Control type="text" name="naziv" required defaultValue={izvodac.naziv}/>
                </Form.Group>

                <Form.Group controlId="zanr" className="mt-3">
                    <Form.Label>Žanr</Form.Label>
                    <Form.Control type="text" name="zanr" defaultValue={izvodac.zanr}/>
                </Form.Group>

                {/* <Form.Group controlId="pjesma" className="mt-3">
                    <Form.Label>Pjesma</Form.Label>
                    <Form.Control type="text" name="pjesma" required defaultValue={izvodac.pjesma}/>
                </Form.Group>

                <Form.Group controlId="album" className="mt-3">
                    <Form.Label>Album</Form.Label>
                    <Form.Control type="text" name="album" defaultValue={izvodac.album}/>
                </Form.Group>

                <Form.Group controlId="trajanje" className="mt-3">
                    <Form.Label>Trajanje</Form.Label>
                    <Form.Control type="number" name="trajanje" step={1} defaultValue={izvodac.trajanje}/>
                </Form.Group>

                <Form.Group controlId="datumIzdavanja" className="mt-3">
                    <Form.Label>Datum izdavanja</Form.Label>
                    <Form.Control type="date" name="datumIzdavanja" defaultValue={izvodac.datumIzdavanja}/>
                </Form.Group> 
                */}


                <Row className="mt-5">
                    <Col>
                        <Link to={RouteNames.IZVODACI} className="btn btn-danger w-100">
                        Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success" className="w-100">
                            Spremi promjene
                        </Button>
                    </Col>
                </Row>
            </Form>
    </>
)
}