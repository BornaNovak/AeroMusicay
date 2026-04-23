import { Button, Container, Card, Alert } from "react-bootstrap";
import { useState } from "react";
import IzvodacService from "../services/izvodaci/IzvodacService";
import AlbumService from "../services/albumi/AlbumService";
import PjesmaService from "../services/pjesme/PjesmaService";
import ZanrService from "../services/zanrovi/ZanrService"; 

export default function GeneriranjeGlazbe() {
    const [status, setStatus] = useState({ tip: '', poruka: '' });
    const [ucitavanje, setUcitavanje] = useState(false);

    const obavezni = [
        { izvodac: "Deep Purple", zanr: "Rock", album: "Perfect Strangers", datum: "1984-02-11", pjesma: "Perfect Strangers" },
        { izvodac: "Ritchie Blackmore's Rainbow", zanr: "Rock", album: "Long Live Rock 'n' Roll", datum: "1978-04-09", pjesma: "Long Live Rock 'n' Roll" },
        { izvodac: "Iron Maiden", zanr: "Metal", album: "The Number of the Beast", datum: "1982-03-22", pjesma: "Run to the Hills" }
    ];

    const listaZanrova = [
        "Rock", "Metal", "Jazz", "Blues", "Pop", "Electronic", "Grunge", "Punk", "Classical", "Folk", 
        "Country", "Techno", "Disco", "Soul", "R&B", "Funk", "Reggae", "Trap", "Indie", "Psychedelic"
    ];

    const pomocni = {
        izvodaci: ["Metallica", "The Doors", "Pink Floyd", "Nirvana", "Daft Punk", "Arctic Monkeys", "The Rolling Stones", "Led Zeppelin", "Queen", "AC/DC"],
        albumi: ["Greatest Hits", "Live in Zagreb", "Discovery", "Evolution", "Abstract Mind", "Unplugged", "After Hours", "Legacy"],
        pjesme: ["Intro", "Midnight Sky", "Desert Rose", "Electric Dreams", "Final Countdown", "The End", "Shadows", "Neon Lights", "The Wall"]
    };

    async function generiraj() {
        setUcitavanje(true);
        setStatus({ tip: 'info', poruka: 'Generiranje 20 žanrova, 60 izvođača, 80 albuma i 200 pjesama...' });

        try {
            const spremljeniZanroviSifre = [];
            const spremljeneIzvodacSifre = [];
            const spremljeneAlbumSifre = [];

            // 1. GENERIRAJ 20 ŽANROVA
            for (let i = 0; i < 20; i++) {
                const naziv = listaZanrova[i % listaZanrova.length]; 
                const rez = await ZanrService.dodaj({ naziv });
                if (rez.success) {
                    spremljeniZanroviSifre.push(rez.data.sifra);
                }
            }

            // 2. GENERIRAJ 60 IZVOĐAČA
            for (let i = 0; i < 60; i++) {
                let naziv, zanrSifra;
                if (i < 3) {
                    naziv = obavezni[i].izvodac;
                    // Pridruži Rock ili Metal (prva dva žanra)
                    zanrSifra = spremljeniZanroviSifre[i % 2]; 
                } else {
                    naziv = pomocni.izvodaci[i % pomocni.izvodaci.length];
                    zanrSifra = spremljeniZanroviSifre[Math.floor(Math.random() * spremljeniZanroviSifre.length)];
                }

                const rez = await IzvodacService.dodaj({ 
                    naziv: naziv, 
                    dominantniZanr: zanrSifra 
                });
                
                if (rez.success) spremljeneIzvodacSifre.push(rez.data.sifra);
            }

            // 3. GENERIRAJ 80 ALBUMA
            for (let i = 0; i < 80; i++) {
                let naziv, izvodacSifra, datum;
                if (i < 3) {
                    naziv = obavezni[i].album;
                    izvodacSifra = spremljeneIzvodacSifre[i];
                    datum = obavezni[i].datum;
                } else {
                    naziv = pomocni.albumi[i % pomocni.albumi.length];
                    izvodacSifra = spremljeneIzvodacSifre[Math.floor(Math.random() * spremljeneIzvodacSifre.length)];
                    datum = "2024-01-01";
                }
                const rez = await AlbumService.dodaj({ 
                    naziv: naziv, 
                    izvodac: izvodacSifra, 
                    datumIzdavanja: datum 
                });
                if (rez.success) spremljeneAlbumSifre.push(rez.data.sifra);
            }

            // 4. GENERIRAJ 200 PJESAMA
            for (let i = 0; i < 200; i++) {
                let naslov, albumSifra;
                if (i < 3) {
                    naslov = obavezni[i].pjesma;
                    albumSifra = spremljeneAlbumSifre[i];
                } else {
                    naslov = pomocni.pjesme[i % pomocni.pjesme.length];
                    albumSifra = spremljeneAlbumSifre[Math.floor(Math.random() * spremljeneAlbumSifre.length)];
                }

                // LOGIKA ZA SLUČAJNE ŽANROVE (2-3 unikatna žanra po pjesmi)
                const brojZanrova = Math.floor(Math.random() * 2) + 2; 
                const odabraniZanroviSet = new Set();

                while(odabraniZanroviSet.size < brojZanrova && spremljeniZanroviSifre.length > 0) {
                    const slucajniIndeks = Math.floor(Math.random() * spremljeniZanroviSifre.length);
                    odabraniZanroviSet.add(spremljeniZanroviSifre[slucajniIndeks]);
                }
                
                const slucajniZanrovi = Array.from(odabraniZanroviSet);

                await PjesmaService.dodaj({
                    naziv: naslov,
                    trajanje: Math.floor(Math.random() * 180) + 120,
                    album: albumSifra,
                    zanr: slucajniZanrovi, // Niz npr. [102, 105]
                    slika: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
                });
            }

            setStatus({ tip: 'success', poruka: 'Uspješno generirano! Žanrovi su ispravno dodijeljeni pjesmama.' });
        } catch (error) {
            console.error(error);
            setStatus({ tip: 'danger', poruka: 'Greška pri generiranju.' });
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
                    <Card.Title className="mb-4">Želite generirati glazbu jer Vam se ne da kucati?</Card.Title>
                    <Card.Text className="text-muted mb-4">
                        Ovaj alat će kreirati podatke i <strong>sam ih staviti na odgovarajuće mjesto umjesto Vas</strong> kako ne biste morali ručno unositi.
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
                        {ucitavanje ? 'Povezivanje podataka...' : 'Pokreni Generator'}
                    </Button>
                </Card.Body>
                <Card.Footer className="text-muted small">
                    Putanja: src/pages/GeneriranjeGlazbe.jsx
                </Card.Footer>
            </Card>
        </Container>
    );
}