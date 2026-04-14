import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import FormatDatuma from "../../components/FormatDatuma";

export default function AlbumPregledTablica({ 
    albumi, 
    navigate, 
    brisanje, 
    dohvatiNazivIzvodaca
}) {
    
    return (
        <Table striped bordered hover responsive className="shadow-sm">
            <thead>
                <tr>
                    <th>Naziv albuma</th>
                    <th>Izvođač</th>
                    <th className="text-center">Datum izdavanja</th>
                    <th className="text-center">Akcija</th>
                </tr>
            </thead>
            <tbody>
                {albumi && albumi.map((album) => (
                    <tr key={album.sifra}>
                        <td className="align-middle fw-bold">
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
                                variant="outline-primary"
                                size="sm"
                                onClick={() => navigate(`/albumi/${album.sifra}`)}
                            >
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => brisanje(album.sifra)}
                            >
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
                {(!albumi || albumi.length === 0) && (
                    <tr>
                        <td colSpan="5" className="text-center text-muted">
                            Nema dostupnih albuma.
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}