import { albumi } from "./AlbumPodaci";

async function get() {
    return {success: true, data: [...albumi]}
}

async function getBySifra(sifra) {
    return {success: true, data: albumi.find(s => s.sifra === parseInt(sifra))}
}   

async function dodaj(album) {
    if(albumi.length === 0){
        album.sifra = 1
    }else{
        album.sifra = albumi[albumi.length - 1].sifra + 1
    }
    albumi.push(album)
}


async function promjeni(sifra, album) {
    const index = nadiIndex(sifra)
    albumi[index] = { ...albumi[index], ...album }
}

function nadiIndex(sifra) {
    return albumi.findIndex(s => s.sifra === parseInt(sifra))
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        albumi.splice(index, 1);
    }
    return;
}


export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}