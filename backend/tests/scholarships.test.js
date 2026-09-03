jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../src/config/database');
const scholarshipsRepository = require('../src/repositories/scholarships.repository');

describe('GIBIConnect Scholarships Repository', () => {
  beforeEach(() => jest.clearAllMocks());

  test('findAll returns scholarships and pagination information', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ count: '4' }] })
      .mockResolvedValueOnce({
        rows: [
          { id: 1, name: 'Academic Scholarship' },
          { id: 2, name: 'Need Based Scholarship' }
        ]
      });

    const result = await scholarshipsRepository.findAll({
      page: 1,
      limit: 2,
      status: 'published'
    });

    expect(result.totalCount).toBe(4);
    expect(result.totalPages).toBe(2);
    expect(result.rows).toHaveLength(2);
  });

  test('findById returns scholarship with institution information', async () => {
    db.query.mockResolvedValue({
      rows: [{
        id: 1,
        name: 'Academic Scholarship',
        institutions: [{ id: 10, name: 'Example University' }]
      }]
    });

    await expect(scholarshipsRepository.findById(1))
      .resolves.toEqual(expect.objectContaining({
        id: 1,
        name: 'Academic Scholarship'
      }));
  });

  test('findByInstitutionId returns published scholarships', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Academic Scholarship' }]
    });

    await expect(scholarshipsRepository.findByInstitutionId(10))
      .resolves.toEqual([{ id: 1, name: 'Academic Scholarship' }]);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("s.status = 'published'"),
      [10]
    );
  });

  test('create inserts scholarship data', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'New Scholarship' }]
    });

    const result = await scholarshipsRepository.create({
      name: 'New Scholarship',
      slug: 'new-scholarship',
      eligibility: 'Undergraduate students',
      status: 'draft'
    });

    expect(result.name).toBe('New Scholarship');
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO scholarships'),
      expect.any(Array)
    );
  });
});
