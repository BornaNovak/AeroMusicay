import { Button, Table } from "react-bootstrap";
import { useState } from "react";

export default function IzvodacPregledTablica({ 
    izvodaci, 
    navigate, 
    brisanje,
    dohvatiNazivZanra 
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

    // 3. Prikaz strelice samo ako je stupac aktivan
    const renderSortArrow = (columnKey) => {
        if (sortConfig.key !== columnKey) return '';
        if (sortConfig.direction === 'asc') return ' ↑';
        if (sortConfig.direction === 'desc') return ' ↓';
        return '';
    };

    // 4. Funkcija za sortiranje podataka prije mapiranja
    const sortiraniIzvodaci = () => {
        if (!izvodaci || sortConfig.direction === null) {
            return izvodaci;
        }

        return [...izvodaci].sort((a, b) => {
            let aValue, bValue;

            if (sortConfig.key === 'dominantniZanr') {
                aValue = dohvatiNazivZanra(a.dominantniZanr) || '';
                bValue = dohvatiNazivZanra(b.dominantniZanr) || '';
            } else {
                aValue = a[sortConfig.key] || '';
                bValue = b[sortConfig.key] || '';
            }

            if (typeof aValue === 'string') {
                const result = aValue.localeCompare(bValue, 'hr', { sensitivity: 'accent' });
                return sortConfig.direction === 'asc' ? result : -result;
            }

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
                        Naziv izvođača{renderSortArrow('naziv')}
                    </th>
                    <th 
                        onClick={() => handleSort('dominantniZanr')} 
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Dominantni žanr{renderSortArrow('dominantniZanr')}
                    </th>
                    <th className="text-center">Akcije</th>
                </tr>
            </thead>
            <tbody>
                {sortiraniIzvodaci() && sortiraniIzvodaci().map((izvodac) => (
                    <tr key={izvodac.sifra}>
                        <td className="align-middle">
                            {izvodac.naziv}
                        </td>
                        <td className="align-middle">
                            {dohvatiNazivZanra(izvodac.dominantniZanr)}
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
                        <td colSpan="3" className="text-center text-muted">
                            Nema dostupnih izvođača.
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}