import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RouteNames } from '../../constants'
import IzvodacService from '../../services/izvodaci/IzvodacService'
import AlbumService from '../../services/albumi/AlbumService'
import useBreakpoint from "../../hooks/useBreakpoint"
import IzvodacPregledGrid from "./IzvodacPregledGrid"
import IzvodacPregledTablica from "./IzvodacPregledTablica"
import ZanrService from '../../services/zanrovi/ZanrService'
import { Pagination, Container } from "react-bootstrap" // Dodan Pagination i Container

export default function IzvodacPregled() {
    const [izvodaci, setIzvodaci] = useState([])
    const [zanrovi, setZanrovi] = useState([]) 
    
    // NOVO: State za straničenje
    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);

    const navigate = useNavigate();
    const sirina = useBreakpoint();

    // useEffect sada prati promjenu stranice
    useEffect(() => {
        ucitajPodatke()
    }, [stranica])

    async function ucitajPodatke() {
        // 1. Učitavamo žanrove (trebaju nam svi za lookup naziva)
        const resZanrovi = await ZanrService.get();
        if (resZanrovi.success) setZanrovi(resZanrovi.data);

        // 2. Pozivamo getPage umjesto get za izvođače
        const resIzvodaci = await IzvodacService.getPage(stranica, 8);
        if (resIzvodaci.success) {
            setIzvodaci(resIzvodaci.data);
            setUkupnoStranica(resIzvodaci.totalPages); // Spremamo broj stranica
        } else {
            alert('Nije moguće učitati izvođače');
        }
    }

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

        const odgovor = await IzvodacService.obrisi(sifra);
        if (odgovor.success) {
            ucitajPodatke(); 
        }
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
            <Link to={RouteNames.IZVODACI_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje novog izvođača
            </Link>

            {['xs', 'sm', 'md'].includes(sirina) ? (
                <IzvodacPregledGrid 
                    izvodaci={izvodaci} 
                    navigate={navigate} 
                    brisanje={brisanje}
                    dohvatiNazivZanra={dohvatiNazivZanra} 
                />
            ) : (
                <IzvodacPregledTablica
                    izvodaci={izvodaci} 
                    navigate={navigate} 
                    brisanje={brisanje}
                    dohvatiNazivZanra={dohvatiNazivZanra} 
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