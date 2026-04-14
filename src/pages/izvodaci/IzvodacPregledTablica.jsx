import { Button, Table } from "react-bootstrap";

export default function IzvodacPregledTablica({ 
    izvodaci, 
    navigate, 
    brisanje 
}) {
    
    return (
        <Table striped hover responsive className="shadow-sm">
            <thead>
                <tr>
                    <th>Naziv izvođača</th>
                    <th className="text-center">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {izvodaci && izvodaci.map((izvodac) => (
                    <tr key={izvodac.sifra}>
                        <td className="align-middle">
                            {izvodac.naziv}
                        </td>
                        <td className="text-center align-middle">
                            <Button 
                                size="sm" 
                                onClick={() => navigate(`/izvodaci/${izvodac.sifra}`)}
                            >
                                Promjeni
                            </Button>
                            &nbsp;&nbsp;
                            <Button 
                                size="sm" 
                                variant="danger" 
                                onClick={() => brisanje(izvodac.sifra)}
                            >
                                Obriši
                            </Button>
                        </td>
                    </tr>
                ))}
                {(!izvodaci || izvodaci.length === 0) && (
                    <tr>
                        <td colSpan="2" className="text-center text-muted">
                            Nema dostupnih izvođača.
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}