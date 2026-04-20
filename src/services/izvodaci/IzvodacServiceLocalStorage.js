const STORAGE_KEY = 'izvodaci';

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

// Pomoćna funkcija za spremanje podataka u local storage
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

// 1/4 Read - dohvati sve izvođače
async function get() {
    const izvodaci = dohvatiSveIzStorage();
    return { success: true, data: [...izvodaci] };
}

// Dohvati jednog izvođača po šifri
async function getBySifra(sifra) {
    const izvodaci = dohvatiSveIzStorage();
    const izvodac = izvodaci.find(s => s.sifra === parseInt(sifra));
    return { success: true, data: izvodac };
}

// 2/4 Create - dodaj novog izvođača
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
    return { success: true, data: izvodac };
}

// 3/4 Update - promjeni postojećeg izvođača
async function promjeni(sifra, izvodacPodaci) {
    const izvodaci = dohvatiSveIzStorage();
    const index = izvodaci.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        izvodaci[index] = { ...izvodaci[index], ...izvodacPodaci, sifra: parseInt(sifra) };
        spremiUStorage(izvodaci);
        return { success: true, data: izvodaci[index] };
    }
    return { success: false, message: 'Izvođač nije pronađen' };
}

// 4/4 Delete - obriši izvođača
async function obrisi(sifra) {
    let izvodaci = dohvatiSveIzStorage();
    izvodaci = izvodaci.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(izvodaci);
    return { success: true, message: 'Obrisano' };
}

// NOVO: Straničenje (Paginacija)
async function getPage(page = 1, pageSize = 8) {
    const izvodaci = dohvatiSveIzStorage();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Uzimamo samo dio niza za trenutnu stranicu
    const paginatedData = izvodaci.slice(startIndex, endIndex);
    
    const totalItems = izvodaci.length;
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
    getPage // Obavezno dodano u export
};