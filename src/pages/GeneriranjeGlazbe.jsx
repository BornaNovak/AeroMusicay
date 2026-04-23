import { Button, Container, Card, Alert } from "react-bootstrap";
import { useState } from "react";
// PUTANJE ISPRAVLJENE PREMA TVOJOJ SLICI:
import IzvodacService from "../services/izvodaci/IzvodacService";
import AlbumService from "../services/albumi/AlbumService";
import PjesmaService from "../services/pjesme/PjesmaService";
import ZanrService from "../services/zanrovi/ZanrService"; 

export default function GeneriranjeGlazbe() {
    const [status, setStatus] = useState({ tip: '', poruka: '' });
    const [ucitavanje, setUcitavanje] = useState(false);

    const baze = {
        izvodaci: ["Metallica", "The Doors", "Pink Floyd", "Deep Purple", "Nirvana", "Daft Punk", "Arctic Monkeys", "The Rolling Stones"],
        zanrovi: ["Rock", "Metal", "Electronic", "Grunge", "Jazz", "Blues", "Pop", "Psychedelic Rock"],
        albumi: ["Greatest Hits", "Live in Zagreb", "Discovery", "Evolution", "Abstract Mind", "Unplugged", "After Hours"],
        pjesme: ["Intro", "Midnight Sky", "Desert Rose", "Electric Dreams", "Final Countdown", "The End", "Shadows", "Neon Lights"]
    };

    async function generiraj() {
        setUcitavanje(true);
        setStatus({ tip: 'info', poruka: 'Generiranje podataka u tijeku...' });

        try {
            // 1. PRVO GENERIRAJ ŽANR (ako tvoj sustav to zahtijeva kao šifru)
            const nasumicniZanr = baze.zanrovi[Math.floor(Math.random() * baze.zanrovi.length)];
            const rezZanr = await ZanrService.dodaj({ naziv: nasumicniZanr });
            const zanrSifra = rezZanr.success ? rezZanr.data.sifra : null;

            // 2. GENERIRAJ IZVOĐAČA
            const nasumicniIzvodac = baze.izvodaci[Math.floor(Math.random() * baze.izvodaci.length)];
            const rezIzvodac = await IzvodacService.dodaj({
                naziv: nasumicniIzvodac,
                zanr: zanrSifra // Povezujemo s netom kreiranim žanrom
            });

            if (rezIzvodac.success) {
                const noviIzvodacSifra = rezIzvodac.data.sifra;

                // 3. GENERIRAJ ALBUM
                const nasumicniAlbum = baze.albumi[Math.floor(Math.random() * baze.albumi.length)];
                const rezAlbum = await AlbumService.dodaj({
                    naziv: `${nasumicniIzvodac} - ${nasumicniAlbum}`,
                    izvodac: noviIzvodacSifra,
                    datumIzdavanja: new Date().toISOString().split('T')[0]
                });

                if (rezAlbum.success) {
                    const noviAlbumSifra = rezAlbum.data.sifra;

                    // 4. GENERIRAJ 3 PJESME
                    for (let i = 1; i <= 3; i++) {
                        await PjesmaService.dodaj({
                            naslov: `${baze.pjesme[Math.floor(Math.random() * baze.pjesme.length)]} (Track ${i})`,
                            trajanje: Math.floor(Math.random() * (300 - 120 + 1) + 120),
                            album: noviAlbumSifra
                        });
                    }
                }
            }

            setStatus({ tip: 'success', poruka: 'Uspješno generiran set: Žanr -> Izvođač -> Album -> 3 Pjesme!' });
        } catch (error) {
            console.error(error);
            setStatus({ tip: 'danger', poruka: 'Greška pri komunikaciji sa servisima.' });
        } finally {
            setUcitavanje(false);
        }
    }

    return (
        <Container className="mt-4">
            <Card className="text-center shadow-lg border-0">
                <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">Generator Glazbe</h3>
                </Card.Header>
                <Card.Body className="py-5">
                    <Card.Title className="mb-4">Potrebni su vam testni podaci, a neda Vam se unositi?</Card.Title>
                    <Card.Text className="text-muted mb-4">
                        Ovaj alat će automatski kreirati glazbu u vašem LocalStorageu.
                    </Card.Text>
                    
                    {status.poruka && (
                        <Alert variant={status.tip} className="mb-4">
                            {status.poruka}
                        </Alert>
                    )}

                    <Button 
                        variant="success" 
                        onClick={generiraj} 
                        disabled={ucitavanje}
                        size="lg"
                        className="px-5 shadow"
                    >
                        {ucitavanje ? 'Generiranje...' : 'Pokreni Generator'}
                    </Button>
                </Card.Body>
                <Card.Footer className="text-muted small">
                    Putanja: src/pages/GeneriranjeGlazbe.jsx
                </Card.Footer>
            </Card>
        </Container>
    );
}