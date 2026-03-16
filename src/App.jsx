import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';

import Izbornik from './components/izbornik';
import Home from './pages/Home';
import IzvodacPregled from './pages/izvodaci/IzvodacPregled';
import { RouteNames } from './constants';

function App() {
  return (
    <>
      <Izbornik />
      <Container className="mt-3">
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.IZVODAC} element={<IzvodacPregled />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;