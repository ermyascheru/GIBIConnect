const academicCalendarService = require('../services/academic_calendar.service');
const { academicCalendarSchema } = require('../schemas/academic_calendar.schema');

exports.getCalendarsByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const events = await academicCalendarService.getCalendarsByInstitution(institutionId);

        res.json({
            data: events,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

exports.createCalendar = async (req, res, next) => {
    try {
        const { error, value } = academicCalendarSchema.validate(req.body || {});
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: { code: 'VALIDATION_ERROR', message: error.details[0].message }
            });
        }

        const newEvent = await academicCalendarService.createCalendar(value);

        res.status(201).json({
            data: newEvent,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};