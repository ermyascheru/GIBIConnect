import { ResearchService } from '../services/research.service.js';

export const getPublications = async (req, res, next) => {
  try {
    const publications = await ResearchService.listPublications(req.query);
    res.json({ success: true, data: publications });
  } catch (error) {
    next(error);
  }
};