import { PrefixStorage } from "../../constants";

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.ZANROVI);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.ZANROVI, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const zanrovi = dohvatiSveIzStorage();
    return { success: true, data: [...zanrovi] };
}

// Dohvati jedan žanr po šifri
async function getBySifra(sifra) {
    const zanrovi = dohvatiSveIzStorage();
    const zanr = zanrovi.find(z => z.sifra === parseInt(sifra));
    return { success: true, data: zanr };
}

// 2/4 Create - dodaj novi žanr
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

// 3/4 Update - promjeni postojeći žanr
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

// 4/4 Delete - obriši žanr
async function obrisi(sifra) {
    let zanrovi = dohvatiSveIzStorage();
    zanrovi = zanrovi.filter(z => z.sifra !== parseInt(sifra));
    spremiUStorage(zanrovi);
    return { success: true, message: 'Žanr obrisana' };
}

// NOVO: Straničenje (Paginacija)
async function getPage(page = 1, pageSize = 8) {
    const zanrovi = dohvatiSveIzStorage();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = zanrovi.slice(startIndex, endIndex);
    const totalItems = zanrovi.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
        success: true,
        data: paginatedData,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalItems
    };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage // Obavezno dodati u export
};