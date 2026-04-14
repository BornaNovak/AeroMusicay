import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import AlbumService from "../../services/albumi/AlbumService"
import IzvodacService from "../../services/izvodaci/IzvodacService"
import PjesmaService from "../../services/pjesme/PjesmaService" // Dodano za pametnije brisanje
import useBreakpoint from "../../hooks/useBreakpoint"
import AlbumPregledGrid from "./AlbumPregledGrid"
import AlbumPregledTablica from "./AlbumPregledTablica"

export default function AlbumPregled() {

    const navigate = useNavigate();
    const sirina = useBreakpoint(); // Hook za responzivnost

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
        await AlbumService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati albume');
                return;
            }
            setAlbumi(odgovor.data);
        })
    }

    async function ucitajIzvodace() {
        await IzvodacService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati izvođače');
                return;
            }
            setIzvodaci(odgovor.data);
        })
    }

    // PAMETNIJE BRISANJE (provjera pjesama prije brisanja albuma)
    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati album?')) return;

        // Provjeri postoje li pjesme povezane s ovim albumom
        const pjesmeRezultat = await PjesmaService.get();
        if (pjesmeRezultat.success) {
            const pjesmeNaAlbumu = pjesmeRezultat.data.filter(pjesma => pjesma.album === sifra);

            if (pjesmeNaAlbumu.length > 0) {
                alert(`Ne možete obrisati ovaj album jer sadrži ${pjesmeNaAlbumu.length} pjesama. Prvo obrišite pjesme s ovog albuma.`);
                return;
            }
        }

        // Ako nema pjesama, obriši album
        await AlbumService.obrisi(sifra);
        ucitajAlbume();
    }

    function dohvatiNazivIzvodaca(sifraIzvodaca) {
        const izvodac = izvodaci.find(i => i.sifra == sifraIzvodaca)
        return izvodac ? izvodac.naziv : 'Nepoznat izvođač'
    }

    return (
        <>
            <Link to={RouteNames.ALBUMI_NOVI}
                className="btn btn-success w-100 my-3">
                Dodavanje novog albuma
            </Link>

            {/* Responzivni prikaz: Grid za mobitele/tablete, Tablica za desktop */}
            {['xs', 'sm', 'md'].includes(sirina) ? (
                <AlbumPregledGrid 
                    albumi={albumi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    dohvatiNazivIzvodaca={dohvatiNazivIzvodaca}
                />
            ) : (
                <AlbumPregledTablica
                    albumi={albumi} 
                    navigate={navigate} 
                    brisanje={brisanje} 
                    dohvatiNazivIzvodaca={dohvatiNazivIzvodaca}
                />
            )}
        </>
    )
}