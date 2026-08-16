const express = require('express');
const router = express.Router();
const toolsController = require('../../controllers/tools.controller');

router.post("/pdf_download", toolsController.pdfDownload);

module.exports = router;
