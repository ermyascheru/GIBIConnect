const facilitiesRepository = require("../repositories/facilities.repository");

exports.getFacilitiesByInstitution = async (req, res, next) => {
  try {
    const { institutionId } = req.params;
    const facilities = await facilitiesRepository.findByInstitution(institutionId);
    res.json({ success: true, data: facilities });
  } catch (err) {
    next(err);
  }
};

exports.createFacility = async (req, res, next) => {
  try {
    const { institutionId, name, description, type } = req.body;
    const facility = await facilitiesRepository.create({ institutionId, name, description, type });
    res.status(201).json({ success: true, data: facility });
  } catch (err) {
    next(err);
  }
};
