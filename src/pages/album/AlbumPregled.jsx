export default function AlbumPregled(){
    const [albumi, setAlbumi] = useState([])
    const navigate = useNavigate();
    useEffect(() => {ucitajAlbume()}, [])

    async function ucitajAlbume(){
        await AlbumService.get().then((odgovor) => {
            if(!odgovor.success){
                alert('Nije implementiran album')
                return
            }
            setAlbumi(odgovor.data)
        })
    }

    async function obrisi(sifra){
        if(!confirm('Jeste li sigurni da zelite obrisati?')){
            return
        }
        await AlbumService.obrisi(sifra)
        ucitajIzvodace()
    }
}