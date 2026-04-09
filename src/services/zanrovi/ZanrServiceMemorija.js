import { zanrovi } from "./ZanrPodaci";

async function get() {
    return { success: true, data: [...zanrovi] };
}

async function getBySifra(sifra) {
    const zanr = zanrovi.find(z => z.sifra === parseInt(sifra));
    return { success: true, data: zanr };
}

async function dodaj(zanr) {
    if (zanrovi.length === 0) {
        zanr.sifra = 1;
    } else {
        zanr.sifra = zanrovi[zanrovi.length - 1].sifra + 1;
    }
    zanrovi.push(zanr);
    return { success: true, data: zanr };
}

async function promjeni(sifra, zanrPodaci) {
    const index = nadiIndex(sifra);
    if (index !== -1) {
        zanrovi[index] = { ...zanrovi[index], ...zanrPodaci, sifra: parseInt(sifra) };
        return { success: true, data: zanrovi[index] };
    }
    return { success: false, message: 'Žanr nije pronađen' };
}

function nadiIndex(sifra) {
    return zanrovi.findIndex(z => z.sifra === parseInt(sifra));
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        zanrovi.splice(index, 1);
        return { success: true, message: 'Obrisano' };
    }
    return { success: false, message: 'Žanr nije pronađen' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};