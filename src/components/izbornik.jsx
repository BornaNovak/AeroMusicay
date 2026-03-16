import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IME_APLIKACIJE, RouteNames } from "../constants";

export default function Izbornik() {
    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
            <Container>
                {/* Klik na ime aplikacije vodi na Home */}
                <Navbar.Brand 
                    className="fw-bold" 
                    onClick={() => navigate(RouteNames.HOME)} 
                    style={{ cursor: 'pointer' }}
                >
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate(RouteNames.HOME)}>
                            Početna
                        </Nav.Link>
                        
                        <NavDropdown title="Programi" id="basic-nav-dropdown">
                            {/* Ovdje smo zamijenili Smjerove s Izvođačima */}
                            <NavDropdown.Item onClick={() => navigate(RouteNames.IZVODAC)}>
                                Izvođači
                            </NavDropdown.Item>
                            
                            {/* Ovdje možeš dodati i druge entitete u budućnosti */}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}