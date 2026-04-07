import { useEffect, useState } from "react"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap"
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
                if(s.datumIzdavanja) {
                    s.datumIzdavanja = s.datumIzdavanja.substring(0,10)
                }
                setAlbum(s)
            }

            if(odgovorIzvodaci.success){
                const jedinstveniIzvodaci = [];
                const nazivi = new Set();

                odgovorIzvodaci.data.forEach(izv => {
                    // Ako naziv nepostoji u setu onda ga dodaje u listu
                    if (!nazivi.has(izv.naziv)) {
                        nazivi.add(izv.naziv);
                        jedinstveniIzvodaci.push(izv);
                    }
                });

                setIzvodaci(jedinstveniIzvodaci);
            }
        })
    }

    async function promjeni(noviAlbum){
        await AlbumService.promjeni(params.sifra, noviAlbum).then(()=>{
            navigate(RouteNames.ALBUMI)
        })
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
        <>
        <h3>Izmjena albuma</h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required defaultValue={album.naziv}/>
            </Form.Group>

            <Form.Group controlId="izvodac">
                <Form.Label>Izvođač</Form.Label>
                <Form.Select 
                    name="izvodac" 
                    value={album.izvodac || ""} 
                    onChange={(e) => setAlbum({...album, izvodac: e.target.value})}
                >
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
                <Form.Control type="date" name="datumIzdavanja" required defaultValue={album.datumIzdavanja}/>
            </Form.Group>

        <Row className="mt-5">
            <Col>
            <Link to={RouteNames.ALBUMI} className="btn btn-danger">
                Odustani
            </Link>
            </Col>
            <Col>
            <Button type="submit" variant="success">
                Spremi promjene
            </Button>
            </Col>
        </Row>
        </Form>
        </>
    )
}