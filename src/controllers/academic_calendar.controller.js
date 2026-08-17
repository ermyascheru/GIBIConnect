const calendarService = require('../services/academic_calendar.service');
const { createCalendarSchema, updateCalendarSchema } = require('../schemas/academic_calendar.schema');

const getByInstitution = async (req, res, next) => {
    try {
        const { institutionId } = req.params;
        const events = await calendarService.getEventsByInstitution(institutionId);
        return res.status(200).json({ data: events, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const create = async (req, res, next) => {
    try {
        const { error, value } = createCalendarSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: error.details[0].message });
        }
        const newEvent = await calendarService.createEvent(value);
        return res.status(201).json({ data: newEvent, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

const Joi = require('joi');

// Add UUID parameter validation check
const uuidSchema = Joi.string().uuid().required();

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Validate URL parameter
        const { error: idError } = uuidSchema.validate(id);
        if (idError) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Invalid UUID format provided in route path'
            });
        }

        const { error, value } = updateCalendarSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: error.details[0].message
            });
        }

        const updated = await calendarService.updateEvent(id, value);
        if (!updated) {
            return res.status(404).json({
                data: null,
                meta: { timestamp: new Date().toISOString() },
                error: 'Calendar event not found'
            });
        }

        return res.status(200).json({
            data: updated,
            meta: { timestamp: new Date().toISOString() },
            error: null
        });
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await calendarService.deleteEvent(id);
        if (!deleted) {
            return res.status(404).json({ data: null, meta: { timestamp: new Date().toISOString() }, error: 'Calendar event not found' });
        }
        return res.status(200).json({ data: deleted, meta: { timestamp: new Date().toISOString() }, error: null });
    } catch (err) {
        next(err);
    }
};

module.exports = { getByInstitution, create, update, remove };