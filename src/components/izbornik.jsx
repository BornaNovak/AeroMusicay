import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IME_APLIKACIJE, RouteNames } from "../constants";

export default function Izbornik() {
    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">{IME_APLIKACIJE} </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={()=>navigate(RouteNames.HOME)}
                        >Pocetna</Nav.Link>

                        <NavDropdown title="Programi" id="basic-nav-dropdown">
                            <NavDropdown.Item 
                            onClick={()=>navigate(RouteNames.IZVODACI)}
                            >Izvodaci</NavDropdown.Item>
                            
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

}