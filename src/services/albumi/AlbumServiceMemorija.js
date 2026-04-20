import { albumi } from "./AlbumPodaci";

// 1/4 Read - dohvati sve
async function get() {
    return { success: true, data: [...albumi] };
}

// Dohvati jedan album po šifri
async function getBySifra(sifra) {
    const album = albumi.find(s => s.sifra === parseInt(sifra));
    return { success: true, data: album };
}

// 2/4 Create - dodaj novi album
async function dodaj(album) {
    if (albumi.length === 0) {
        album.sifra = 1;
    } else {
        album.sifra = albumi[albumi.length - 1].sifra + 1;
    }
    albumi.push(album);
    return { success: true, data: album }; // Usklađeno da vraća objekt
}

// 3/4 Update - promjeni postojeći album
async function promjeni(sifra, podaci) {
    const index = nadiIndex(sifra);
    if (index !== -1) {
        albumi[index] = { ...albumi[index], ...podaci, sifra: parseInt(sifra) };
        return { success: true, data: albumi[index] };
    }
    return { success: false, message: 'Album nije pronađen' };
}

// Pomoćna funkcija za pronalaženje indeksa
function nadiIndex(sifra) {
    return albumi.findIndex(s => s.sifra === parseInt(sifra));
}

// 4/4 Delete - obriši album
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    if (index > -1) {
        albumi.splice(index, 1);
        return { success: true, message: 'Obrisano' };
    }
    return { success: false, message: 'Album nije pronađen' };
}

// NOVO: Straničenje (Paginacija)
async function getPage(page = 1, pageSize = 8) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Rezanje niza za trenutnu stranicu
    const paginatedData = albumi.slice(startIndex, endIndex);
    
    const totalItems = albumi.length;
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
    getPage // Dodano u export
};