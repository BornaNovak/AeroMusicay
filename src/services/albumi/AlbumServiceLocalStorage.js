const STORAGE_KEY = 'albumi';

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
    const albumi = dohvatiSveIzStorage();
    return { success: true, data: [...albumi] };
}

// Dohvati jedan album po šifri
async function getBySifra(sifra) {
    const albumi = dohvatiSveIzStorage();
    const album = albumi.find(s => s.sifra === parseInt(sifra));
    return { success: true, data: album };
}

// 2/4 Create - dodaj novi album
async function dodaj(album) {
    const albumi = dohvatiSveIzStorage();

    if (albumi.length === 0) {
        album.sifra = 1;
    } else {
        const maxSifra = Math.max(...albumi.map(s => s.sifra));
        album.sifra = maxSifra + 1;
    }

    albumi.push(album);
    spremiUStorage(albumi);
    return { success: true, data: album };
}

// 3/4 Update - promjeni postojeći album
async function promjeni(sifra, podaci) {
    const albumi = dohvatiSveIzStorage();
    const index = albumi.findIndex(s => s.sifra === parseInt(sifra));   

    if (index !== -1) {
        albumi[index] = { ...albumi[index], ...podaci, sifra: parseInt(sifra) };
        spremiUStorage(albumi);
        return { success: true, data: albumi[index] };
    }
    return { success: false, message: 'Album nije pronađen' };
}

// 4/4 Delete - obriši album
async function obrisi(sifra) {
    let albumi = dohvatiSveIzStorage();
    albumi = albumi.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(albumi);
    return { success: true, message: 'Obrisano' };
}

// NOVO: Straničenje (Paginacija)
async function getPage(page = 1, pageSize = 8) {
    const albumi = dohvatiSveIzStorage();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
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