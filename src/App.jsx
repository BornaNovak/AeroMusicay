import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import IzvodacPregled from './pages/izvodaci/IzvodacPregled';
import { RouteNames } from './constants';
import Izbornik from './components/Izbornik';
import IzvodacNovi from './pages/izvodaci/IzvodacNovi';

function App() {
  return (
    <>
      <Izbornik />
      <Container className="mt-3">
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.IZVODACI} element={<IzvodacPregled />} />
          <Route path={RouteNames.IZVODACI_NOVI} element={<IzvodacNovi />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;