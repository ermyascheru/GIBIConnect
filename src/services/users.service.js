const usersRepository = require('../repositories/users.repository');

const getAllUsers = async (query) => {
    return await usersRepository.findAll(query);
};

const getUserById = async (id) => {
    return await usersRepository.findById(id);
};

module.exports = {
    getAllUsers,
    getUserById
};
