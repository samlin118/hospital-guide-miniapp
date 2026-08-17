const db = require('./db');

const GuideAssignment = {
  // 批量替换某导诊员的分配（事务：先删后插，INSERT IGNORE 去重）
  async replaceByGuide(guideId, assignments) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute('DELETE FROM guide_assignments WHERE guide_id = ?', [guideId]);
      if (assignments && assignments.length) {
        const placeholders = [];
        const values = [];
        for (const a of assignments) {
          if (a && a.hospital_id && a.department_id) {
            placeholders.push('(?, ?, ?)');
            values.push(guideId, a.hospital_id, a.department_id);
          }
        }
        if (placeholders.length) {
          await conn.execute(
            `INSERT IGNORE INTO guide_assignments (guide_id, hospital_id, department_id)
             VALUES ${placeholders.join(', ')}`,
            values
          );
        }
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // 某导诊员的全部分配（带医院/科室名称，供管理端展示）
  async findByGuide(guideId) {
    const [rows] = await db.execute(
      `SELECT ga.id, ga.guide_id, ga.hospital_id, ga.department_id,
              h.name AS hospital_name, d.name AS department_name
       FROM guide_assignments ga
       JOIN hospitals h ON ga.hospital_id = h.id
       JOIN departments d ON ga.department_id = d.id
       WHERE ga.guide_id = ?
       ORDER BY h.id, d.id`,
      [guideId]
    );
    return rows;
  },

  // 按医院（可加科室）查询在线导诊员
  async findGuidesByHospitalDepartment(hospitalId, departmentId) {
    let sql =
      `SELECT DISTINCT g.*
       FROM guide_assignments ga
       JOIN guides g ON ga.guide_id = g.id
       WHERE g.status = 1 AND ga.hospital_id = ?`;
    const params = [hospitalId];
    if (departmentId) {
      sql += ' AND ga.department_id = ?';
      params.push(departmentId);
    }
    sql += ' ORDER BY g.score DESC, g.service_count DESC';
    const [rows] = await db.execute(sql, params);
    return rows;
  },

  // 某医院下有哪些导诊员（去重，用于医院维度列表）
  async findGuidesByHospital(hospitalId) {
    const [rows] = await db.execute(
      `SELECT DISTINCT g.*
       FROM guide_assignments ga
       JOIN guides g ON ga.guide_id = g.id
       WHERE g.status = 1 AND ga.hospital_id = ?
       ORDER BY g.score DESC, g.service_count DESC`,
      [hospitalId]
    );
    return rows;
  }
};

module.exports = GuideAssignment;
