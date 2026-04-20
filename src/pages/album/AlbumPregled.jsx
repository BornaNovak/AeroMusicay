import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import AlbumService from "../../services/albumi/AlbumService"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import PjesmaService from "../../services/pjesme/PjesmaService"
import useBreakpoint from "../../hooks/useBreakpoint"
import AlbumPregledGrid from "./AlbumPregledGrid"
import AlbumPregledTablica from "./AlbumPregledTablica"
import AlbumPDFGenerator from "../../components/AlbumPDFGenerator" 
import { Pagination, Container } from "react-bootstrap" // Dodan Pagination i Container

export default function AlbumPregled() {

    const navigate = useNavigate();
    const sirina = useBreakpoint();

    const [albumi, setAlbumi] = useState([])
    const [izvodaci, setIzvodaci] = useState([])

    // NOVO: State za straničenje
    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);

    // useEffect prati promjenu stranice
    useEffect(() => {
        ucitajPodatke();
    }, [stranica])

    async function ucitajPodatke() {
        await ucitajIzvodace();
        await ucitajAlbume();
    }

    async function ucitajAlbume() {
        // Koristimo getPage umjesto get
        const odgovor = await AlbumService.getPage(stranica, 8);
        if (!odgovor.success) {
            alert('Nije moguće učitati albume');
            return;
        }
        setAlbumi(odgovor.data);
        setUkupnoStranica(odgovor.totalPages); // Spremamo info o ukupno stranica
    }

    async function ucitajIzvodace() {
        const odgovor = await IzvodacService.get();
        if (!odgovor.success) {
            alert('Nije moguće učitati izvođače');
            return;
        }
        setIzvodaci(odgovor.data);
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati album?')) return;

        const pjesmeRezultat = await PjesmaService.get();
        if (pjesmeRezultat.success) {
            const pjesmeNaAlbumu = pjesmeRezultat.data.filter(pjesma => pjesma.album === sifra);

            if (pjesmeNaAlbumu.length > 0) {
                alert(`Ne možete obrisati ovaj album jer sadrži ${pjesmeNaAlbumu.length} pjesama. Prvo obrišite pjesme s ovog albuma.`);
                return;
            }
        }

        const odgovor = await AlbumService.obrisi(sifra);
        if (odgovor && odgovor.success === false) {
             alert('Greška pri brisanju');
        }
        ucitajAlbume();
    }

    function dohvatiNazivIzvodaca(sifraIzvodaca) {
        const s = Array.isArray(sifraIzvodaca) ? sifraIzvodaca[0] : sifraIzvodaca;
        const izvodac = izvodaci.find(i => i.sifra == s)
        return izvodac ? izvodac.naziv : 'Nepoznat izvođač'
    }

    async function generirajPDFZaAlbum(album) {
        const s = Array.isArray(album.izvodac) ? album.izvodac[0] : album.izvodac;
        const izvodac = izvodaci.find(i => i.sifra == s);
        
        if (!izvodac) {
            alert('Izvođač nije pronađen');
            return;
        }

        const odgovorPjesme = await PjesmaService.get();
        if (!odgovorPjesme.success) {
            alert('Nije moguće dohvatiti pjesme');
            return;
        }

        const pjesmeAlbuma = odgovorPjesme.data.filter(p => p.album === album.sifra);

        const generiraj = AlbumPDFGenerator({ 
            album, 
            izvodac, 
            pjesme: pjesmeAlbuma 
        });
        await generiraj();
    }

    // Generiranje elemenata straničenja
    let items = [];
    for (let number = 1; number <= ukupnoStranica; number++) {
        items.push(
            <Pagination.Item 
                key={number} 
                active={number === stranica} 
                onClick={() => setStranica(number)}
            >
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <Container>
            <Link to={RouteNames.ALBUMI_NOVI}
                className="btn btn-success w-100 my-3">
                Dodavanje novog albuma
            </Link>

            {/* Responzivni prikaz */}
            {['xs', 'sm', 'md'].includes(sirina) ? (
                <AlbumPregledGrid 
                    albumi={albumi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    dohvatiNazivIzvodaca={dohvatiNazivIzvodaca}
                    generirajPDF={generirajPDFZaAlbum} 
                />
            ) : (
                <AlbumPregledTablica
                    albumi={albumi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    dohvatiNazivIzvodaca={dohvatiNazivIzvodaca}
                    generirajPDF={generirajPDFZaAlbum} 
                />
            )}

            {/* Prikaz navigacije na dnu */}
            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination>{items}</Pagination>
                </div>
            )}
        </Container>
    )
}