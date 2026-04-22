import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import AlbumService from "../../services/albumi/AlbumService"
import PjesmaService from "../../services/pjesme/PjesmaService"
import IzvodacService from "../../services/izvodaci/IzvodacService" // DODANO
import useBreakpoint from "../../hooks/useBreakpoint"
import AlbumPregledGrid from "./AlbumPregledGrid"
import AlbumPregledTablica from "./AlbumPregledTablica"
import AlbumPDFGenerator from "../../components/AlbumPDFGenerator" 
import { Pagination, Container } from "react-bootstrap"

export default function AlbumPregled() {

    const navigate = useNavigate();
    const sirina = useBreakpoint();

    const [albumi, setAlbumi] = useState([])
    const [izvodaci, setIzvodaci] = useState([]); // DODANO: State za izvođače

    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);

    const [sortiranje, setSortiranje] = useState({ stupac: 'naziv', smjer: 'asc' });

    useEffect(() => {
        ucitajPodatke();
    }, [stranica, sortiranje])

    async function ucitajPodatke() {
        // Prvo dohvaćamo izvođače kako bi ih imali spremne za prikaz u tablici
        await ucitajIzvodace();
        await ucitajAlbume();
    }

    async function ucitajIzvodace() {
        const odgovor = await IzvodacService.get();
        if (odgovor.success) {
            setIzvodaci(odgovor.data);
        }
    }

    async function ucitajAlbume() {
        const odgovor = await AlbumService.getPage(stranica, 8, sortiranje.stupac, sortiranje.smjer);
        if (!odgovor.success) {
            alert('Nije moguće učitati albume');
            return;
        }
        setAlbumi(odgovor.data);
        setUkupnoStranica(odgovor.totalPages);
    }

    // DODANO: Funkcija koja pretvara šifru izvođača u njegovo ime
    const dohvatiNazivIzvodaca = (sifra) => {
        // LocalStorage nekad sprema kao [1] umjesto 1, pa čistimo ID
        const id = Array.isArray(sifra) ? sifra[0] : sifra;
        const izvodac = izvodaci.find(i => i.sifra == id);
        return izvodac ? izvodac.naziv : 'Nepoznato';
    };

    function promjeniSortiranje(noviStupac) {
        setSortiranje(prev => ({
            stupac: noviStupac,
            smjer: prev.stupac === noviStupac && prev.smjer === 'asc' ? 'desc' : 'asc'
        }));
        setStranica(1); 
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

            {['xs', 'sm', 'md'].includes(sirina) ? (
                <AlbumPregledGrid 
                    albumi={albumi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    generirajPDF={generirajPDFZaAlbum} 
                />
            ) : (
                <AlbumPregledTablica
                    albumi={albumi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    generirajPDF={generirajPDFZaAlbum}
                    sortConfig={sortiranje}
                    onSort={promjeniSortiranje}
                    dohvatiNazivIzvodaca={dohvatiNazivIzvodaca} // DODANO
                />
            )}

            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination>{items}</Pagination>
                </div>
            )}
        </Container>
    )
}