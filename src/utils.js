// ovdje dođu funkcije koje koristim na više mjesta
export const formatirajTrajanje = (sekundi) => {
    if(!sekundi) return "0:00"
    const ukupnosekundi = sekundi % 60
    const minuta = Math.floor(sekundi / 60)
    return `${minuta}:${ukupnosekundi.toString().padStart(2, '0')}`
}