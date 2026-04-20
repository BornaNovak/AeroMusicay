import { DATA_SOURCE } from "../../constants";
import AlbumServiceLocalStorage from "./AlbumServiceLocalStorage";
import AlbumServiceMemorija from "./AlbumServiceMemorija";

let Servis = null;

// 1. Odabir servisa ovisno o izvoru podataka
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

// 2. Definiranje defaultnog ponašanja ako Servis nije pronađen
const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (album) => { console.error("AlbumService: Servis nije učitan"); },
    promjeni: async (sifra, album) => { console.error("AlbumService: Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("AlbumService: Servis nije učitan"); },
    // Dodano za straničenje
    getPage: async (page, pageSize) => ({ 
        success: false, 
        data: [], 
        totalPages: 0, 
        totalItems: 0 
    })
};

// 3. Postavljanje aktivnog servisa
const AktivniServis = Servis || PrazanServis;

// 4. Export svih metoda
export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (album) => AktivniServis.dodaj(album),
    promjeni: (sifra, album) => AktivniServis.promjeni(sifra, album),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
    // Dodano za straničenje
    getPage: (page, pageSize) => AktivniServis.getPage(page, pageSize)
};