import { DATA_SOURCE } from "../../constants";
import ZanrServiceMemorija from "./ZanrServiceMemorija";
import ZanrServiceLocalStorage from "./ZanrServiceLocalStorage";

let Servis = null;

// 1. Odabir servisa
switch (DATA_SOURCE) {
    case 'memorija':
        Servis = ZanrServiceMemorija;
        break;
    case 'localStorage':
        Servis = ZanrServiceLocalStorage;
        break;
    default:
        Servis = null;
}

// 2. Definiranje defaultnog ponašanja (ako servis nije učitan)
const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (zanr) => { console.error("ZanrService: Servis nije učitan"); },
    promjeni: async (sifra, zanr) => { console.error("ZanrService: Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("ZanrService: Servis nije učitan"); },
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

// 4. Export metoda prema van
export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (zanr) => AktivniServis.dodaj(zanr),
    promjeni: (sifra, zanr) => AktivniServis.promjeni(sifra, zanr),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
    // Dodano za straničenje
    getPage: (page, pageSize) => AktivniServis.getPage(page, pageSize)
};