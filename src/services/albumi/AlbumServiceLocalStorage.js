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

export default { get, getBySifra, dodaj, promjeni, obrisi };