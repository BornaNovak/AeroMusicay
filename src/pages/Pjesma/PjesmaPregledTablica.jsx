import { Button, Table } from "react-bootstrap";
import { formatirajTrajanje } from "../../utils"; // Pripazi na točnu putanju do utils-a

export default function PjesmaPregledTablica({ 
    pjesme, 
    navigate, 
    brisanje, 
    dohvatiNazivAlbuma,
    dohvatiNaziveZanrova
}) {


    return (
        <Table striped hover responsive className="shadow-sm">
            <thead>
                <tr>
                    <th>
                        Naziv pjesme 
                    </th>
                    <th>
                        Album 
                    </th>
                    <th>
                        Žanrovi
                    </th>
                    <th>
                        Trajanje
                    </th>
                    <th className="text-center">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {pjesme && pjesme.length > 0 ? (
                    pjesme.map((pjesma) => (
                        <tr key={pjesma.sifra}>
                            <td className="align-middle">{pjesma.naziv}</td>
                            
                            <td className="align-middle">
                                {dohvatiNazivAlbuma(pjesma.album)}
                            </td>

                            <td className="align-middle">
                                {dohvatiNaziveZanrova(pjesma.zanr)}
                            </td>

                            <td className="text-center align-middle">
                                {formatirajTrajanje(pjesma.trajanje)}
                            </td>

                            <td className="text-center align-middle">
                                <Button size="sm" onClick={() => navigate(`/pjesme/${pjesma.sifra}`)}>
                                    Promjeni
                                </Button>
                                &nbsp;&nbsp;
                                <Button size="sm" variant="danger" onClick={() => brisanje(pjesma.sifra)}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center text-muted">
                            Nema dostupnih pjesama.
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}