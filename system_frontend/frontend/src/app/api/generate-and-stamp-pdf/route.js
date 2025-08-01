import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const urlToConvert = searchParams.get('url');
  const stampsRaw = searchParams.get('stamps');
  const stampsData = stampsRaw ? JSON.parse(stampsRaw) : [];

  console.log("URL", urlToConvert )
  if (!urlToConvert) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Download the actual PDF file
    const response = await fetch(urlToConvert);
    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const stamp of stampsData) {
      const { pageIndex = 0 } = stamp;
      const page = pages[pageIndex];
      if (!page) continue;

      if (stamp.type === 'text') {
        const { text = '', x = 0, y = 0, size = 24, color = [0, 0, 0] } = stamp;
        page.drawText(text, {
          x,
          y,
          font,
          size,
          color: rgb(color[0], color[1], color[2]),
        });
      }

      if (stamp.type === 'image') {
        const {
          imageUrl,
          imageWidth = 300,
          imageHeight = 300,
          imageX = (page.getWidth() - imageWidth) / 2,
          imageY = (page.getHeight() - imageHeight) / 2,
          opacity = 1, // default no transparency
        } = stamp;

        const imgRes = await fetch(imageUrl);
        const imageBytes = await imgRes.arrayBuffer();
        const image = await pdfDoc.embedPng(imageBytes);

        page.drawImage(image, {
          x: imageX,
          y: imageY,
          width: imageWidth,
          height: imageHeight,
          opacity,
        });
      }
    }

    const modifiedPdf = await pdfDoc.save();

    return new Response(Buffer.from(modifiedPdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="stamped_document.pdf"',
      },
    });
  } catch (err) {
    console.error('Failed to stamp PDF:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate stamped PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
