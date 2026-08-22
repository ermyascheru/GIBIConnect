const Joi = require('joi');

const createResourceSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  description: Joi.string().allow('', null).optional(),
  resource_type: Joi.string().valid('document', 'spreadsheet', 'presentation', 'ebook', 'video', 'audio', 'research').required(),
  mime_type: Joi.string().max(120).required(),
  file_extension: Joi.string().valid('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'epub', 'mp4', 'webm', 'mov', 'mp3', 'wav', 'm4a').required(),
  original_filename: Joi.string().max(255).required(),
  file_size_bytes: Joi.number().integer().min(0).required(),
  storage_provider: Joi.string().max(50).default('local'),
  storage_bucket: Joi.string().max(100).allow('', null).optional(),
  storage_key: Joi.string().max(500).required(),
  checksum: Joi.string().max(64).allow('', null).optional(),
  institution_id: Joi.string().uuid().allow(null).optional(),
  faculty_id: Joi.string().uuid().allow(null).optional(),
  department_id: Joi.string().uuid().allow(null).optional(),
  program_id: Joi.string().uuid().allow(null).optional(),
  publication_year: Joi.number().integer().min(1800).max(2100).allow(null).optional(),
  language: Joi.string().max(10).default('en'),
  visibility: Joi.string().valid('public', 'restricted', 'private').default('public'),
  category_ids: Joi.array().items(Joi.string().uuid()).optional(),
  tag_ids: Joi.array().items(Joi.string().uuid()).optional(),
  // For research type
  abstract: Joi.string().allow('', null).optional(),
  research_type: Joi.string().valid('paper', 'thesis', 'dissertation', 'report', 'conference_paper', 'journal_article', 'other').optional(),
  journal_name: Joi.string().max(255).allow('', null).optional(),
  conference_name: Joi.string().max(255).allow('', null).optional(),
  doi: Joi.string().max(100).allow('', null).optional(),
  keywords: Joi.array().items(Joi.string()).optional()
});

module.exports = {
  createResourceSchema
};
