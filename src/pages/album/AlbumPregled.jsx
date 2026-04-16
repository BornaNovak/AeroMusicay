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

export default function AlbumPregled() {

    const navigate = useNavigate();
    const sirina = useBreakpoint();

    const [albumi, setAlbumi] = useState([])
    const [izvodaci, setIzvodaci] = useState([])

    useEffect(() => {
        ucitajPodatke();
    }, [])

    async function ucitajPodatke() {
        await ucitajIzvodace();
        await ucitajAlbume();
    }

    async function ucitajAlbume() {
        const odgovor = await AlbumService.get();
        if (!odgovor.success) {
            alert('Nije moguće učitati albume');
            return;
        }
        setAlbumi(odgovor.data);
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
        // Provjera ako servis vraća success, ako ne, samo osvježi
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
        // 1. Pronađi izvođača
        const s = Array.isArray(album.izvodac) ? album.izvodac[0] : album.izvodac;
        const izvodac = izvodaci.find(i => i.sifra == s);
        
        if (!izvodac) {
            alert('Izvođač nije pronađen');
            return;
        }

        // 2. Dohvati pjesme i filtriraj
        const odgovorPjesme = await PjesmaService.get();
        if (!odgovorPjesme.success) {
            alert('Nije moguće dohvatiti pjesme');
            return;
        }

        const pjesmeAlbuma = odgovorPjesme.data.filter(p => p.album === album.sifra);

        // 3. Pokreni generator
        const generiraj = AlbumPDFGenerator({ 
            album, 
            izvodac, 
            pjesme: pjesmeAlbuma 
        });
        await generiraj();
    }

    return (
        <>
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
        </>
    )
}