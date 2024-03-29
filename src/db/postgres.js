import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  password: "nhatprola1",
  host: "localhost",
  port: "5432",
  database: "test",
});
export default pool;
