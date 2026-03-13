import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import SmjerPregled from './pages/smjerovi/SmjerPregled'
import Home from './pages/Home'

function App() {

  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.SMJEROVI} element={<SmjerPregled />} />
      </Routes>
    </Container>
  )
}

export default App
