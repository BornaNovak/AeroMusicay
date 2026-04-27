import { Button, Table } from "react-bootstrap";
import { formatirajTrajanje } from "../../utils"; // Pripazi na točnu putanju do utils-a

export default function PjesmaPregledTablica({ 
    pjesme, 
    navigate, 
    brisanje, 
    generirajPDF,
    dohvatiNazivAlbuma,
    dohvatiNaziveZanrova,
    sortConfig,
    onSort 
}) {

    const getSortIndicator = (stupac) => {
        if (sortConfig.stupac !== stupac) return " ↕";
        return sortConfig.smjer === 'asc' ? " ↑" : " ↓";
    };

    return (
        <Table striped hover responsive className="shadow-sm">
            <thead>
                <tr>
                    <th 
                        onClick={() => onSort('naziv')} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Naziv pjesme {getSortIndicator('naziv')}
                    </th>
                    <th 
                        onClick={() => onSort('album')} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Album {getSortIndicator('album')}
                    </th>
                    <th>
                        Žanrovi
                    </th>
                    <th 
                        onClick={() => onSort('trajanje')} 
                        className="text-center"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Trajanje {getSortIndicator('trajanje')}
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
                                &nbsp;&nbsp;
                                <Button size="sm" variant="info" className="text-white" onClick={() => generirajPDF(pjesma)}>
                                    PDF
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