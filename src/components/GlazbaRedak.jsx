import { Button } from "react-bootstrap";

export default function GlazbaRedak({ pjesma, naPlay }) {
    return (
        <tr>
            <td>{pjesma.ime}</td>
            <td>{pjesma.trajanje}</td>
            <td>{pjesma.godina}</td>
            <td>
                {/* Gumb koji šalje podatke o pjesmi u glavni player */}
                <Button variant="success" size="sm" className="me-2" onClick={() => naPlay(pjesma)}>
                    ▶ Play
                </Button>
                <Button variant="outline-primary" size="sm" className="me-2">
                    Uredi
                </Button>
                <Button variant="outline-danger" size="sm">
                    Obriši
                </Button>
            </td>
        </tr>
    );
}