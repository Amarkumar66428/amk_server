const puppeteer = require("puppeteer");

let browserInstance = null;

async function getBrowser() {
  if (
    browserInstance &&
    browserInstance.connected
  ) {
    return browserInstance;
  }

  console.log(
    "Puppeteer Chrome:",
    puppeteer.executablePath()
  );

  browserInstance =
    await puppeteer.launch({
      headless: true,

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

  browserInstance.on(
    "disconnected",
    () => {
      browserInstance = null;
    }
  );

  return browserInstance;
}


async function createPdf(html) {
  const browser =
    await getBrowser();

  let page = null;

  try {
    page =
      await browser.newPage();

    await page.setJavaScriptEnabled(
      false
    );

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1,
    });

    await page.setContent(
      html,
      {
        waitUntil: "load",
        timeout: 30000,
      }
    );

    await page.emulateMediaType(
      "screen"
    );

    await page.evaluate(
      async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      }
    ).catch(() => {});

    const pdfBytes =
      await page.pdf({
        printBackground: true,

        preferCSSPageSize: true,

        waitForFonts: true,

        margin: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },

        timeout: 30000,
      });

    return Buffer.from(
      pdfBytes
    );
  } finally {
    if (
      page &&
      !page.isClosed()
    ) {
      await page
        .close()
        .catch(() => {});
    }
  }
}

module.exports = {
  createPdf,
};