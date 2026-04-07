import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import FormatDatuma from "../../components/FormatDatuma"
import { RouteNames } from "../../constants"
import AlbumService from "../../services/albumi/AlbumService"
import IzvodacService from "../../services/izvodaci/IzvodacService"

export default function AlbumPregled(){
    const [albumi, setAlbumi] = useState([])
    const [izvodaci, setIzvodaci] = useState([]) 
    const navigate = useNavigate();

    useEffect(() => {
        ucitajAlbume()
        ucitajIzvodace()
    }, [])

    async function ucitajAlbume(){
        await AlbumService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran album')
                return
            }
            setAlbumi(odgovor.data)
        })
    }

    async function ucitajIzvodace(){
        await IzvodacService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran servis za izvođače')
                return
            }
            setIzvodaci(odgovor.data)
        })
    }

    async function obrisi(sifra){
        if(!confirm('Jeste li sigurni da zelite obrisati?')){
            return
        }
        await AlbumService.obrisi(sifra)
        ucitajAlbume()
    }

    function dohvatiNazivIzvodaca(sifraIzvodaca) {
        const izvodac = izvodaci.find(i => i.sifra == sifraIzvodaca)
        return izvodac ? izvodac.naziv : 'Nepoznat izvođač'
    }

    return(
        <>
        <Link to={RouteNames.ALBUMI_NOVI} className="btn btn-success w-100 my-3">
            Dodavanje novog albuma
        </Link>
        <Table striped hover responsive>
        <thead>
            <tr>
                <th>Naziv albuma</th>
                <th>Izvođač</th>
                <th>Datum izdavanja</th>
                <th>Akcije</th>
            </tr>
        </thead>
        <tbody>
            {albumi && albumi.map((album)=>(
                <tr key={album.sifra}>
                    <td>{album.naziv}</td>
                    <td>{dohvatiNazivIzvodaca(album.izvodac)}</td>
                    <td>
                        <FormatDatuma datum={album.datumIzdavanja} prikazZadano='-' />
                    </td>
                    <td>
                        <Button size="sm" onClick={()=>{navigate(`/albumi/${album.sifra}`)}}>
                            Promjeni
                        </Button>
                        &nbsp;&nbsp;
                        <Button size="sm" variant="danger" onClick={()=>{obrisi(album.sifra)}}>
                            Obriši
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
         </Table>
        </>
    )
}