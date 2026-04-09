const STORAGE_KEY = 'zanrovi';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const zanrovi = dohvatiSveIzStorage();
    return { success: true, data: [...zanrovi] };
}

async function getBySifra(sifra) {
    const zanrovi = dohvatiSveIzStorage();
    const zanr = zanrovi.find(z => z.sifra === parseInt(sifra));
    return { success: true, data: zanr };
}

async function dodaj(zanr) {
    const zanrovi = dohvatiSveIzStorage();
    
    if (zanrovi.length === 0) {        
        zanr.sifra = 1;
    } else {
        const maxSifra = Math.max(...zanrovi.map(z => z.sifra));
        zanr.sifra = maxSifra + 1;
    }
    
    zanrovi.push(zanr);
    spremiUStorage(zanrovi);
    return { success: true, data: zanr };
}

async function promjeni(sifra, zanrPodaci) {
    const zanrovi = dohvatiSveIzStorage();
    const index = zanrovi.findIndex(z => z.sifra === parseInt(sifra));
    
    if (index !== -1) {
        zanrovi[index] = { ...zanrovi[index], ...zanrPodaci, sifra: parseInt(sifra) };
        spremiUStorage(zanrovi);
        return { success: true, data: zanrovi[index] };
    }
    return { success: false, message: 'Žanr nije pronađen' };
}

async function obrisi(sifra) {
    let zanrovi = dohvatiSveIzStorage();
    zanrovi = zanrovi.filter(z => z.sifra !== parseInt(sifra));
    spremiUStorage(zanrovi);
    return { success: true, message: 'Žanr obrisan' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};