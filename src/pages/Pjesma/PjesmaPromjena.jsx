import { Link, useNavigate, useParams } from "react-router-dom";
import PjesmaService from "../../services/pjesme/PjesmaService";
import AlbumService from "../../services/albumi/AlbumService"; 
import IzvodacService from "../../services/izvodaci/IzvodacService"; 
import ZanrService from "../../services/zanrovi/ZanrService"; 
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Container, Card, Table } from "react-bootstrap";

export default function PjesmaPromjena() {
    const navigate = useNavigate();
    const params = useParams();
    
    const [pjesma, setPjesma] = useState(null);
    const [albumi, setAlbumi] = useState([]); 
    const [sviZanrovi, setSviZanrovi] = useState([]); 
    const [odabraniZanrovi, setOdabraniZanrovi] = useState([]);
    const [pretragaZanrova, setPretragaZanrova] = useState('');
    const [prikaziAutocomplete, setPrikaziAutocomplete] = useState(false);
    const [odabraniIndex, setOdabraniIndex] = useState(-1);

    useEffect(() => {
        ucitajPodatke();
    }, []);

    async function ucitajPodatke() {
        const [resPjesma, resAlbumi, resZanrovi] = await Promise.all([
            PjesmaService.getBySifra(params.sifra),
            AlbumService.get(),
            ZanrService.get()
        ]);

        if (resAlbumi.success) setAlbumi(resAlbumi.data);
        if (resZanrovi.success) setSviZanrovi(resZanrovi.data);

        if (resPjesma.success) {
            setPjesma(resPjesma.data);
            if (resPjesma.data.zanr && resZanrovi.success) {
                const postojeci = resZanrovi.data.filter(z => resPjesma.data.zanr.includes(z.sifra));
                setOdabraniZanrovi(postojeci);
            }
        } else {
            alert('Nije moguće učitati podatke o pjesmi');
        }
    }

    async function handleAlbumChange(e) {
        const albumSifra = parseInt(e.target.value);
        if (!albumSifra) return;

        const album = albumi.find(a => a.sifra === albumSifra);
        
        if (album && album.izvodac) {
            const resIzvodac = await IzvodacService.getBySifra(album.izvodac);
            if (resIzvodac.success && resIzvodac.data.dominantniZanr) {
                const domZanr = sviZanrovi.find(z => z.sifra == resIzvodac.data.dominantniZanr);
                if (domZanr) {
                    dodajZanr(domZanr);
                }
            }
        }
    }

    function dodajZanr(zanr) {
        if (!odabraniZanrovi.find(z => z.sifra === zanr.sifra)) {
            setOdabraniZanrovi([...odabraniZanrovi, zanr]);
        }
        setPretragaZanrova('');
        setPrikaziAutocomplete(false);
        setOdabraniIndex(-1);
    }

    function ukloniZanr(sifra) {
        setOdabraniZanrovi(odabraniZanrovi.filter(z => z.sifra !== sifra));
    }

    function filtrirajZanrove() {
        if (!pretragaZanrova) return [];
        return sviZanrovi.filter(z => 
            !odabraniZanrovi.find(oz => oz.sifra === z.sifra) &&
            z.naziv.toLowerCase().includes(pretragaZanrova.toLowerCase())
        );
    }

    function handleKeyDown(e) {
        const filtrirani = filtrirajZanrove();
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOdabraniIndex(prev => prev < filtrirani.length - 1 ? prev + 1 : prev);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setOdabraniIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (e.key === 'Enter' && odabraniIndex >= 0 && filtrirani.length > 0) {
            e.preventDefault();
            dodajZanr(filtrirani[odabraniIndex]);
        } else if (e.key === 'Escape') {
            setPrikaziAutocomplete(false);
        }
    }

    async function promjeni(pjesmaPodaci) {
        const odgovor = await PjesmaService.promjeni(params.sifra, pjesmaPodaci);
        if (odgovor.success) {
            navigate(RouteNames.PJESME);
        } else {
            alert('Došlo je do greške kod spremanja na server.');
        }
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        // Provjera naziva
        if (!podaci.get('naziv') || podaci.get('naziv').trim().length < 2) {
            alert('Naziv pjesme mora imati najmanje 2 znaka!');
            return;
        }

        // --- KLJUČNA IZMJENA ZA TRAJANJE ---
        const trajanje = parseInt(podaci.get('trajanje'));

        if (isNaN(trajanje) || trajanje < 1) {
            alert('Greška: Trajanje pjesme mora biti pozitivan broj (minimalno 1 sekunda)!');
            return; // Ovdje prekidamo i funkcija "promjeni" se nikada ne pozove
        }
        // ------------------------------------

        promjeni({
            naziv: podaci.get('naziv'),
            album: parseInt(podaci.get('album')),
            zanr: odabraniZanrovi.map(z => z.sifra), 
            trajanje: trajanje
        });
    }

    if (!pjesma) return <div className="text-center mt-5">Učitavanje...</div>;

    return (
        <Container className="mt-4">
            <h3 className="mb-4">Uredi pjesmu: {pjesma.naziv}</h3>
            <Form onSubmit={odradiSubmit}>
                <Row>
                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Podaci o pjesmi</Card.Title>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Naziv</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="naziv" 
                                        defaultValue={pjesma.naziv} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Album</Form.Label>
                                    <Form.Select 
                                        name="album" 
                                        defaultValue={pjesma.album} 
                                        required
                                        onChange={handleAlbumChange}
                                    >
                                        <option value="">Odaberite album</option>
                                        {albumi.map(a => (
                                            <option key={a.sifra} value={a.sifra}>{a.naziv}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Trajanje (sekunde)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="trajanje" 
                                        defaultValue={pjesma.trajanje} 
                                        min="1" // HTML5 validacija (vizualno)
                                        required 
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-4">Žanrovi</Card.Title>

                                <Form.Group className="mb-3 position-relative">
                                    <Form.Label className="fw-bold">Dodaj žanr</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Pretraži žanrove..."
                                        value={pretragaZanrova}
                                        onChange={(e) => {
                                            setPretragaZanrova(e.target.value);
                                            setPrikaziAutocomplete(e.target.value.length > 0);
                                            setOdabraniIndex(-1);
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                    
                                    {prikaziAutocomplete && filtrirajZanrove().length > 0 && (
                                        <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{zIndex: 1000}}>
                                            {filtrirajZanrove().map((z, index) => (
                                                <div
                                                    key={z.sifra}
                                                    className="p-2"
                                                    style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: index === odabraniIndex ? '#0d6efd' : 'white',
                                                        color: index === odabraniIndex ? 'white' : 'black'
                                                    }}
                                                    onClick={() => dodajZanr(z)}
                                                    onMouseEnter={() => setOdabraniIndex(index)}
                                                >
                                                    {z.naziv}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>

                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Naziv žanra</th>
                                            <th style={{width: '80px'}}>Akcija</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {odabraniZanrovi.map(z => (
                                            <tr key={z.sifra}>
                                                <td className="align-middle">{z.naziv}</td>
                                                <td>
                                                    <Button variant="outline-danger" size="sm" onClick={() => ukloniZanr(z.sifra)}>
                                                        Ukloni
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {odabraniZanrovi.length === 0 && <p className="text-muted small">Nema odabranih žanrova.</p>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4 mb-5">
                    <Link to={RouteNames.PJESME} className="btn btn-secondary px-4">Odustani</Link>
                    <Button type="submit" variant="success" className="px-4">Spremi izmjene</Button>
                </div>
            </Form>
        </Container>
    );
}