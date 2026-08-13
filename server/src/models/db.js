const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// mysql2 execute()（预处理语句）的限制统一在此处理：
// 1) LIMIT/OFFSET 传 JS 数字会报 ER_WRONG_ARGUMENTS(1210) → 数值转字符串；
// 2) 参数为 undefined 会报 "Bind parameters must not contain undefined" → 转 null。
const rawExecute = pool.execute.bind(pool);
pool.execute = (sql, params) => {
  if (params !== undefined) {
    if (Array.isArray(params)) {
      params = params.map((p) => {
        if (p === undefined) return null;
        return typeof p === 'number' && Number.isFinite(p) ? String(p) : p;
      });
    } else if (params && typeof params === 'object') {
      const next = {};
      for (const k of Object.keys(params)) {
        const v = params[k];
        next[k] = v === undefined
          ? null
          : typeof v === 'number' && Number.isFinite(v) ? String(v) : v;
      }
      params = next;
    }
  }
  return rawExecute(sql, params);
};

module.exports = pool;
