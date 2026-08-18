const express = require('express');
const cors = require('cors');

// Middleware
const errorHandler = require('./middleware/error.middleware');

// Routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const institutionsRoutes = require('./routes/institutions.routes');
const facultiesRoutes = require('./routes/faculties.routes');
const departmentsRoutes = require('./routes/departments.routes');
const programsRoutes = require('./routes/programs.routes');
const admissionsRoutes = require('./routes/admissions.routes');
const scholarshipsRoutes = require('./routes/scholarships.routes');
const calendarRoutes = require('./routes/academic_calendar.routes');

const app = express();

app.use(cors());
app.use(express.json());

// API Base Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/institutions', institutionsRoutes);
app.use('/api/v1/faculties', facultiesRoutes);
app.use('/api/v1/departments', departmentsRoutes);
app.use('/api/v1/programs', programsRoutes);
app.use('/api/v1/admissions', admissionsRoutes);
app.use('/api/v1/scholarships', scholarshipsRoutes);
app.use('/api/v1/academic-calendar', calendarRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;