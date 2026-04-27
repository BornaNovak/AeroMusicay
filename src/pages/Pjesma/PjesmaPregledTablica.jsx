import { Button, Table } from "react-bootstrap";
import { formatirajTrajanje } from "../../utils";

export default function PjesmaPregledTablica({ 
    pjesme, 
    navigate, 
    brisanje, 
    dohvatiNazivAlbuma,
    dohvatiNaziveZanrova,
    sortConfig, // Primljeno iz PjesmaPregled.jsx (to je onaj state 'sortiranje')
    onSort      // Primljeno iz PjesmaPregled.jsx (funkcija 'promjeniSortiranje')
}) {

    // Funkcija koja odlučuje koju strelicu prikazati pored naslova
    const getSortIndicator = (columnKey) => {
        if (sortConfig.stupac !== columnKey) {
            return " ↕"; // Nije sortirano po ovom stupcu
        }
        return sortConfig.smjer === 'asc' ? " ↑" : " ↓";
    };

    return (
        <Table striped hover responsive className="shadow-sm">
            <thead>
                <tr>
                    {/* Na klik zovemo onSort koji u roditelju mijenja state i pokreće novi API poziv */}
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