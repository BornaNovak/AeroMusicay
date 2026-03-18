import { useEffect, useState } from 'react'; // Dodano za praćenje stanja playera
import IzvodacService from '../../services/izvodaci/IzvodacService';

export default function IzvodacPregled() {
    // Stanje koje čuva trenutno odabranu pjesmu (u početku je null)
   const [izvodaci, setIzvodaci] = useState([])

   useEffect(() => {
    ucitajIzvodace();
   }, [])

   async function ucitajIzvodace(){
    await IzvodacService.get().then((odgovor) => {
        setIzvodaci(odgovor.data)
    })
   }

   return(
    <>
    <ol>
        {izvodaci && izvodaci.map((izvodac)=>(
            <li>{izvodac.naziv}</li>
        ))}
    </ol>
    </>
   )
}