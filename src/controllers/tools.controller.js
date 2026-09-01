const { z } = require("zod");

const {
  getTemplate,
  getTemplateMetadata,
} = require("../services/templateService");

const { renderInvoice } = require("../services/invoiceRenderer");

const { createPdf } = require("../services/pdfService");

const itemSchema = z.object({
  id: z.string().optional(),

  description: z.string().max(500).default(""),

  quantity: z.coerce.number().min(0).max(100000),

  rate: z.coerce.number().min(0).max(100000000),
});

const partySchema = z.object({
  name: z.string().max(200),

  email: z.string().max(320),

  address: z.string().max(1000),
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().max(100),

  invoiceDate: z.string().max(30),

  dueDate: z.string().max(30).optional().default(""),

  currency: z.enum(["INR", "USD", "EUR", "GBP"]),

  sender: partySchema,

  client: partySchema,

  items: z.array(itemSchema).min(1).max(100),

  taxRate: z.coerce.number().min(0).max(100),

  discount: z.coerce.number().min(0),

  notes: z.string().max(5000).optional().default(""),
});

const appearanceSchema = z.object({
  fontFamily: z.string().max(50).optional(),

  fontSize: z.coerce.number().min(10).max(20).optional(),

  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),

  textColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
});

function sanitizeFilename(value) {
  let filename = String(value || "invoice.pdf")
    .replace(/[\r\n"]/g, "")

    .replace(/[<>:"/\\|?*]/g, "_")

    .trim();

  if (!filename.toLowerCase().endsWith(".pdf")) {
    filename += ".pdf";
  }

  return filename;
}

async function listTemplates(req, res) {
  return res.json({
    templates: getTemplateMetadata(),
  });
}

async function getTemplateDefinition(req, res) {
  const template = getTemplate(req.params.templateId);

  if (!template) {
    return res.status(404).json({
      error: "Template not found",
    });
  }

  return res.json({
    template: {
      id: template.id,

      name: template.name,

      category: template.category,

      isFree: template.isFree,

      defaultAppearance: template.defaultAppearance,

      html: template.html,

      css: template.css,
    },
  });
}

async function downloadPdf(req, res) {
  try {
    const templateId = z.string().min(1).parse(req.body.templateId);

    const invoice = invoiceSchema.parse(req.body.invoice);

    const appearance = appearanceSchema.parse(req.body.appearance || {});

    const template = getTemplate(templateId);

    if (!template) {
      return res.status(404).json({
        error: "Invoice template not found",
      });
    }

    /*
     * Optional:
     * verify paid template entitlement here.
     */
    if (!template.isFree && !req.user) {
      return res.status(403).json({
        error: "Template requires access",
      });
    }

    const html = renderInvoice({
      invoice,
      template,
      appearance,
    });

    const pdfBuffer = await createPdf(html);

    const filename = sanitizeFilename(req.body.filename);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
        filename,
      )}`,
    );

    res.setHeader("Content-Length", pdfBuffer.length);

    res.setHeader("Cache-Control", "no-store");

    return res.end(pdfBuffer);
  } catch (error) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid invoice data",

        issues: error.issues,
      });
    }

    console.error("Invoice PDF generation failed:", error);

    return res.status(500).json({
      error: "Unable to generate invoice",
    });
  }
}

module.exports = {
  listTemplates,
  getTemplateDefinition,
  downloadPdf,
};
