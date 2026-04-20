import IzvodacServiceMemorija from "./IzvodacServiceMemorija";
import { DATA_SOURCE } from "../../constants";
import IzvodacServiceLocalStorage from "./IzvodacServiceLocalStorage";

let Servis = null;

// 1. Odabir aktivnog servisa na temelju konfiguracije
switch (DATA_SOURCE) {
    case 'memorija':
        Servis = IzvodacServiceMemorija;
        break;
    case 'localStorage':
        Servis = IzvodacServiceLocalStorage;
        break;
    default:
        Servis = null;
}

// 2. Definiranje defaultnog ponašanja ako servis nije učitan
const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (izvodac) => { console.error("IzvodacService: Servis nije učitan"); },
    promjeni: async (sifra, izvodac) => { console.error("IzvodacService: Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("IzvodacService: Servis nije učitan"); },
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

// 4. Export metoda prema vanjskom svijetu (komponentama)
export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (izvodac) => AktivniServis.dodaj(izvodac),
    promjeni: (sifra, izvodac) => AktivniServis.promjeni(sifra, izvodac),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
    // NOVO: Dodana podrška za straničenje
    getPage: (page, pageSize) => AktivniServis.getPage(page, pageSize)
};