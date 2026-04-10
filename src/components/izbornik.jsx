import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { IME_APLIKACIJE, RouteNames } from "../constants";

export default function Izbornik() {
    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>{IME_APLIKACIJE} </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={()=>navigate(RouteNames.HOME)}
                        >Početna</Nav.Link>

                        <NavDropdown title="Programi" id="basic-nav-dropdown">
                            <NavDropdown.Item 
                            onClick={()=>navigate(RouteNames.IZVODACI)}
                            >Izvodači</NavDropdown.Item>

                            <NavDropdown.Item
                            onClick={()=>navigate(RouteNames.ALBUMI)}
                            >Albumi</NavDropdown.Item>
                            
                            <NavDropdown.Item
                            onClick={()=>navigate(RouteNames.PJESME)}
                            >Pjesme</NavDropdown.Item>

                            <NavDropdown.Item
                            onClick={()=>navigate(RouteNames.ZANROVI)}
                            >Žanrovi</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

}