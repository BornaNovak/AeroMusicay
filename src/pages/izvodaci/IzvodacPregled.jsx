import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RouteNames } from '../../constants'
import IzvodacService from '../../services/izvodaci/IzvodacService'
import AlbumService from '../../services/albumi/AlbumService'
import useBreakpoint from "../../hooks/useBreakpoint"
import IzvodacPregledGrid from "./IzvodacPregledGrid"
import IzvodacPregledTablica from "./IzvodacPregledTablica"

export default function IzvodacPregled() {
    const [izvodaci, setIzvodaci] = useState([])
    const navigate = useNavigate();
    const sirina = useBreakpoint();

    useEffect(() => {
        ucitajIzvodace()
    }, [])

    async function ucitajIzvodace() {
        await IzvodacService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije moguće učitati izvođače')
                return
            }
            setIzvodaci(odgovor.data)
        })
    }

    // PAMETNIJE BRISANJE
    async function brisanje(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati izvođača?')) {
            return
        }

        // Provjera jesu li albumi vezani za ovog izvođača
        const albumiRezultat = await AlbumService.get();
        if (albumiRezultat.success) {
            // Filtriramo albume koji u svom nizu izvođača imaju ovu šifru
            const povezaniAlbumi = albumiRezultat.data.filter(album => 
                Array.isArray(album.izvodac) 
                ? album.izvodac.includes(sifra) 
                : album.izvodac == sifra
            );

            if (povezaniAlbumi.length > 0) {
                alert(`Ne možete obrisati ovog izvođača jer je povezan s ${povezaniAlbumi.length} albuma. Prvo uklonite izvođača iz tih albuma.`);
                return;
            }
        }

        const odgovor = await IzvodacService.obrisi(sifra);
        if (odgovor.success) {
            ucitajIzvodace();
        }
    }

    return (
        <>
            <Link to={RouteNames.IZVODACI_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje novog izvođača
            </Link>

            {/* Logika za promjenu prikaza ovisno o širini ekrana */}
            {['xs', 'sm', 'md'].includes(sirina) ? (
                <IzvodacPregledGrid 
                    izvodaci={izvodaci} 
                    navigate={navigate} 
                    brisanje={brisanje}
                />
            ) : (
                <IzvodacPregledTablica
                    izvodaci={izvodaci} 
                    navigate={navigate} 
                    brisanje={brisanje}
                />
            )}
        </>
    )
}