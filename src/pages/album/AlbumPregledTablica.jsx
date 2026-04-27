import { Button, Table } from "react-bootstrap";
import FormatDatuma from "../../components/FormatDatuma";

export default function AlbumPregledTablica({ 
    albumi, 
    navigate, 
    brisanje, 
    generirajPDF,
    dohvatiNazivIzvodaca, // 1. DODAJ OVO (Mora biti ovdje da bi je tablica vidjela)
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
                        Naziv albuma {getSortIndicator('naziv')}
                    </th>
                    <th 
                        onClick={() => onSort('izvodac')} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Izvođač {getSortIndicator('izvodac')}
                    </th>
                    <th 
                        onClick={() => onSort('datumIzdavanja')} 
                        className="text-center" 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Datum izdavanja {getSortIndicator('datumIzdavanja')}
                    </th>
                    <th className="text-center">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {albumi && albumi.length > 0 ? (
                    albumi.map((album) => (
                        <tr key={album.sifra}>
                            <td className="align-middle">{album.naziv}</td>
                            
                            {/* 2. PROMIJENI OVU LINIJU ISPOD: */}
                            <td className="align-middle">
                                {album.izvodac}
                            </td>

                            <td className="text-center align-middle">
                                <FormatDatuma datum={album.datumIzdavanja} />
                            </td>
                            <td className="text-center align-middle">
                                <Button size="sm" onClick={() => navigate(`/albumi/${album.sifra}`)}>
                                    Promjeni
                                </Button>
                                &nbsp;&nbsp;
                                <Button size="sm" variant="danger" onClick={() => brisanje(album.sifra)}>
                                    Obriši
                                </Button>
                                &nbsp;&nbsp;
                                <Button size="sm" variant="info" onClick={() => generirajPDF(album)}>
                                    PDF
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
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