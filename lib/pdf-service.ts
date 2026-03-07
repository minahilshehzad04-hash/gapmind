import { getDocumentProxy, extractText as extractPdfText } from 'unpdf';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        // Load the PDF document
        const pdf = await getDocumentProxy(new Uint8Array(buffer));

        // Extract text using unpdf's helper
        const { text } = await extractPdfText(pdf);

        return text.join('\n');
    } catch (error: unknown) {
        console.error('Error parsing PDF with unpdf:', error);
        const message = error instanceof Error ? error.message : "PDF extraction failed";
        throw new Error('Failed to extract text from PDF: ' + message);
    }
}
