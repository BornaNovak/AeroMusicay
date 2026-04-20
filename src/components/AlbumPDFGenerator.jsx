import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
// DODANO: Import tvoje funkcije iz utils.js
import { formatirajTrajanje } from '../utils';

export default function AlbumPDFGenerator({ album, izvodac, pjesme }) {

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    };


    const generirajPDF = async () => {
        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
            fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
        ]);

        const doc = new jsPDF();

        // Registracija fontova za podršku naših znakova (č, ć, ž...)
        doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

        doc.setFont('Roboto', 'normal');
        
        // Zaglavlje
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50); 
        doc.text('MUZIČKA KATALOGIZACIJA', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(102, 102, 102);
        doc.text('EVIDENCIJA ALBUMA, IZVOĐAČA I PJESAMA', 20, 27);

        // Naslov dokumenta
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`ALBUM: ${album.naziv.toUpperCase()}`, 20, 45);

        // Linija ispod naslova
        doc.setDrawColor(46, 125, 50);
        doc.setLineWidth(0.5);
        doc.line(20, 48, 190, 48);

        let yPosition = 60;

        // Podaci o albumu
        doc.setFontSize(14);
        doc.text('Podaci o albumu:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('Roboto', 'normal');
        doc.text(`Naziv albuma: ${album.naziv}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Datum izdavanja: ${new Date(album.datumIzdavanja).toLocaleDateString('hr-HR')}`, 25, yPosition);
        yPosition += 15;

        // Podaci o izvođaču
        doc.setFontSize(14);
        doc.setFont('Roboto', 'bold');
        doc.text('Izvođač:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('Roboto', 'normal');
        doc.text(`${izvodac ? izvodac.naziv : 'Nepoznato'}`, 25, yPosition);
        yPosition += 20;

        doc.setFontSize(14);
        doc.setFont('Roboto', 'bold');
        doc.text('Popis pjesama na albumu:', 20, yPosition);
        yPosition += 10;

        if (pjesme && pjesme.length > 0) {
            const tableData = pjesme.map((pjesma, index) => [
                index + 1,
                pjesma.naziv,
                formatirajTrajanje(pjesma.trajanje) || '-' 
            ]);

            autoTable(doc, {
                startY: yPosition,
                head: [['#', 'Naslov pjesme', 'Trajanje']],
                body: tableData,
                margin: { left: 20, right: 20 },
                styles: { font: 'Roboto', fontSize: 10 },
                headStyles: { fillColor: [46, 125, 50] },
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 30 }
                }
            });
        } else {
            doc.setFontSize(11);
            doc.setFont('Roboto', 'italic');
            doc.text('Nema dodanih pjesama za ovaj album.', 25, yPosition);
        }

        // Footer s brojem stranica
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Stranica ${i} od ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Otvaranje PDF-a
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    return generirajPDF;
}