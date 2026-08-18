import db from '../database/db.js';

export class ResourceRepository {
  static async findByCategory(categoryId, limit = 20, offset = 0) {
    return db('resources')
      .where({ category_id: categoryId, is_published: true })
      .limit(limit)
      .offset(offset);
  }

  static async linkTags(resourceId, tagIds) {
    const records = tagIds.map(tagId => ({ resource_id: resourceId, tag_id: tagId }));
    return db('resource_tags').insert(records);
  }
}