import IzvodacServiceMemorija from "./IzvodacServiceMemorija";
import { DATA_SOURCE } from "../../constants";
import IzvodacServiceLocalStorage from "./IzvodacServiceLocalStorage";

let Servis = null;


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


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (izvodac) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, izvodac) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};



const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (izvodac) => AktivniServis.dodaj(izvodac),
    promjeni: (sifra, izvodac) => AktivniServis.promjeni(sifra, izvodac),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};