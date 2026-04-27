import IzvodacService from "../izvodaci/IzvodacService";

const STORAGE_KEY = 'albumi';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    return { success: true, data: dohvatiSveIzStorage() };
}

async function getBySifra(sifra) {
    const albumi = dohvatiSveIzStorage();
    const album = albumi.find(s => s.sifra === parseInt(sifra));
    return { success: true, data: album };
}

async function dodaj(album) {
    const albumi = dohvatiSveIzStorage();
    album.sifra = albumi.length === 0 ? 1 : Math.max(...albumi.map(s => s.sifra)) + 1;
    albumi.push(album);
    spremiUStorage(albumi);
    return { success: true, data: album };
}

async function promjeni(sifra, podaci) {
    const albumi = dohvatiSveIzStorage();
    const index = albumi.findIndex(s => s.sifra === parseInt(sifra));   
    if (index !== -1) {
        albumi[index] = { ...albumi[index], ...podaci, sifra: parseInt(sifra) };
        spremiUStorage(albumi);
        return { success: true, data: albumi[index] };
    }
    return { success: false };
}

async function obrisi(sifra) {
    let albumi = dohvatiSveIzStorage();
    albumi = albumi.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(albumi);
    return { success: true };
}

// --- NOVO: DODANA FUNKCIJA KOJA NEDOSTAJE ---
async function getPage(page = 1, pageSize = 8, sortColumn = 'naziv', sortDirection = 'asc') {
    let sviAlbumi = dohvatiSveIzStorage();

    const izvodjacOdgovor = await IzvodacService.get();

    const izvodacPodaci = izvodjacOdgovor.data

    sviAlbumi = sviAlbumi.map(album => {
        // Pronađi izvođača čija se šifra podudara s onom u albumu
        const pronadjeniIzvodac = izvodacPodaci.find(i => i.sifra === album.izvodac);
        
        return {
            ...album,
            // Ako je izvođač pronađen, stavi njegov naziv, inače zadrži staru vrijednost ili stavi 'Nepoznato'
            izvodac: pronadjeniIzvodac ? pronadjeniIzvodac.naziv : album.izvodac
        };
    });

    // 1. Sortiranje (Globalno - na svim podacima)
    sviAlbumi.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        let res = 0;
        if (sortColumn === 'datumIzdavanja') {
            res = new Date(aVal || 0) - new Date(bVal || 0);
        } else {
            res = String(aVal || "").localeCompare(String(bVal || ""), 'hr');
        }

        return sortDirection === 'asc' ? res : -res;
    });

    // 2. Paginacija
    const start = (page - 1) * pageSize;
    const podaciZaStranicu = sviAlbumi.slice(start, start + pageSize);

    return {
        success: true,
        data: podaciZaStranicu,
        totalPages: Math.ceil(sviAlbumi.length / pageSize),
        totalItems: sviAlbumi.length
    };
}

// NE ZABORAVI DODATI getPage U EXPORT!
export default { get, getBySifra, dodaj, promjeni, obrisi, getPage };