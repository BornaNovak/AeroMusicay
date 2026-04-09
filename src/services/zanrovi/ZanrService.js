import { DATA_SOURCE } from "../../constants";
import ZanrServiceMemorija from "./ZanrServiceMemorija";
import ZanrServiceLocalStorage from "./ZanrServiceLocalStorage";

let Servis = null;
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

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (zanr) => { console.error("ZanrService: Servis nije učitan"); },
    promjeni: async (sifra, zanr) => { console.error("ZanrService: Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("ZanrService: Servis nije učitan"); }
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (zanr) => AktivniServis.dodaj(zanr),
    promjeni: (sifra, zanr) => AktivniServis.promjeni(sifra, zanr),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};