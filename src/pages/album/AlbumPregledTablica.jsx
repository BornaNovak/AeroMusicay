import { Button, Table } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";

export default function AlbumPregledTablica({ 
    albumi, 
    navigate, 
    brisanje, 
    dohvatiNazivIzvodaca,
    generirajPDF
}) {
    
    return (
        <Table striped hover responsive className="shadow-sm">
            <thead>
                <tr>
                    <th>Naziv albuma</th>
                    <th>Izvođač</th>
                    <th className="text-center">Datum izdavanja</th>
                    <th className="text-center">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {albumi && albumi.map((album) => (
                    <tr key={album.sifra}>
                        <td className="align-middle">
                            {album.naziv}
                        </td>
                        <td className="align-middle">
                            {dohvatiNazivIzvodaca(album.izvodac)}
                        </td>
                        <td className="text-center align-middle">
                            <FormatDatuma datum={album.datumIzdavanja} />
                        </td>
                        <td className="text-center align-middle">
                            <Button 
                                size="sm" 
                                onClick={() => navigate(`/albumi/${album.sifra}`)}
                            >
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button 
                                size="sm" 
                                variant="danger" 
                                onClick={() => brisanje(album.sifra)}
                            >
                                Obriši
                            </Button>
                            <Button 
                            size="sm"
                            variant="info" 
                            onClick={() => generirajPDF(album)}>
                                PDF
                            </Button>
                        </td>
                    </tr>
                ))}
                {(!albumi || albumi.length === 0) && (
                    <tr>
                        <td colSpan="4" className="text-center text-muted">
                            Nema dostupnih albuma.
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}