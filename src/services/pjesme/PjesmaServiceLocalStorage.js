const STORAGE_KEY = 'pjesme';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const pjesme = dohvatiSveIzStorage();
    return { success: true, data: [...pjesme] };
}

async function getBySifra(sifra) {
    const pjesme = dohvatiSveIzStorage();
    const pjesma = pjesme.find(p => p.sifra === parseInt(sifra));
    return { success: true, data: pjesma };
}

async function dodaj(pjesma) {
    const pjesme = dohvatiSveIzStorage();
    if (pjesme.length === 0) {
        pjesma.sifra = 1;
    } else {
        const maxSifra = Math.max(...pjesme.map(p => p.sifra));
        pjesma.sifra = maxSifra + 1;
    }
    pjesme.push(pjesma);
    spremiUStorage(pjesme);
    return { success: true, data: pjesma };
}

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

async function obrisi(sifra) {
    let pjesme = dohvatiSveIzStorage();
    pjesme = pjesme.filter(p => p.sifra !== parseInt(sifra));
    spremiUStorage(pjesme);
    return { success: true, message: 'Pjesma obrisana' };
}

// --- POPRAVLJENO: Straničenje sa sortiranjem ---
async function getPage(page = 1, pageSize = 8, stupac = 'naziv', smjer = 'asc') {
    let pjesme = dohvatiSveIzStorage();

    // Sortiramo CIJELI NIZ iz storage-a prije rezanja na stranice
    if (stupac) {
        pjesme.sort((a, b) => {
            let aValue = a[stupac] || '';
            let bValue = b[stupac] || '';

            if (typeof aValue === 'string') {
                const usporedba = aValue.localeCompare(bValue, 'hr');
                return smjer === 'asc' ? usporedba : -usporedba;
            }
            return smjer === 'asc' ? aValue - bValue : bValue - aValue;
        });
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Uzimamo komad iz sortiranog niza
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