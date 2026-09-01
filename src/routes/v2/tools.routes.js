const express = require("express");
const router = express.Router();
const toolsController = require("../../controllers/tools.controller");

router.get("/templates", toolsController.listTemplates);

router.get("/templates/:templateId", toolsController.getTemplateDefinition);

router.post("/pdf", toolsController.downloadPdf);

module.exports = router;
