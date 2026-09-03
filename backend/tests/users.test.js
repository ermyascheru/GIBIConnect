jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const db = require('../src/config/database');
const userRepository = require('../src/repositories/user.repository');

describe('GIBIConnect User Repository', () => {
  beforeEach(() => jest.clearAllMocks());

  test('findUserByEmail queries users by email', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Test Student', email: 'student@example.com' }]
    });

    await expect(userRepository.findUserByEmail('student@example.com'))
      .resolves.toEqual({
        id: 1,
        name: 'Test Student',
        email: 'student@example.com'
      });

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE email = $1',
      ['student@example.com']
    );
  });

  test('returns undefined when user is not found', async () => {
    db.query.mockResolvedValue({ rows: [] });

    await expect(userRepository.findUserByEmail('missing@example.com'))
      .resolves.toBeUndefined();
  });

  test('createUser inserts name, email and password', async () => {
    db.query.mockResolvedValue({
      rows: [{
        id: 1,
        name: 'Test Student',
        email: 'student@example.com',
        role: 'student'
      }]
    });

    const user = await userRepository.createUser({
      name: 'Test Student',
      email: 'student@example.com',
      password: 'hashed-password'
    });

    expect(user).toEqual(expect.objectContaining({
      id: 1,
      email: 'student@example.com'
    }));

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      ['Test Student', 'student@example.com', 'hashed-password']
    );
  });
});
