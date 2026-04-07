import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import FormatDatuma from "../../components/FormatDatuma"
import { RouteNames } from "../../constants"
import AlbumService from "../../services/albumi/AlbumService"

export default function AlbumPregled(){
    const [albumi, setAlbumi] = useState([])
    const navigate = useNavigate();
    useEffect(() => {ucitajAlbume()}, [])

    async function ucitajAlbume(){
        await AlbumService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran album')
                return
            }
            setAlbumi(odgovor.data)
        })
    }

    async function obrisi(sifra){
        if(!confirm('Jeste li sigurni da zelite obrisati?')){
            return
        }
        await AlbumService.obrisi(sifra)
        ucitajAlbume()
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
                    <td>{album.izvodac}</td>
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