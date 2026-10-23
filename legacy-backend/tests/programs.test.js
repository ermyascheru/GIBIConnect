jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../src/config/database');
const programsRepository = require('../src/repositories/programs.repository');

describe('GIBIConnect Programs Repository', () => {
  beforeEach(() => jest.clearAllMocks());

  test('findById returns a program', async () => {
    db.query.mockResolvedValue({
      rows: [{
        id: 1,
        name: 'Computer Science',
        institution_name: 'Example University'
      }]
    });

    await expect(programsRepository.findById(1)).resolves.toEqual({
      id: 1,
      name: 'Computer Science',
      institution_name: 'Example University'
    });
  });

  test('findByInstitutionId returns published programs', async () => {
    db.query.mockResolvedValue({
      rows: [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Artificial Intelligence' }
      ]
    });

    const result = await programsRepository.findByInstitutionId(10);

    expect(result).toHaveLength(2);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("p.status = 'published'"),
      [10]
    );
  });

  test('findAll returns pagination metadata', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ count: '5' }] })
      .mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Computer Science' }]
      });

    const result = await programsRepository.findAll({
      page: 2,
      limit: 2,
      status: 'published'
    });

    expect(result.totalCount).toBe(5);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.rows).toHaveLength(1);
  });

  test('create inserts a program', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Artificial Intelligence' }]
    });

    const result = await programsRepository.create({
      institution_id: 1,
      department_id: 2,
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
      degree_level: 'bachelor',
      duration: 4,
      study_mode: 'regular'
    });

    expect(result.name).toBe('Artificial Intelligence');
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO programs'),
      expect.any(Array)
    );
  });
});
