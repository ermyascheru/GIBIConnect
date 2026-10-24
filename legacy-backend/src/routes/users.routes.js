const express = require('express');
const router = express.Router();
const db = require('../config/database');
const usersRepository = require('../repositories/users.repository');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { successResponse } = require('../utils/response');

// 1. Admin / Moderator: Get all registered users
router.get('/', authenticate, authorize('admin', 'moderator'), async (req, res, next) => {
  try {
    const data = await usersRepository.findAll(req.query);
    return successResponse(res, 200, 'Users retrieved', data);
  } catch (err) {
    next(err);
  }
});

// 2. Authenticated User: Get saved bookmarks & favorites
router.get('/me/saved', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [insts, progs, schols, resrcs] = await Promise.all([
      db.query(`
        SELECT i.id, i.name, i.city, i.region, i.logo_url, i.cover_image_url, i.type, i.ownership, si.created_at AS saved_at
        FROM saved_institutions si
        JOIN institutions i ON si.institution_id = i.id
        WHERE si.user_id = $1
        ORDER BY si.created_at DESC
      `, [userId]),
      db.query(`
        SELECT p.id, p.name, p.degree_level, p.duration, p.study_mode, i.name AS institution_name, sp.created_at AS saved_at
        FROM saved_programs sp
        JOIN programs p ON sp.program_id = p.id
        JOIN institutions i ON p.institution_id = i.id
        WHERE sp.user_id = $1
        ORDER BY sp.created_at DESC
      `, [userId]),
      db.query(`
        SELECT s.id, s.name, s.funding, s.deadline, s.eligibility, ss.created_at AS saved_at
        FROM saved_scholarships ss
        JOIN scholarships s ON ss.scholarship_id = s.id
        WHERE ss.user_id = $1
        ORDER BY ss.created_at DESC
      `, [userId]),
      db.query(`
        SELECT r.id, r.title, r.file_extension, r.file_size_bytes, i.name AS institution_name, rb.created_at AS saved_at
        FROM resource_bookmarks rb
        JOIN resources r ON rb.resource_id = r.id
        LEFT JOIN institutions i ON r.institution_id = i.id
        WHERE rb.user_id = $1
        ORDER BY rb.created_at DESC
      `, [userId])
    ]);

    return successResponse(res, 200, 'User saved items retrieved', {
      institutions: insts.rows,
      programs: progs.rows,
      scholarships: schols.rows,
      resources: resrcs.rows
    });
  } catch (err) {
    next(err);
  }
});

// 3. Saved Items: Toggle / Add / Remove
router.post('/saved/institutions', authenticate, async (req, res, next) => {
  try {
    const { institution_id } = req.body;
    await db.query(
      'INSERT INTO saved_institutions (user_id, institution_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, institution_id]
    );
    return successResponse(res, 200, 'Institution bookmarked successfully');
  } catch (err) {
    next(err);
  }
});

router.delete('/saved/institutions/:institutionId', authenticate, async (req, res, next) => {
  try {
    await db.query(
      'DELETE FROM saved_institutions WHERE user_id = $1 AND institution_id = $2',
      [req.user.id, req.params.institutionId]
    );
    return successResponse(res, 200, 'Institution removed from bookmarks');
  } catch (err) {
    next(err);
  }
});

router.post('/saved/programs', authenticate, async (req, res, next) => {
  try {
    const { program_id } = req.body;
    await db.query(
      'INSERT INTO saved_programs (user_id, program_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, program_id]
    );
    return successResponse(res, 200, 'Program bookmarked successfully');
  } catch (err) {
    next(err);
  }
});

router.delete('/saved/programs/:programId', authenticate, async (req, res, next) => {
  try {
    await db.query(
      'DELETE FROM saved_programs WHERE user_id = $1 AND program_id = $2',
      [req.user.id, req.params.programId]
    );
    return successResponse(res, 200, 'Program removed from bookmarks');
  } catch (err) {
    next(err);
  }
});

router.post('/saved/resources', authenticate, async (req, res, next) => {
  try {
    const { resource_id } = req.body;
    await db.query(
      'INSERT INTO resource_bookmarks (user_id, resource_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, resource_id]
    );
    return successResponse(res, 200, 'Resource bookmarked successfully');
  } catch (err) {
    next(err);
  }
});

router.delete('/saved/resources/:resourceId', authenticate, async (req, res, next) => {
  try {
    await db.query(
      'DELETE FROM resource_bookmarks WHERE user_id = $1 AND resource_id = $2',
      [req.user.id, req.params.resourceId]
    );
    return successResponse(res, 200, 'Resource removed from bookmarks');
  } catch (err) {
    next(err);
  }
});

// 4. Admin User Management: Role & Status Update
router.patch('/:id/role', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;
    const { rows } = await db.query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, full_name, email, role, status',
      [role, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    return successResponse(res, 200, 'User role updated successfully', rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', authenticate, authorize('admin', 'moderator'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows } = await db.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, full_name, email, role, status',
      [status, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    return successResponse(res, 200, 'User status updated successfully', rows[0]);
  } catch (err) {
    next(err);
  }
});

// 5. Authenticated user detail
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const data = await usersRepository.findById(req.params.id);
    if (!data) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return successResponse(res, 200, 'User retrieved', data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

