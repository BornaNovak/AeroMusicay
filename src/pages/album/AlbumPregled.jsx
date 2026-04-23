import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import AlbumService from "../../services/albumi/AlbumService"
import PjesmaService from "../../services/pjesme/PjesmaService"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import useBreakpoint from "../../hooks/useBreakpoint"
import AlbumPregledGrid from "./AlbumPregledGrid"
import AlbumPregledTablica from "./AlbumPregledTablica"
import AlbumPDFGenerator from "../../components/AlbumPDFGenerator" 
import { Pagination, Container } from "react-bootstrap"

export default function AlbumPregled() {

    const navigate = useNavigate();
    const sirina = useBreakpoint();

    const [albumi, setAlbumi] = useState([])
    const [izvodaci, setIzvodaci] = useState([]); 

    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);

    const [sortiranje, setSortiranje] = useState({ stupac: 'naziv', smjer: 'asc' });

    useEffect(() => {
        ucitajPodatke();
    }, [stranica, sortiranje])

    async function ucitajPodatke() {
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

    const dohvatiNazivIzvodaca = (sifra) => {
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

    // --- POPRAVLJENA DINAMIČKA LOGIKA PAGINACIJE ---
    let items = [];
    
    // Određujemo granice središnjih 5 brojeva
    let startPage = Math.max(1, stranica - 2);
    let endPage = Math.min(ukupnoStranica, startPage + 4);

    // Ako smo blizu kraja, povlačimo početak unazad da uvijek imamo do 5 brojeva
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // 1. LIJEVI RASPON: Ako startPage nije 1, prikaži gumb od 1 do (startPage - 1)
    if (startPage > 1) {
        const rangeText = startPage - 1 === 1 ? "1" : `1-${startPage - 1}`;
        items.push(
            <Pagination.Item key="left-range" onClick={() => setStranica(1)}>
                {rangeText}
            </Pagination.Item>
        );
    }

    // 2. SREDIŠNJI BROJEVI
    for (let number = startPage; number <= endPage; number++) {
        items.push(
            <Pagination.Item 
                key={number} 
                active={number === stranica} 
                onClick={() => setStranica(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    // 3. DESNI RASPON: Ako endPage nije zadnja stranica, prikaži od (endPage + 1) do ukupno
    if (endPage < ukupnoStranica) {
        const rangeText = endPage + 1 === ukupnoStranica ? `${ukupnoStranica}` : `${endPage + 1}-${ukupnoStranica}`;
        items.push(
            <Pagination.Item key="right-range" onClick={() => setStranica(ukupnoStranica)}>
                {rangeText}
            </Pagination.Item>
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
                    dohvatiNazivIzvodaca={dohvatiNazivIzvodaca}
                />
            ) : (
                <AlbumPregledTablica
                    albumi={albumi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    generirajPDF={generirajPDFZaAlbum}
                    sortConfig={sortiranje}
                    onSort={promjeniSortiranje}
                    dohvatiNazivIzvodaca={dohvatiNazivIzvodaca}
                />
            )}

            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination>
                        <Pagination.Prev 
                            disabled={stranica === 1} 
                            onClick={() => setStranica(stranica - 1)}
                        >
                            « PREVIOUS
                        </Pagination.Prev>

                        {items}

                        <Pagination.Next 
                            disabled={stranica === ukupnoStranica} 
                            onClick={() => setStranica(stranica + 1)}
                        >
                            NEXT »
                        </Pagination.Next>
                    </Pagination>
                </div>
            )}
        </Container>
    )
}