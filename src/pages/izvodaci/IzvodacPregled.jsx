import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RouteNames } from '../../constants'
import IzvodacService from '../../services/izvodaci/IzvodacService'
import AlbumService from '../../services/albumi/AlbumService'
import useBreakpoint from "../../hooks/useBreakpoint"
import IzvodacPregledGrid from "./IzvodacPregledGrid"
import IzvodacPregledTablica from "./IzvodacPregledTablica"
import ZanrService from '../../services/zanrovi/ZanrService'
import { Pagination, Container } from "react-bootstrap"

export default function IzvodacPregled() {
    const [izvodaci, setIzvodaci] = useState([])
    const [zanrovi, setZanrovi] = useState([]) 
    
    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);

    const navigate = useNavigate();
    const sirina = useBreakpoint();

    useEffect(() => {
        ucitajPodatke()
    }, [stranica])

    async function ucitajPodatke() {
        const resZanrovi = await ZanrService.get();
        if (resZanrovi.success) setZanrovi(resZanrovi.data);

        const resIzvodaci = await IzvodacService.getPage(stranica, 8);
        if (resIzvodaci.success) {
            setIzvodaci(resIzvodaci.data);
            setUkupnoStranica(resIzvodaci.totalPages);
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

    // --- POPRAVLJENA DINAMIČKA LOGIKA PAGINACIJE ---
    let items = [];
    
    // Određujemo centralnih 5 stranica
    let startPage = Math.max(1, stranica - 2);
    let endPage = Math.min(ukupnoStranica, startPage + 4);

    // Balansiranje ako smo blizu kraja
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // 1. LIJEVI DINAMIČKI RASPON
    if (startPage > 1) {
        const rangeText = startPage - 1 === 1 ? "1" : `1-${startPage - 1}`;
        items.push(
            <Pagination.Item key="left-range" onClick={() => setStranica(1)}>
                {rangeText}
            </Pagination.Item>
        );
    }

    // 2. CENTRALNI BLOK
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

    // 3. DESNI DINAMIČKI RASPON
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

            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center my-4">
                    <Pagination>
                        <Pagination.Prev 
                            disabled={stranica === 1} 
                            onClick={() => setStranica(stranica - 1)}
                        >
                            «
                        </Pagination.Prev>

                        {items}

                        <Pagination.Next 
                            disabled={stranica === ukupnoStranica} 
                            onClick={() => setStranica(stranica + 1)}
                        >
                            »
                        </Pagination.Next>
                    </Pagination>
                </div>
            )}
        </Container>
    )
}