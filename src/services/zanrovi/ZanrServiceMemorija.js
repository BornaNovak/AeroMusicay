import { zanrovi } from "./ZanrPodaci";

// 1/4 Read - dohvati sve
async function get() {
    return { success: true, data: [...zanrovi] };
}

// Dohvati jedan žanr po šifri
async function getBySifra(sifra) {
    const zanr = zanrovi.find(z => z.sifra === parseInt(sifra));
    return { success: true, data: zanr };
}

// 2/4 Create - dodaj novi žanr
async function dodaj(zanr) {
    if (zanrovi.length === 0) {
        zanr.sifra = 1;
    } else {
        // Uzima šifru zadnjeg žanra i uvećava je za 1
        zanr.sifra = zanrovi[zanrovi.length - 1].sifra + 1;
    }
    zanrovi.push(zanr);
    return { success: true, data: zanr };
}

// 3/4 Update - promjeni postojeći žanr
async function promjeni(sifra, zanrPodaci) {
    const index = nadiIndex(sifra);
    if (index !== -1) {
        zanrovi[index] = { ...zanrovi[index], ...zanrPodaci, sifra: parseInt(sifra) };
        return { success: true, data: zanrovi[index] };
    }
    return { success: false, message: 'Žanr nije pronađen' };
}

// Pomoćna funkcija za pronalaženje indeksa
function nadiIndex(sifra) {
    return zanrovi.findIndex(z => z.sifra === parseInt(sifra));
}

// 4/4 Delete - obriši žanr
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        zanrovi.splice(index, 1);
        return { success: true, message: 'Obrisano' };
    }
    return { success: false, message: 'Žanr nije pronađen' };
}

// NOVO: Straničenje (Paginacija)
async function getPage(page = 1, pageSize = 8) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Uzimamo samo dio niza za trenutnu stranicu
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

// Export svih funkcija
export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage // Obavezno dodano
};