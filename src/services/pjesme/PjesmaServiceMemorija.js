import { pjesme } from "./PjesmaPodaci";


async function get() {
    return { success: true, data: [...pjesme] };
}

async function getBySifra(sifra) {
    const pjesma = pjesme.find(p => p.sifra === parseInt(sifra));
    return { success: true, data: pjesma };
}

async function dodaj(pjesma) {
    if (pjesme.length === 0) {
        pjesma.sifra = 1;
    } else {
        pjesma.sifra = pjesme[pjesme.length - 1].sifra + 1;
    }
    pjesme.push(pjesma);
    return { success: true, data: pjesma };
}

async function promjeni(sifra, pjesmaPodaci) {
    const index = nadiIndex(sifra);
    if (index !== -1) {
        pjesme[index] = { ...pjesme[index], ...pjesmaPodaci, sifra: parseInt(sifra) };
        return { success: true, data: pjesme[index] };
    }
    return { success: false, message: 'Pjesma nije pronađena' };
}

function nadiIndex(sifra) {
    return pjesme.findIndex(p => p.sifra === parseInt(sifra));
}

async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        pjesme.splice(index, 1);
        return { success: true, message: 'Obrisano' };
    }
    return { success: false, message: 'Pjesma nije pronađena' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};