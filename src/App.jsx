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
import AlbumPregled from './pages/album/AlbumPregled';
import AlbumNovi from './pages/album/AlbumNovi';
import AlbumPromjena from './pages/album/AlbumPromjena';
import PjesmaPregled from './pages/Pjesma/PjesmaPregled';
import PjesmaNovi from './pages/Pjesma/PjesmaNovi';
import PjesmaPromjena from './pages/Pjesma/PjesmaPromjena';

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

          <Route path={RouteNames.ALBUMI} element={<AlbumPregled />} />
          <Route path={RouteNames.ALBUMI_NOVI} element={<AlbumNovi />} />
          <Route path={RouteNames.ALBUMI_PROMJENA} element={<AlbumPromjena />}/>

          <Route path={RouteNames.PJESME} element={<PjesmaPregled />} />
          <Route path={RouteNames.PJESME_NOVI} element={<PjesmaNovi />} />
          <Route path={RouteNames.PJESME_PROMJENA} element={<PjesmaPromjena />}/>
        </Routes>
        
        <footer className="fixed-bottom text-center py-3 bg-light">
        &copy; {IME_APLIKACIJE}
      </footer>
      </Container>
    </>
  );
}

export default App;