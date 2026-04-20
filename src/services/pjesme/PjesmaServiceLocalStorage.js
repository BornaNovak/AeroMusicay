const STORAGE_KEY = 'pjesme';

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve
async function get() {
    const pjesme = dohvatiSveIzStorage();
    return { success: true, data: [...pjesme] };
}

// Dohvati jednu po šifri
async function getBySifra(sifra) {
    const pjesme = dohvatiSveIzStorage();
    const pjesma = pjesme.find(p => p.sifra === parseInt(sifra));
    return { success: true, data: pjesma };
}

// 2/4 Create - dodaj novu pjesmu
async function dodaj(pjesma) {
    const pjesme = dohvatiSveIzStorage();
    
    if (pjesme.length === 0) {
        pjesma.sifra = 1;
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        const maxSifra = Math.max(...pjesme.map(p => p.sifra));
        pjesma.sifra = maxSifra + 1;
    }
    
    pjesme.push(pjesma);
    spremiUStorage(pjesme);
    return { success: true, data: pjesma };
}

// 3/4 Update - promjeni postojeću pjesmu
async function promjeni(sifra, pjesmaPodaci) {
    const pjesme = dohvatiSveIzStorage();
    const index = pjesme.findIndex(p => p.sifra === parseInt(sifra));
    
    if (index !== -1) {
        pjesme[index] = { ...pjesme[index], ...pjesmaPodaci, sifra: parseInt(sifra) };
        spremiUStorage(pjesme);
        return { success: true, data: pjesme[index] };
    }
    return { success: false, message: 'Pjesma nije pronađena' };
}

// 4/4 Delete - obriši pjesmu
async function obrisi(sifra) {
    let pjesme = dohvatiSveIzStorage();
    pjesme = pjesme.filter(p => p.sifra !== parseInt(sifra));
    spremiUStorage(pjesme);
    return { success: true, message: 'Pjesma obrisana' };
}

// Straničenje - dohvati stranicu pjesama
async function getPage(page = 1, pageSize = 8) {
    const pjesme = dohvatiSveIzStorage();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = pjesme.slice(startIndex, endIndex);
    const totalItems = pjesme.length;
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
    getPage
};