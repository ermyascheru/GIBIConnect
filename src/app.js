const express = require('express');
const cors = require('cors');

const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middleware/errorHandler');
const institutionRoutes = require('./routes/institution.routes');
const userRoutes = require('./routes/user.routes');
const admissionRoutes = require('./routes/admission.routes');
const calendarRoutes = require('./routes/academic_calendar.routes');
const scholarshipRoutes = require('./routes/scholarship.routes');
const programRoutes = require('./routes/program.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/academic-calendar', calendarRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/programs', programRoutes);
app.use(errorHandler);

app.listen(env.PORT, function(){
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
})
