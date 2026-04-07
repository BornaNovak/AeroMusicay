import { useEffect, useState } from "react"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap"
import AlbumService from "../../services/albumi/AlbumService"
import { Link, useNavigate, useParams } from "react-router-dom"

export default function AlbumPromjena(){
    const navigate = useNavigate()
    const params = useParams()
    const [album, setAlbum] = useState({})

    useEffect(()=>{
        ucitajAlbum()
    },[])

    async function ucitajAlbum(){
        await AlbumService.getBySifra(params.sifra).then((odgovor)=>{
            if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }
            const s = odgovor.data
            if(s.datumIzdavanja) {
                s.datumIzdavanja = s.datumIzdavanja.substring(0,10)
            }
            setAlbum(s)
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
                <Form.Control type="text" name="naziv" required  defaultValue={album.naziv}/>
            </Form.Group>

            <Form.Group controlId="izvodac">
                <Form.Label>Izvođač</Form.Label>
                <Form.Control type="text" name="izvodac" required defaultValue={album.izvodac}/>
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