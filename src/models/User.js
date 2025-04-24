const { query } = require('../config/db');

class User {
  static async create({ name, email, password }) {
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await query('SELECT * FROM users');
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, { name, email, password }) {
    const result = await query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
      [name, email, password, id]
    );
    return result.rows[0];
  }

  static async partialUpdate(id, fields) {
    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const values = Object.values(fields);
    values.push(id);
    
    const result = await query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    await query('DELETE FROM users WHERE id = $1', [id]);
    return true;
  }
}

module.exports = User;