import { createClient } from "@libsql/client";

const pool = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Antes de tus rutas:
BigInt.prototype.toJSON = function () { return this.toString(); };



const query = async (sql, params = []) => {
  const result = await pool.execute({
    sql,
    args: params,
  });
  return result;
};

export { query };