import { izvodaci } from "./IzvodacPodaci";

// 1/4 Read - dohvati sve
async function get() {
    return { success: true, data: [...izvodaci] };
}

// Dohvati jednog izvođača po šifri
async function getBySifra(sifra) {
    const izvodac = izvodaci.find(s => s.sifra === parseInt(sifra));
    return { success: true, data: izvodac };
}

// 2/4 Create - dodaj novog izvođača
async function dodaj(izvodac) {
    if (izvodaci.length === 0) {
        izvodac.sifra = 1;
    } else {
        // Uzimamo šifru zadnjeg i uvećavamo za 1
        izvodac.sifra = izvodaci[izvodaci.length - 1].sifra + 1;
    }
    izvodaci.push(izvodac);
    return { success: true, data: izvodac };
}

// 3/4 Update - promjeni postojećeg izvođača
async function promjeni(sifra, izvodacPodaci) {
    const index = nadiIndex(sifra);
    if (index !== -1) {
        izvodaci[index] = { ...izvodaci[index], ...izvodacPodaci, sifra: parseInt(sifra) };
        return { success: true, data: izvodaci[index] };
    }
    return { success: false, message: 'Izvođač nije pronađen' };
}

// Pomoćna funkcija za pronalaženje indeksa u nizu
function nadiIndex(sifra) {
    return izvodaci.findIndex(s => s.sifra === parseInt(sifra));
}

// 4/4 Delete - obriši izvođača
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        izvodaci.splice(index, 1);
        return { success: true, message: 'Obrisano' };
    }
    return { success: false, message: 'Izvođač nije pronađen' };
}

// NOVO: Straničenje (Paginacija)
async function getPage(page = 1, pageSize = 8) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Režemo lokalni niz podataka za traženu stranicu
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
    getPage // Obavezno dodati u export
};