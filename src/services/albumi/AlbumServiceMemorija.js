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
    return { success: true, data: album }; 
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

// IZMJEŠTENO: Straničenje s sortiranjem
async function getPage(page = 1, pageSize = 8, sortColumn = 'naziv', sortDirection = 'asc') {
    
    // 1. Napravi kopiju niza da ne mijenjaš originalni uvoz iz AlbumPodaci trajno
    let privremeniAlbumi = [...albumi];

    // 2. SORTIRANJE (prije rezanja)
    if (sortColumn && sortDirection) {
        privremeniAlbumi.sort((a, b) => {
            let aValue = a[sortColumn];
            let bValue = b[sortColumn];

            // Datum sortiranje
            if (sortColumn === 'datumIzdavanja') {
                const dateA = new Date(aValue || 0);
                const dateB = new Date(bValue || 0);
                return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Tekstualno sortiranje (Hrvatska abeceda)
            const result = String(aValue || '').localeCompare(String(bValue || ''), 'hr', { sensitivity: 'accent' });
            return sortDirection === 'asc' ? result : -result;
        });
    }

    // 3. REZANJE (Paginacija)
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = privremeniAlbumi.slice(startIndex, endIndex);
    
    const totalItems = privremeniAlbumi.length;
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