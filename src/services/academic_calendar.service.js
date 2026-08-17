const academicCalendarRepository = require('../repositories/academic_calendar.repository');

const getCalendarsByInstitution = async (institutionId) => {
    return await academicCalendarRepository.findByInstitutionId(institutionId);
};

const createCalendar = async (calendarData) => {
    return await academicCalendarRepository.create(calendarData);
};

module.exports = {
    getCalendarsByInstitution,
    createCalendar
};