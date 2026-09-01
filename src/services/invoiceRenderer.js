const Handlebars = require("handlebars");

const FONT_STACKS = {
  Inter: "Inter, Arial, sans-serif",

  Arial: "Arial, sans-serif",

  Helvetica: "Helvetica, Arial, sans-serif",

  Georgia: "Georgia, serif",

  Times: "'Times New Roman', serif",
};

function safeColor(color, fallback) {
  if (typeof color === "string" && /^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  return fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function money(currency, value) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
    }).format(Number(value || 0));
  } catch {
    return `${currency} ${Number(value || 0).toFixed(2)}`;
  }
}

function createViewModel(invoice) {
  const items = (invoice.items || []).map((item) => {
    const quantity = Number(item.quantity || 0);

    const rate = Number(item.rate || 0);

    return {
      ...item,

      quantity,

      rate,

      rateFormatted: money(invoice.currency, rate),

      amountFormatted: money(invoice.currency, quantity * rate),
    };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );

  const taxRate = Number(invoice.taxRate || 0);

  const taxAmount = subtotal * (taxRate / 100);

  const discount = Number(invoice.discount || 0);

  const total = Math.max(0, subtotal + taxAmount - discount);

  return {
    ...invoice,

    items,

    taxRate,

    discount,

    subtotalFormatted: money(invoice.currency, subtotal),

    taxAmountFormatted: money(invoice.currency, taxAmount),

    discountFormatted: money(invoice.currency, discount),

    totalFormatted: money(invoice.currency, total),
  };
}

function renderInvoice({ invoice, template, appearance = {} }) {
  const defaults = template.defaultAppearance || {};

  const fontSize = clamp(
    appearance.fontSize ?? defaults.fontSize ?? 14,
    10,
    20,
  );

  const fontFamily =
    FONT_STACKS[appearance.fontFamily ?? defaults.fontFamily] ||
    FONT_STACKS.Inter;

  const accentColor = safeColor(
    appearance.accentColor,
    defaults.accentColor || "#2563eb",
  );

  const textColor = safeColor(
    appearance.textColor,
    defaults.textColor || "#172033",
  );

  const compiled = Handlebars.compile(template.html);

  const markup = compiled(createViewModel(invoice));

  return `
<!doctype html>

<html lang="en">

<head>

<meta charset="utf-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
/>

<style>

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

@page {
  size: A4;
  margin: 0;
}

:root {

  --invoice-accent:
    ${accentColor};

  --invoice-text:
    ${textColor};

  --invoice-font-size:
    ${fontSize}px;

  --invoice-font-family:
    ${fontFamily};
}

body {

  background: white;

  color:
    var(--invoice-text);

  font-family:
    var(--invoice-font-family);

  font-size:
    var(--invoice-font-size);

  -webkit-print-color-adjust:
    exact !important;

  print-color-adjust:
    exact !important;
}

.invoice-page {

  width: 210mm;

  min-height: 297mm;

  background: white;
}

thead {
  display:
    table-header-group;
}

tfoot {
  display:
    table-footer-group;
}

tr,
.invoice-totals,
footer {

  break-inside: avoid;

  page-break-inside:
    avoid;
}

${template.css}

</style>

</head>

<body>

${markup}

</body>

</html>
`;
}

module.exports = {
  renderInvoice,
};
