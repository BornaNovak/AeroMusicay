import { izvodaci } from "./IzvodacPodaci"

async function get(){
    return {data:izvodaci}
}

async function dodaj(izvodac){
    if(izvodaci.length===0){
        izvodac.sifra=1
    }else{
        izvodac.sifra=izvodaci[izvodaci.length-1].sifra+1
    }
    izvodaci.push(izvodac)
}

export default {
    get,
    dodaj
}