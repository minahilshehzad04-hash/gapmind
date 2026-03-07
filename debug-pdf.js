const pdfParse = require('pdf-parse');

console.log('--- PDF PARSE DEBUG ---');
console.log('Type of pdfParse:', typeof pdfParse);
console.log('Keys of pdfParse:', Object.keys(pdfParse || {}));
if (pdfParse && pdfParse.default) {
    console.log('Type of pdfParse.default:', typeof pdfParse.default);
}
console.log('--- END DEBUG ---');

async function test() {
    try {
        const pf = typeof pdfParse === 'function' ? pdfParse : (pdfParse && pdfParse.default);
        console.log('Resolved parse function type:', typeof pf);
    } catch (e) {
        console.log('Error resolving function:', e.message);
    }
}

test();
