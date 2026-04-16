import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaMusic, FaDownload } from 'react-icons/fa';
import AlbumService from '../../services/albumi/AlbumService';
import IzvodacService from '../../services/izvodaci/IzvodacService';
import AlbumPDFGenerator from './AlbumPDFGenerator'; // Tvoj PDF generator koji smo napravili

export default function AlbumPregledKartice() {
    const [albumi, setAlbumi] = useState([]);
    const [izvodaci, setIzvodaci] = useState([]);

    useEffect(() => {
        ucitajPodatke();
    }, []);

    async function ucitajPodatke() {
        const resIzvodaci = await IzvodacService.get();
        if (resIzvodaci.success) setIzvodaci(resIzvodaci.data);

        const resAlbumi = await AlbumService.get();
        if (resAlbumi.success) setAlbumi(resAlbumi.data);
    }

    const dohvatiImeIzvodaca = (sifreIzvodaca) => {
        // Budući da je izvodac u tvom albumu niz [1], tražimo prvog
        const sifra = Array.isArray(sifreIzvodaca) ? sifreIzvodaca[0] : sifreIzvodaca;
        const izvodac = izvodaci.find(i => i.sifra == sifra);
        return izvodac ? izvodac.naziv : 'Nepoznat izvođač';
    };

    // Interna komponenta za karticu albuma
    const AlbumCard = ({ album }) => {
        const izvodacNaziv = dohvatiImeIzvodaca(album.izvodac);

        const handeDownloadPDF = async () => {
            // Ovdje bi trebao dohvatiti i pjesme za taj album ako ih imaš u servisu
            // Za sada šaljemo prazan niz ako nemaš PjesmaService spreman
            const generiraj = await AlbumPDFGenerator({ 
                album: album, 
                izvodac: { naziv: izvodacNaziv }, 
                pjesme: [] 
            });
            generiraj();
        };

        return (
            <Col>
                <Card className="h-100 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #ddd' }}>
                    <Card.Body className="d-flex flex-column">
                        <div className="mb-2">
                            <Badge bg="info" pill className="fw-normal">
                                {izvodacNaziv}
                            </Badge>
                        </div>
                        <Card.Title className="flex-grow-1 fw-bold mb-3 mt-2" style={{ fontSize: '1.2rem' }}>
                            {album.naziv}
                        </Card.Title>
                        
                        <Card.Text className="text-muted small">
                            Datum izdavanja: <br />
                            {new Date(album.datumIzdavanja).toLocaleDateString('hr-HR')}
                        </Card.Text>

                        <div className="d-flex gap-2 border-top pt-3">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="w-100 d-flex align-items-center justify-content-center"
                            >
                                <FaMusic className="me-2" /> Pjesme
                            </Button>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={handeDownloadPDF}
                                className="w-100 d-flex align-items-center justify-content-center"
                            >
                                <FaDownload className="me-2" /> PDF
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    return (
        <Container className="py-4">
            <div className="text-center mb-4">
                <h2>Katalog Albuma</h2>
                <p className="text-muted">Pregled svih izdanja u bazi podataka</p>
            </div>

            <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
                {albumi.map((album) => (
                    <AlbumCard key={album.sifra} album={album} />
                ))}
            </Row>
            
            {albumi.length === 0 && (
                <div className="text-center mt-5">
                    <p>Nema pronađenih albuma.</p>
                </div>
            )}
        </Container>
    );
}