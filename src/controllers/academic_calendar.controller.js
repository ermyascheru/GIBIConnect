const academicCalendarService = require('../services/academic_calendar.service');
const { successResponse } = require('../utils/response');

const getEvents = async (req, res, next) => {
    try {
        const targetId = req.query.institutionId || req.query.institution_id || req.params.institutionId;
        const id = typeof targetId === 'string' && targetId.trim() ? targetId : null;
        const data = id ? await academicCalendarService.getEventsByInstitution(id) : [];
        return successResponse(res, 200, 'Academic calendar events retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

const createEvent = async (req, res, next) => {
    try {
        const data = await academicCalendarService.createEvent(req.body);
        return successResponse(res, 201, 'Calendar event created successfully', data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEvents,
    getAllEvents: getEvents,
    createEvent
};