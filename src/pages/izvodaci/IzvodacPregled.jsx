import { useState } from 'react'; // Dodano za praćenje stanja playera
import { Container, Table, Button, Accordion, Card } from 'react-bootstrap';
import GlazbaRedak from '../../components/GlazbaRedak';

export default function IzvodacPregled() {
    // Stanje koje čuva trenutno odabranu pjesmu (u početku je null)
    const [trenutnaPjesma, setTrenutnaPjesma] = useState(null);

    const izvodaci = [
        { 
            id: 1, 
            naziv: 'Led Zeppelin', 
            zanr: 'Rock',
            pjesme: [
                { id: 101, ime: 'Whole Lotta Love', trajanje: '4:48', godina: 1969, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
                { id: 102, ime: 'Stairway to Heaven', trajanje: '7:29', godina: 1971, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
            ]
        },
        { 
            id: 2, 
            naziv: 'The Doors', 
            zanr: 'Rock, Blues',
            pjesme: [
                { id: 201, ime: 'Riders on the Storm', trajanje: '7:14', godina: 1971, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
                { id: 202, ime: 'The End', trajanje: '11:41', godina: 1967, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
            ]
        },
        {
            id: 3,
            naziv: 'Pink Floyd',
            zanr: 'Progressive Rock',
            pjesme: [
                { id: 301, ime: 'Wish You Were Here', trajanje: '5:35', godina: 1975, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
                { id: 302, ime: 'Comfortably Numb', trajanje: '6:21', godina: 1979, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' }
            ]
        },
        {
            id: 4,
            naziv: 'Rolling Stones',
            zanr: 'Rock',
            pjesme: [
                { id: 401, ime: 'Paint It Black', trajanje: '3:22', godina: 1966, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
                { id: 402, ime: 'Gimme Shelter', trajanje: '4:30', godina: 1969, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' }
            ]
        },
        {
            id: 5,
            naziv: 'Queen',
            zanr: 'Rock',
            pjesme: [
                { id: 501, ime: 'Radio Ga Ga', trajanje: '5:44', godina: 1984, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
                { id: 502, ime: 'Tie your mother down', trajanje: '3:44', godina: 1977, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' }
            ]
        }
    ];

    return (
        <Container className="mt-4 mb-5 pb-5"> {/* Dodan padding na dnu da player ne prekrije sadržaj */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Pregled Izvođača i Glazbe</h1>
                <Button variant="success">Dodaj novog izvođača</Button>
            </div>

            <Accordion defaultActiveKey="0">
                {izvodaci.map((izvodac, index) => (
                    <Accordion.Item eventKey={index.toString()} key={izvodac.id}>
                        <Accordion.Header>
                            <strong>{izvodac.naziv}</strong> &nbsp; | &nbsp; <small className="text-muted">{izvodac.zanr}</small>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5>Popis glazbe:</h5>
                                <Button variant="outline-success" size="sm">+ Dodaj pjesmu</Button>
                            </div>
                            
                            <Table striped bordered hover responsive size="sm">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Ime glazbe</th>
                                        <th>Trajanje</th>
                                        <th>Godina</th>
                                        <th style={{ width: '200px' }}>Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {izvodac.pjesme.map(pjesma => (
                                        <GlazbaRedak 
                                            key={pjesma.id} 
                                            pjesma={pjesma} 
                                            naPlay={(p) => setTrenutnaPjesma(p)} // Prosljeđujemo funkciju u redak
                                        />
                                    ))}
                                </tbody>
                            </Table>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>

            {/* GLAZBENI PLAYER (prikazuje se samo ako je pjesma odabrana) */}
            {trenutnaPjesma && (
                <Card className="fixed-bottom bg-dark text-white p-3 shadow-lg" style={{ borderRadius: '15px 15px 0 0', border: 'none' }}>
                    <Container className="d-flex align-items-center justify-content-between">
                        <div style={{ minWidth: '200px' }}>
                            <small className="text-muted d-block">Trenutno svira:</small>
                            <strong>{trenutnaPjesma.ime}</strong>
                        </div>
                        
                        <div className="flex-grow-1 mx-4">
                            {/* Nativni HTML5 player s kontrolama: volumen, play, progress bar */}
                            <audio 
                                controls 
                                autoPlay 
                                src={trenutnaPjesma.url} 
                                className="w-100"
                                style={{ height: '35px' }}
                            >
                                Vaš preglednik ne podržava audio element.
                            </audio>
                        </div>

                        <Button variant="outline-light" size="sm" onClick={() => setTrenutnaPjesma(null)}>
                            Zatvori
                        </Button>
                    </Container>
                </Card>
            )}
        </Container>
    );
}