import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RouteNames } from '../../constants'
import IzvodacService from '../../services/izvodaci/IzvodacService'
import AlbumService from '../../services/albumi/AlbumService'
import useBreakpoint from "../../hooks/useBreakpoint"
import IzvodacPregledGrid from "./IzvodacPregledGrid"
import IzvodacPregledTablica from "./IzvodacPregledTablica"
import ZanrService from '../../services/zanrovi/ZanrService'

export default function IzvodacPregled() {
    const [izvodaci, setIzvodaci] = useState([])
    const [zanrovi, setZanrovi] = useState([]) // 2. State za žanrove
    const navigate = useNavigate();
    const sirina = useBreakpoint();

    useEffect(() => {
        ucitajPodatke()
    }, [])

    async function ucitajPodatke() {
        // 3. Učitavamo paralelno izvođače i žanrove
        const resZanrovi = await ZanrService.get();
        if (resZanrovi.success) setZanrovi(resZanrovi.data);

        const resIzvodaci = await IzvodacService.get();
        if (resIzvodaci.success) {
            setIzvodaci(resIzvodaci.data);
        } else {
            alert('Nije moguće učitati izvođače');
        }
    }

    // 4. Pomoćna funkcija koju šaljemo u Grid i Tablicu
    const dohvatiNazivZanra = (sifraZanra) => {
        if (!sifraZanra) return 'Nema žanra';
        const zanr = zanrovi.find(z => z.sifra == sifraZanra);
        return zanr ? zanr.naziv : 'Nepoznat žanr';
    }

    async function brisanje(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati izvođača?')) return;

        const albumiRezultat = await AlbumService.get();
        if (albumiRezultat.success) {
            const povezaniAlbumi = albumiRezultat.data.filter(album => 
                Array.isArray(album.izvodac) 
                ? album.izvodac.includes(sifra) 
                : album.izvodac == sifra
            );

            if (povezaniAlbumi.length > 0) {
                alert(`Ne možete obrisati ovog izvođača jer je povezan s ${povezaniAlbumi.length} albuma.`);
                return;
            }
        }

        // rjesenja a
        // await IzvodacService.obrisi(sifra).then(()=>{
        //     ucitajPodatke(); // Ponovno učitaj sve
        // });

        const odgovor = await IzvodacService.obrisi(sifra);
        if (odgovor.success) {
            ucitajPodatke(); // Ponovno učitaj sve
        }
    }

    return (
        <>
            <Link to={RouteNames.IZVODACI_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje novog izvođača
            </Link>

            {['xs', 'sm', 'md'].includes(sirina) ? (
                <IzvodacPregledGrid 
                    izvodaci={izvodaci} 
                    navigate={navigate} 
                    brisanje={brisanje}
                    dohvatiNazivZanra={dohvatiNazivZanra} // 5. Proslijedi funkciju
                />
            ) : (
                <IzvodacPregledTablica
                    izvodaci={izvodaci} 
                    navigate={navigate} 
                    brisanje={brisanje}
                    dohvatiNazivZanra={dohvatiNazivZanra} // 5. Proslijedi funkciju
                />
            )}
        </>
    )
}