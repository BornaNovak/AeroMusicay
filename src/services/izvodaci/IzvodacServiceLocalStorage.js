const STORAGE_KEY = 'izvodaci';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const izvodaci = dohvatiSveIzStorage();
    return {success: true,  data: [...izvodaci] };
}

async function getBySifra(sifra) {
    const izvodaci = dohvatiSveIzStorage();
    const izvodac = izvodaci.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: izvodac };
}

async function dodaj(izvodac) {
    const izvodaci = dohvatiSveIzStorage();
    
    if (izvodaci.length === 0) {
        izvodac.sifra = 1;
    } else {
        const maxSifra = Math.max(...izvodaci.map(s => s.sifra));
        izvodac.sifra = maxSifra + 1;
    }
    
    izvodaci.push(izvodac);
    spremiUStorage(izvodaci);
    return { data: izvodac };
}

async function promjeni(sifra, izvodac) {
    const izvodaci = dohvatiSveIzStorage();
    const index = izvodaci.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        izvodaci[index] = { ...izvodaci[index], ...izvodac};
        spremiUStorage(izvodaci);
    }
    return { data: izvodaci[index] };
}

async function obrisi(sifra) {
    let izvodaci = dohvatiSveIzStorage();
    izvodaci = izvodaci.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(izvodaci);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
