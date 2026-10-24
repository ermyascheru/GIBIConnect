jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../src/config/database');
const institutionsRepository = require('../src/repositories/institutions.repository');

describe('GIBIConnect Institutions Repository', () => {
  beforeEach(() => jest.clearAllMocks());

  test('findById returns an institution when database returns a row', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: '1', name: 'Example University', city: 'Addis Ababa' }]
    });

    await expect(institutionsRepository.findById('1')).resolves.toEqual({
      id: '1',
      name: 'Example University',
      city: 'Addis Ababa'
    });

    expect(db.query).toHaveBeenCalled();
  });

  test('findById returns null when no institution exists', async () => {
    db.query.mockResolvedValue({ rows: [] });

    await expect(institutionsRepository.findById('missing'))
      .resolves.toBeNull();
  });

  test('create inserts institution data', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: '1', name: 'New University', city: 'Addis Ababa' }]
    });

    const result = await institutionsRepository.create({
      name: 'New University',
      slug: 'new-university',
      type: 'university',
      ownership: 'public',
      city: 'Addis Ababa',
      region: 'Addis Ababa'
    });

    expect(result).toEqual(expect.objectContaining({
      name: 'New University'
    }));
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO institutions'),
      expect.any(Array)
    );
  });

  test('deleteById returns deleted institution ID', async () => {
    db.query.mockResolvedValue({ rows: [{ id: '1' }] });

    await expect(institutionsRepository.deleteById('1'))
      .resolves.toEqual({ id: '1' });

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM institutions WHERE id = $1 RETURNING id',
      ['1']
    );
  });
});
