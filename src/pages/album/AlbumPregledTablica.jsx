import { Button, Table } from "react-bootstrap";
import { useState } from "react";
import FormatDatuma from "../../components/FormatDatuma";

export default function AlbumPregledTablica({ 
    albumi, 
    navigate, 
    brisanje, 
    dohvatiNazivIzvodaca,
    generirajPDF
}) {
    // 1. State za konfiguraciju sortiranja
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // 2. Logika za promjenu smjera (asc -> desc -> null)
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    // 3. Prikaz strelice samo pored aktivnog stupca
    const renderSortArrow = (columnKey) => {
        if (sortConfig.key !== columnKey) return '';
        if (sortConfig.direction === 'asc') return ' ↑';
        if (sortConfig.direction === 'desc') return ' ↓';
        return '';
    };

    // 4. Funkcija za sortiranje podataka
    const sortiraniAlbumi = () => {
        if (!albumi || sortConfig.direction === null) {
            return albumi;
        }

        return [...albumi].sort((a, b) => {
            let aValue, bValue;

            // Posebna obrada za izvođača (sortiramo po nazivu koji vidimo, ne po ID-u)
            if (sortConfig.key === 'izvodac') {
                aValue = dohvatiNazivIzvodaca(a.izvodac) || '';
                bValue = dohvatiNazivIzvodaca(b.izvodac) || '';
            } else {
                aValue = a[sortConfig.key] || '';
                bValue = b[sortConfig.key] || '';
            }

            // Sortiranje za datume
            if (sortConfig.key === 'datumIzdavanja') {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Sortiranje za stringove (podrška za hrvatska slova)
            if (typeof aValue === 'string') {
                const result = aValue.localeCompare(bValue, 'hr', { sensitivity: 'accent' });
                return sortConfig.direction === 'asc' ? result : -result;
            }

            // Fallback za ostale tipove
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    return (
        <Table striped hover responsive className="shadow-sm">
            <thead>
                <tr>
                    <th 
                        onClick={() => handleSort('naziv')} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Naziv albuma{renderSortArrow('naziv')}
                    </th>
                    <th 
                        onClick={() => handleSort('izvodac')} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Izvođač{renderSortArrow('izvodac')}
                    </th>
                    <th 
                        className="text-center"
                        onClick={() => handleSort('datumIzdavanja')} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Datum izdavanja{renderSortArrow('datumIzdavanja')}
                    </th>
                    <th className="text-center">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {sortiraniAlbumi() && sortiraniAlbumi().map((album) => (
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
                            &nbsp;&nbsp;
                            <Button 
                                size="sm"
                                variant="info" 
                                className="text-white"
                                onClick={() => generirajPDF(album)}
                            >
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