const STORAGE_KEY = 'albumi';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const albumi = dohvatiSveIzStorage();
    return {success: true,  data: [...albumi] };
}

async function getBySifra(sifra) {
    const albumi = dohvatiSveIzStorage();
    const album = albumi.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: album };
}

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
    return { data: album };
}


async function promjeni(sifra, album) {
    const albumi = dohvatiSveIzStorage();
    const index = albumi.findIndex(s => s.sifra === parseInt(sifra));   

    if (index !== -1) {
        albumi[index] = { ...albumi[index], ...album};
        spremiUStorage(albumi);
    }
    return { data: albumi[index] };
}


async function obrisi(sifra) {
    let albumi = dohvatiSveIzStorage();
    albumi = albumi.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(albumi);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};