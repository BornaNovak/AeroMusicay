import { Button, Container, Card, Alert, Row, Col } from "react-bootstrap";
import { useState } from "react";
import IzvodacService from "../services/izvodaci/IzvodacService";
import AlbumService from "../services/albumi/AlbumService";
import PjesmaService from "../services/pjesme/PjesmaService";
import ZanrService from "../services/zanrovi/ZanrService"; 
import { DATA_SOURCE, PrefixStorage } from '../constants';

import izvodaciMemorija from '../services/izvodaci/IzvodacPodaci';
import albumiMemorija from '../services/albumi/AlbumPodaci';
import pjesmeMemorija from '../services/pjesme/PjesmaPodaci';
import zanroviMemorija from '../services/zanrovi/ZanrPodaci';

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

    // FUNKCIJA ZA PRESIPIVANJE IZ MEMORIJE U LOCALSTORAGE
    const handleMemorijaULocalStorage = async () => {
        if (!window.confirm('Jeste li sigurni da želite pretočiti iz memorije u localStorage?')) {
            return;
        }

        setUcitavanje(true);
        setStatus({ tip: '', poruka: '' });

        try {
            localStorage.setItem(PrefixStorage.IZVODACI, JSON.stringify(izvodaciMemorija.izvodaci));
            localStorage.setItem(PrefixStorage.ALBUMI, JSON.stringify(albumiMemorija.albumi));
            localStorage.setItem(PrefixStorage.PJESME, JSON.stringify(pjesmeMemorija.pjesme));
            localStorage.setItem(PrefixStorage.ZANROVI, JSON.stringify(zanroviMemorija.zanrovi));

            setStatus({
                tip: 'success',
                poruka: `Uspješno presipano iz memorije u localStorage!`
            });
        } catch (error) {
            setStatus({
                tip: 'danger',
                poruka: 'Greška pri presipavanju: ' + error.message
            });
        } finally {
            setUcitavanje(false);
        }
    };

    async function generiraj() {
        setUcitavanje(true);
        setStatus({ tip: 'info', poruka: 'Generiranje podataka putem servisa...' });

        try {
            const spremljeniZanroviSifre = [];
            const spremljeneIzvodacSifre = [];
            const spremljeneAlbumSifre = [];

            for (let i = 0; i < 20; i++) {
                const naziv = listaZanrova[i % listaZanrova.length]; 
                const rez = await ZanrService.dodaj({ naziv });
                if (rez.success) spremljeniZanroviSifre.push(rez.data.sifra);
            }

            for (let i = 0; i < 60; i++) {
                let naziv, zanrSifra;
                if (i < 3) {
                    naziv = obavezni[i].izvodac;
                    zanrSifra = spremljeniZanroviSifre[i % 2]; 
                } else {
                    naziv = pomocni.izvodaci[i % pomocni.izvodaci.length];
                    zanrSifra = spremljeniZanroviSifre[Math.floor(Math.random() * spremljeniZanroviSifre.length)];
                }
                const rez = await IzvodacService.dodaj({ naziv, dominantniZanr: zanrSifra });
                if (rez.success) spremljeneIzvodacSifre.push(rez.data.sifra);
            }

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
                const rez = await AlbumService.dodaj({ naziv, izvodac: izvodacSifra, datumIzdavanja: datum });
                if (rez.success) spremljeneAlbumSifre.push(rez.data.sifra);
            }

            for (let i = 0; i < 200; i++) {
                let naslov, albumSifra, trajanje;
                if (i < 3) {
                    naslov = obavezni[i].pjesma;
                    albumSifra = spremljeneAlbumSifre[i];
                    trajanje = 240;
                } else {
                    naslov = pomocni.pjesme[i % pomocni.pjesme.length];
                    albumSifra = spremljeneAlbumSifre[Math.floor(Math.random() * spremljeneAlbumSifre.length)];
                    trajanje = Math.floor(Math.random() * 181) + 120;
                }

                const brojZanrova = Math.floor(Math.random() * 2) + 2; 
                const odabraniZanroviSet = new Set();
                while(odabraniZanroviSet.size < brojZanrova && spremljeniZanroviSifre.length > 0) {
                    odabraniZanroviSet.add(spremljeniZanroviSifre[Math.floor(Math.random() * spremljeniZanroviSifre.length)]);
                }

                await PjesmaService.dodaj({
                    naziv: naslov,
                    trajanje: trajanje,
                    album: albumSifra,
                    zanr: Array.from(odabraniZanroviSet)
                });
            }

            setStatus({ tip: 'success', poruka: 'Uspješno generirano sve!' });
        } catch (error) {
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
                    <Card.Title className="mb-4">Upravljanje Podacima</Card.Title>
                    
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
                        className="px-5 shadow mb-4"
                    >
                        {ucitavanje ? 'Generiranje...' : 'Pokreni Generator'}
                    </Button>

                    {DATA_SOURCE !== 'memorija' && (
                        <div className="mt-5">
                            <hr />
                            <h4 className="my-4 text-muted">Pretakanje podataka</h4>
                            <Row className="justify-content-center">
                                <Col md={6}>
                                    <Button
                                        variant="outline-success"
                                        onClick={handleMemorijaULocalStorage}
                                        disabled={ucitavanje}
                                        className="w-100 py-3"
                                    >
                                        {ucitavanje ? 'Presipavanje...' : 'Iz memorije u localStorage'}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}