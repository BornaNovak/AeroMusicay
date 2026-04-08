import PjesmaServiceMemorija from "./PjesmaServiceMemorija";
import { DATA_SOURCE } from "../../constants";
import PjesmaServiceLocalStorage from "./PjesmaServiceLocalStorage";

let Servis = null;

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

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (pjesma) => { console.error("PjesmaService: Servis nije učitan"); },
    promjeni: async (sifra, pjesma) => { console.error("PjesmaService: Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("PjesmaService: Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (pjesma) => AktivniServis.dodaj(pjesma),
    promjeni: (sifra, pjesma) => AktivniServis.promjeni(sifra, pjesma),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};