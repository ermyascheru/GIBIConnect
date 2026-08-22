const institutionsRepository = require('../repositories/institutions.repository');
const facultiesRepository = require('../repositories/faculties.repository');
const departmentsRepository = require('../repositories/departments.repository');
const programsRepository = require('../repositories/programs.repository');
const admissionsRepository = require('../repositories/admissions.repository');
const tuitionRepository = require('../repositories/tuition.repository');
const scholarshipsRepository = require('../repositories/scholarships.repository');
const facilitiesRepository = require('../repositories/facilities.repository');
const reviewsRepository = require('../repositories/reviews.repository');
const resourcesRepository = require('../repositories/resources.repository');
const { successResponse } = require('../utils/response');

const getAllInstitutions = async (req, res, next) => {
  try {
    const data = await institutionsRepository.findAll(req.query);
    return successResponse(res, 200, 'Institutions retrieved successfully', data.rows, {
      total: data.totalCount,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages
    });
  } catch (err) {
    next(err);
  }
};

const getInstitutionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let data;
    if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      data = await institutionsRepository.findById(id);
    } else {
      data = await institutionsRepository.findBySlug(id);
    }

    if (!data) {
      const err = new Error('Institution not found');
      err.statusCode = 404;
      throw err;
    }
    return successResponse(res, 200, 'Institution profile retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionFaculties = async (req, res, next) => {
  try {
    const data = await facultiesRepository.findByInstitutionId(req.params.id);
    return successResponse(res, 200, 'Faculties retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionPrograms = async (req, res, next) => {
  try {
    const data = await programsRepository.findByInstitutionId(req.params.id);
    return successResponse(res, 200, 'Programs retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionAdmissions = async (req, res, next) => {
  try {
    const data = await admissionsRepository.findByInstitutionId(req.params.id);
    return successResponse(res, 200, 'Admissions retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionTuition = async (req, res, next) => {
  try {
    const data = await tuitionRepository.findByInstitutionId(req.params.id);
    return successResponse(res, 200, 'Tuition fees retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionScholarships = async (req, res, next) => {
  try {
    const data = await scholarshipsRepository.findByInstitutionId(req.params.id);
    return successResponse(res, 200, 'Scholarships retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionFacilities = async (req, res, next) => {
  try {
    const data = await facilitiesRepository.findByInstitutionId(req.params.id);
    return successResponse(res, 200, 'Facilities retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionReviews = async (req, res, next) => {
  try {
    const data = await reviewsRepository.findByInstitution(req.params.id);
    return successResponse(res, 200, 'Reviews retrieved', data);
  } catch (err) {
    next(err);
  }
};

const getInstitutionResources = async (req, res, next) => {
  try {
    const data = await resourcesRepository.findAll({ ...req.query, institution_id: req.params.id });
    return successResponse(res, 200, 'Resources retrieved', data.rows, {
      total: data.totalCount,
      page: data.page,
      limit: data.limit
    });
  } catch (err) {
    next(err);
  }
};

const createInstitution = async (req, res, next) => {
  try {
    const data = await institutionsRepository.create(req.body);
    return successResponse(res, 201, 'Institution created successfully', data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllInstitutions,
  getInstitutionById,
  getInstitutionFaculties,
  getInstitutionPrograms,
  getInstitutionAdmissions,
  getInstitutionTuition,
  getInstitutionScholarships,
  getInstitutionFacilities,
  getInstitutionReviews,
  getInstitutionResources,
  createInstitution
};
