import { useEffect, useState } from 'react'
import PjesmaService from '../../services/pjesme/PjesmaService'
import AlbumService from '../../services/albumi/AlbumService'
import ZanrService from '../../services/zanrovi/ZanrService'
import { formatirajTrajanje } from '../../utils'
import { Button, Table, Container, Pagination } from 'react-bootstrap'
import { RouteNames } from '../../constants'
import { Link, useNavigate } from 'react-router-dom'
import useBreakpoint from '../../hooks/useBreakpoint'
import PjesmaPregledGrid from './PjesmaPregledGrid'
import PjesmaPregledTablica from './PjesmaPregledTablica'


export default function PjesmaPregled() {
    const [pjesme, setPjesme] = useState([])
    const [albumi, setAlbumi] = useState([])
    const [zanrovi, setZanrovi] = useState([])

    // State za straničenje
    const [stranica, setStranica] = useState(1);
    const [ukupnoStranica, setUkupnoStranica] = useState(0);

    const navigate = useNavigate();

    const sirina = useBreakpoint();

    // useEffect prati promjenu 'stranica'
    useEffect(() => {
        ucitajPodatke()
    }, [stranica])

    async function ucitajPodatke() {
        const resPjesme = await PjesmaService.getPage(stranica, 8);
        const resAlbumi = await AlbumService.get();
        const resZanrovi = await ZanrService.get();

        if (resPjesme.success) {
            setPjesme(resPjesme.data);
            setUkupnoStranica(resPjesme.totalPages);
        }
        if (resAlbumi.success) setAlbumi(resAlbumi.data);
        if (resZanrovi.success) setZanrovi(resZanrovi.data);
    }

    async function obrisi(sifra) {
        if (!confirm('Jeste li sigurni da želite obrisati?')) return;
        await PjesmaService.obrisi(sifra);
        ucitajPodatke();
    }

    const dohvatiNazivAlbuma = (sifraAlbuma) => {
        const album = albumi.find(a => a.sifra === parseInt(sifraAlbuma))
        return album ? album.naziv : 'Nepoznat album'
    }

    const dohvatiNaziveZanrova = (pjesmaZanrovi) => {
        if (!pjesmaZanrovi || pjesmaZanrovi.length === 0) return 'Nema žanra';
        if (Array.isArray(pjesmaZanrovi)) {
            return pjesmaZanrovi
                .map(sifra => {
                    const z = zanrovi.find(g => g.sifra === sifra);
                    return z ? z.naziv : null;
                })
                .filter(n => n !== null)
                .join(', ');
        }
        const zanr = zanrovi.find(z => z.sifra === parseInt(pjesmaZanrovi));
        return zanr ? zanr.naziv : 'Nepoznat žanr';
    }

    // --- NOVA DINAMIČKA LOGIKA PAGINACIJE ---
    let items = [];

    // Definiramo granice centralnog bloka
    let startPage = Math.max(1, stranica - 2);
    let endPage = Math.min(ukupnoStranica, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // 1. LIJEVI RASPON: Dinamički prikazuje od 1 do (startPage - 1)
    if (startPage > 1) {
        const rangeText = startPage - 1 === 1 ? "1" : `1-${startPage - 1}`;
        items.push(
            <Pagination.Item key="left-range" onClick={() => setStranica(1)}>
                {rangeText}
            </Pagination.Item>
        );
    }

    // 2. CENTRALNIH 5 STRANICA
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


     async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati?')) return;

        await PjesmaService.obrisi(sifra);
        ucitajPodatke()
    }

    // 3. DESNI RASPON: Dinamički prikazuje od (endPage + 1) do kraja
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
            <Link to={RouteNames.PJESME_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje nove pjesme
            </Link>

            {/* tableti prema manje */}
            {['xs', 'sm', 'md'].includes(sirina) ? (
                <PjesmaPregledGrid
                    pjesme={pjesme}
                    navigate={navigate}
                    brisanje={brisanje}
                    dohvatiNazivAlbuma={dohvatiNazivAlbuma}
                    dohvatiNaziveZanrova={dohvatiNaziveZanrova}
                />
            ) : (
                <PjesmaPregledTablica
                    pjesme={pjesme}
                    navigate={navigate}
                    brisanje={brisanje}
                    dohvatiNazivAlbuma={dohvatiNazivAlbuma}
                    dohvatiNaziveZanrova={dohvatiNaziveZanrova}
                />
            )}

           

            {/* PRIKAZ NAPREDNE PAGINACIJE NA DNU */}
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