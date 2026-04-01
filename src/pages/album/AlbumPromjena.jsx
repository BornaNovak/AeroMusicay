import { use, useEffect, useState } from "react"
import { RouteNames } from "../../constants"
import { Button, Col, Form, Row } from "react-bootstrap"
import AlbumService from "../../services/albumi/AlbumService"
import { useNavigate, useParams } from "react-router-dom"

export default function AlbumPromjena(){
    const navigate = useNavigate()
    const params = useParams()
    const [album, setAlbum] = useState({})
    const [aktivan, setAktivan] = useState(false)

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
            s.datumIzdavanja = s.datumIzdavanja.substring(0,10)
            setAlbum(s)
            set.Aktivan(s.aktivan)
        })
    }

    async function promjeni(album){
        await AlbumService.promjeni(params.sifra,album).then(()=>{
            navigate(RouteNames.ALBUMI)
        })
    }

    function odradiSubmit(e){
        const podaci = new FormData(e.target)
        promjeni({
            naziv: podaci.get('naziv'),
            album: podaci.get('album'),
            datumIzdavanja: new Date(podaci.get('datumIzdavanja')).toISOString(),
        })
    }

    return (
        <>
        <h3>Izmjena albuma</h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required />
            </Form.Group>

            <Form.Group controlId="album">
                <Form.Label>Album</Form.Label>
                <Form.Control type="text" name="album" required />
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