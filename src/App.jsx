import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import IzvodacPregled from './pages/izvodaci/IzvodacPregled';
import { IME_APLIKACIJE, RouteNames } from './constants';
import Izbornik from './components/Izbornik';
import IzvodacNovi from './pages/izvodaci/IzvodacNovi';
import IzvodacPromjena from './pages/izvodaci/IzvodacPromjena';

function App() {
  return (
    <>
      <Izbornik />
      <Container className="mt-3">
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.IZVODACI} element={<IzvodacPregled />} />
          <Route path={RouteNames.IZVODACI_NOVI} element={<IzvodacNovi />} />
          <Route path={RouteNames.IZVODACI_PROMJENA} element={<IzvodacPromjena />}/>
        </Routes>
        &copy; {IME_APLIKACIJE}
      </Container>
    </>
  );
}

export default App;