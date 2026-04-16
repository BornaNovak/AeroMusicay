import { izvodaci } from "./IzvodacPodaci";

async function get(){
    return {success: true, data: [...izvodaci]}
}


async function getBySifra(sifra){
    return {success: true, data: izvodaci.find(s => s.sifra === parseInt(sifra))}
}


async function dodaj(izvodac){
    if(izvodaci.length===0){
        izvodac.sifra=1
    }else{
        izvodac.sifra=izvodaci[izvodaci.length-1].sifra+1
    }
    izvodaci.push(izvodac)
}


async function promjeni(sifra,izvodac){
    const index = nadiIndex(sifra)
    izvodaci[index] = {...izvodaci[index], ...izvodac}
}

function nadiIndex(sifra){
    return izvodaci.findIndex(s=>s.sifra ===parseInt(sifra))
}


async function obrisi(sifra){
    const index = nadiIndex(sifra);
    if( index > -1){
        izvodaci.splice(index,1);
    }
    return {success: true, data: null};
}


export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}