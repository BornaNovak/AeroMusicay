import PjesmaServiceMemorija from "./PjesmaServiceMemorija";
import { DATA_SOURCE } from "../../constants";
import PjesmaServiceLocalStorage from "./PjesmaServiceLocalStorage";

let Servis = null;

// 1. Odabir servisa
switch (DATA_SOURCE) {
    case 'memorija':
        Servis = PjesmaServiceMemorija;
        break;
    case 'localStorage':
        Servis = PjesmaServiceLocalStorage;
        break;
    default:
        Servis = null;
}

// 2. Definiranje defaultnog ponašanja
const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (pjesma) => { console.error("PjesmaService: Servis nije učitan"); },
    promjeni: async (sifra, pjesma) => { console.error("PjesmaService: Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("PjesmaService: Servis nije učitan"); }, // Ovdje ostaje
    getPage: async (page, pageSize, pretraga) => ({ success: false, data: [], totalPages: 0, totalItems: 0 }) // Dodano
};

// 3. Aktivni servis
const AktivniServis = Servis || PrazanServis;

// 4. Export
export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (pjesma) => AktivniServis.dodaj(pjesma),
    promjeni: (sifra, pjesma) => AktivniServis.promjeni(sifra, pjesma),
    obrisi: (sifra) => AktivniServis.obrisi(sifra), // Ovdje ostaje
    getPage: (page, pageSize, pretraga) => AktivniServis.getPage(page, pageSize, pretraga) // Dodano
};