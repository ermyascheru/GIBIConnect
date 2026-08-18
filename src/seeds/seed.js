const db = require('../config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('🌱 Starting database seed...');

        // 1. Seed Admin User
        const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
        await db.query(`
            INSERT INTO users (full_name, email, password_hash, role, status)
            VALUES ('Dr. Ermias Girma', 'admin@gibiconnect.edu.et', $1, 'admin', 'active')
            ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;
        `, [passwordHash]);
        console.log('✅ Admin user ready');

        // 2. Seed Institution
        const instRes = await db.query(`
            INSERT INTO institutions (name, slug, type, ownership, city, region, status)
            VALUES (
                'Addis Ababa University', 
                'addis-ababa-university', 
                'university', 
                'public', 
                'Addis Ababa', 
                'Addis Ababa', 
                'published'
            )
            ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id;
        `);
        const instId = instRes.rows[0].id;
        console.log('✅ Institution ready');

        // 3. Seed Faculty
        const facRes = await db.query(`
            INSERT INTO faculties (institution_id, name, description)
            VALUES ($1, 'College of Natural and Computational Sciences', 'Demo faculty')
            ON CONFLICT (institution_id, name) DO UPDATE SET description = EXCLUDED.description
            RETURNING id;
        `, [instId]);
        const facId = facRes.rows[0].id;
        console.log('✅ Faculty ready');

        // 4. Seed Department
        const deptRes = await db.query(`
            INSERT INTO departments (faculty_id, name, description)
            VALUES ($1, 'Computer Science', 'Demo department')
            ON CONFLICT (faculty_id, name) DO UPDATE SET description = EXCLUDED.description
            RETURNING id;
        `, [facId]);
        const deptId = deptRes.rows[0].id;
        console.log('✅ Department ready');

        // 5. Seed Program
        await db.query(`
            INSERT INTO programs (
                institution_id, 
                department_id, 
                name, 
                slug, 
                degree_level, 
                study_mode, 
                duration, 
                status
            )
            VALUES (
                $1, 
                $2, 
                'Bachelor of Science in Computer Science', 
                'aau-bsc-computer-science', 
                'bachelor', 
                'full_time', 
                '4 years', 
                'published'
            )
            ON CONFLICT (slug) DO NOTHING;
        `, [instId, deptId]);
        console.log('✅ Program ready');

        console.log('🎉 Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();