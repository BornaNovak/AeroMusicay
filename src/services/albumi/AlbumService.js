import { DATA_SOURCE } from "../../constants";
import AlbumServiceLocalStorage from "./AlbumServiceLocalStorage";
import AlbumServiceMemorija from "./AlbumServiceMemorija";

let Servis = null;

switch (DATA_SOURCE) {
    case 'memorija':
        Servis = AlbumServiceMemorija;
        break;
    case 'localStorage':
        Servis = AlbumServiceLocalStorage;
        break;
    default:
        Servis = null;
}

const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (album) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, album) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (album) => AktivniServis.dodaj(album),
    promjeni: (sifra, album) => AktivniServis.promjeni(sifra, album),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};