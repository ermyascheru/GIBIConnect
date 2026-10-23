import express from 'express';
import { prisma } from '../db.js';

export const institutionsRouter = express.Router();

// GET /api/v1/institutions
institutionsRouter.get('/', async (req, res) => {
  try {
    const { region, ownership, type, search } = req.query;

    const where: any = {};
    if (region) where.region = String(region);
    if (ownership) where.ownership = String(ownership);
    if (type) where.type = String(type);
    if (search) {
      where.OR = [
        { nameEn: { contains: String(search), mode: 'insensitive' } },
        { nameAm: { contains: String(search), mode: 'insensitive' } },
        { code: { contains: String(search), mode: 'insensitive' } },
        { city: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const institutions = await prisma.institution.findMany({
      where,
      include: {
        _count: {
          select: {
            faculties: true,
            facilities: true,
            scholarships: true,
            documents: true,
          },
        },
      },
      orderBy: { nameEn: 'asc' },
    });

    res.json({
      success: true,
      data: institutions,
      count: institutions.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/institutions/:id (Full 8-Tab Campus Details)
institutionsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findFirst({
      where: {
        OR: [{ id }, { code: id.toUpperCase() }],
      },
      include: {
        campuses: true,
        faculties: {
          include: {
            departments: {
              include: {
                programs: {
                  include: {
                    admissionCutoffs: true,
                    tuitionRates: true,
                  },
                },
              },
            },
          },
        },
        facilities: {
          include: {
            images: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        scholarships: true,
        calendarEvents: {
          orderBy: { createdAt: 'asc' },
        },
        documents: {
          orderBy: { downloadCount: 'desc' },
        },
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!institution) {
      return res.status(404).json({
        success: false,
        error: `Institution with ID or code '${id}' not found.`,
      });
    }

    res.json({
      success: true,
      data: institution,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
