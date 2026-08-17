const calendarRepository = require('../repositories/academic_calendar.repository');

const getEventsByInstitution = async (institutionId) => {
    return await calendarRepository.findByInstitutionId(institutionId);
};

const createEvent = async (data) => {
    return await calendarRepository.create(data);
};

const updateEvent = async (id, data) => {
    return await calendarRepository.update(id, data);
};

const deleteEvent = async (id) => {
    return await calendarRepository.deleteById(id);
};

module.exports = { getEventsByInstitution, createEvent, updateEvent, deleteEvent };