import { createClient } from "@libsql/client";

const pool = createClient({
  url: "libsql://micodat-bucha789.aws-us-east-2.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN,
});


const query = async (sql, params = []) => {
  const result = await pool.execute({
    sql,
    args: params,
  });

  return result.rows;
};

export { query };