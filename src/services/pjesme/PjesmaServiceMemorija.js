import { pjesme } from "./PjesmaPodaci";

// 1/4 Read od CRUD
async function get() {
    return { success: true, data: [...pjesme] };
}

async function getBySifra(sifra) {
    const pjesma = pjesme.find(p => p.sifra === parseInt(sifra));
    return { success: true, data: pjesma };
}

// 2/4 Create od CRUD
async function dodaj(pjesma) {
    if (pjesme.length === 0) {
        pjesma.sifra = 1;
    } else {
        // Uzima šifru zadnje pjesme i uvećava je za 1
        pjesma.sifra = pjesme[pjesme.length - 1].sifra + 1;
    }
    pjesme.push(pjesma);
    return { success: true, data: pjesma };
}

// 3/4 Update od CRUD
async function promjeni(sifra, pjesmaPodaci) {
    const index = nadiIndex(sifra);
    if (index !== -1) {
        pjesme[index] = { ...pjesme[index], ...pjesmaPodaci, sifra: parseInt(sifra) };
        return { success: true, data: pjesme[index] };
    }
    return { success: false, message: 'Pjesma nije pronađena' };
}

// Pomoćna funkcija za pronalaženje indeksa
function nadiIndex(sifra) {
    return pjesme.findIndex(p => p.sifra === parseInt(sifra));
}

// 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        pjesme.splice(index, 1);
        return { success: true, message: 'Obrisano' };
    }
    return { success: false, message: 'Pjesma nije pronađena' };
}

// --- NOVO: Straničenje (Paginacija) ---
async function getPage(page = 1, pageSize = 8) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // slice uzima dio niza od startIndex do endIndex
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

// Na kraju exportamo sve funkcije uključujući i getPage
export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi,
    getPage
};