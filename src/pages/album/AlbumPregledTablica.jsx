import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";

export default function AlbumPregledTablica({ 
    albumi, 
    navigate, 
    brisanje, 
    dohvatiNazivIzvodaca, 
    dohvatiNazivZanra 
}) {
    
    return (
        <Table striped bordered hover responsive className="shadow-sm">
            <thead>
                <tr>
                    <th>Naziv albuma</th>
                    <th>Izvođač</th>
                    <th>Žanr</th>
                    <th className="text-center">Godina izdavanja</th>
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
                        <td className="align-middle">
                            {dohvatiNazivZanra(album.zanr)}
                        </td>
                        <td className="text-center align-middle">
                            <NumericFormat
                                value={album.godinaIzdavanja}
                                displayType={'text'}
                                thousandSeparator=''
                            />
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