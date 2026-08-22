const fs = require("fs");

const path = require("path");

const TEMPLATE_FOLDER = path.join(__dirname, "../templates");

let templateMap = new Map();

function loadTemplates() {
  const files = fs.readdirSync(TEMPLATE_FOLDER);

  const map = new Map();

  for (const file of files) {
    if (!file.endsWith(".template.js")) {
      continue;
    }

    const filePath = path.join(TEMPLATE_FOLDER, file);

    delete require.cache[require.resolve(filePath)];

    const template = require(filePath);

    if (!template.id || !template.html || !template.css) {
      console.warn(`Invalid invoice template: ${file}`);

      continue;
    }

    map.set(template.id, template);
  }

  templateMap = map;

  console.log(`Loaded ${templateMap.size} invoice templates`);
}

function getTemplates() {
  return Array.from(templateMap.values());
}

function getTemplate(templateId) {
  return templateMap.get(templateId);
}

function getTemplateMetadata() {
  return getTemplates()
    .map((template) => ({
      id: template.id,

      name: template.name,

      category: template.category,

      thumbnail: template.thumbnail,

      isFree: Boolean(template.isFree),
    }))

    .sort((a, b) => Number(b.isFree) - Number(a.isFree));
}

loadTemplates();

module.exports = {
  getTemplates,
  getTemplate,
  getTemplateMetadata,
  loadTemplates,
};
