import pg from 'pg'
const { Pool } = pg
console.log('db...', process.env.DB_USER)

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
})

export const query = async (text, params) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, res })
  return res
}

export const getClient = async () => {
  const client = await pool.connect()
  const query = client.query
  const release = client.release
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(`The last executed query on this client was: ${client.lastQuery}`)
  }, 5000)
  client.query = (...args) => {
    client.lastQuery = args
    return query.apply(client, args)
  }
  client.release = () => {
    clearTimeout(timeout)
    client.query = query
    client.release = release
    return release.apply(client)
  }
  return client
}