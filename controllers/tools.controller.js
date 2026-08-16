const puppeteer = require("puppeteer")

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true, // Use standard headless
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        // REMOVED '--single-process' -> This causes Windows crashes
      ],
    });

    browserInstance.on('disconnected', () => {
      browserInstance = null;
    });
  }
  return browserInstance;
}
const pdfDownload = async (req, res) => {
 const { htmlContent, filename = 'document.pdf' } = req.body;

  if (!htmlContent || typeof htmlContent !== 'string') {
    return res.status(400).json({ error: 'Valid htmlContent string is required.' });
  }

  let page = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // 1. Set viewport
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });

    // 2. Use 'domcontentloaded' or 'load' to avoid infinite hanging
    await page.setContent(htmlContent, {
      waitUntil: 'load',
      timeout: 30000,
    });

    // 3. Wait for fonts safely with a fallback
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    }).catch(() => {});

    // 4. Force screen media emulation
    await page.emulateMediaType('screen');

    // 5. Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '10mm',
        right: '10mm',
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Failed:', error);

    // If browser crashed mid-generation, ensure instance is reset
    if (browserInstance && !browserInstance.connected) {
      browserInstance = null;
    }

    return res.status(500).json({
      error: 'Failed to generate PDF',
      details: error.message,
    });
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
};

module.exports = {
  pdfDownload,
};
