const categoriesRepository = require("../repositories/categories.repository");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesRepository.findAll();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;
    const category = await categoriesRepository.create({ name, slug, description });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
