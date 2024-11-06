import * as db from './db'
const seedTX = `
  -- seed transactions on new user creation
  INSERT INTO transactions (payer_id, merchant_id, price, currency, payment_type, date_created)
  VALUES 
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Starbucks'), '6.27', 'CAD', 'POS', now()),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Amazon'), '23.41', 'USD', 'ONLINE', now()),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Starbucks'), '11.27', 'CAD', 'POS', now() - INTERVAL '1 DAY'),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'McDonalds'), '18.41', 'CAD', 'POS', now() - INTERVAL '2 DAY'),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Best Buy'), '1306.99', 'CAD', 'POS', now() - INTERVAL '1 DAY'),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Amazon'), '186.48', 'CAD', 'ONLINE', now() - INTERVAL '11 DAY'),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Starbucks'), '16.39', 'CAD', 'POS', now() - INTERVAL '13 DAY'),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Earls'), '69.35', 'CAD', 'POS', now() - INTERVAL '18 DAY'),
  ((SELECT id FROM users WHERE email = $1), (SELECT id FROM merchants WHERE name = 'Pret A Manger'), '13.41', 'GBP', 'POS', now() - INTERVAL '18 DAY'),
  ((SELECT id FROM users WHERE email = 'jerry@example.com'), (SELECT id FROM merchants WHERE name = 'Earls'), '126.81', 'GBP', 'POS', now() - INTERVAL '8 DAY')
`
const processTransactions = (txs) => {
  let arr = []
  let lastDate
  let lastMonth
  txs.forEach((x) => {
    if (!lastMonth) arr.push({ isMonth: true, date: x.date_created })
    else if (x.date_created.getMonth() !== lastMonth) arr.push({ isMonth: true, date: x.date_created })
    
    if (!lastDate) arr.push({ isDate: true, date: x.date_created })
    else if (x.date_created.getDate() !== lastDate.getDate()) arr.push({ isDate: true, date: x.date_created })
    arr.push(x)
    lastDate = x.date_created
    lastMonth = x.date_created.getMonth()
  })
  return arr
}
export const getUsers = async (req, res) => {
  const text = 'SELECT * FROM users ORDER BY id ASC'
  try {
   const r = await db.query(text)
   if (r.rows.length === 0) {
    return res.status(404).send('No users found')
   }
   return res.status(200).json(r.rows)
  } catch (err) {
    console.error(err)
    res.status(404).send('Error fetching user')
  }
}

export const getTransactions = async (req, res) => {
  const text = `
  SELECT 
    transactions.*,
    merchants.name AS merchant_name,
    merchants.logo AS merchant_logo,
    merchants.category
  FROM transactions
  INNER JOIN merchants ON transactions.merchant_id = merchants.id
  WHERE transactions.payer_id = $1
  ORDER BY date_created DESC;
  `
  try {
   const r = await db.query(text, [req.user.id])
   if (r.rows.length === 0) {
    return res.status(404).send('No transactions found')
   }
   return res.status(200).json(processTransactions(r.rows))
  } catch (err) {
    console.error(err)
    res.status(404).send('Error fetching transactions')
  }
}
export const updateNotes = async (req, res) => {
  const { tx } = req.body
  const text = `
    UPDATE transactions SET notes = $2 WHERE id = $1
    RETURNING *
  `
  const values = [tx.id, tx.notes]
  try {
   const r = await db.query(text, values)
   if (r.rows.length === 0) {
    return res.status(404).send('No transactions found')
   }
   return res.status(200).json(processTransactions(r.rows))
  } catch (err) {
    console.error(err)
    res.status(404).send('Error fetching transactions')
  }
}
export const getContacts = async (req, res) => {
  const values = [req.user.id]
  const text = `SELECT * FROM users WHERE id != $1 ORDER BY id ASC` // everyone is your contact! expose the entire bank's user table!
  try {
   const r = await db.query(text, values)
   if (r.rows.length === 0) {
    return res.status(404).send('No contacts found')
   }
   return res.status(200).json(r.rows)
  } catch (err) {
    console.error(err)
    res.status(404).send('Error fetching contacts')
  }
}
export const createSplit = async (req, res) => {
  const { id, members } = req.body
  if (!members.includes(req.user.id)) members.push(req.user.id)
  const txt = `SELECT count(id) from users WHERE id = ANY($1)`
  try {
    const check_r = await db.query(txt, [members])
    const count = parseInt(check_r.rows[0].count)
    if (count !== members.length) return res.status(404).send('multiple member ids are the same')
    // all ids are valid from here
    const text = `
    INSERT INTO split_transactions (transaction_id, members) 
    VALUES ($1, ARRAY[${members.map((x) => "'" + x + "'")}]::uuid[])
    RETURNING *
    ` // inserting arrays into postgres is hard :( https://ubiq.co/database-blog/how-to-insert-into-array-in-postgresql/
    const check_i = await db.query(text, [id])
    if (check_i.rows.length === 1) {
      const updateTX = `
        UPDATE transactions SET split_id = $1 WHERE id = $2
        RETURNING *
      ` 
      await db.query(updateTX, [check_i.rows[0].id, check_i.rows[0].transaction_id])
    }
    return res.status(200).send('split created')
  } catch (error) {
    console.log('error', error)
    return res.status(404).send('Not all user ids are valid')
  }
}
export const getSplits = async (req, res) => {
  const id = req.user.id
  // const txt = `SELECT * FROM split_transactions where $1 = any(split_transactions.members::uuid[])`
  const txt = `
  SELECT transactions.*,
      merchants.name AS merchant_name,
      merchants.logo AS merchant_logo,
			split_transactions.id as split_id,
      split_transactions.members as members,
      split_transactions.transaction_id as tx_id,
			split_transactions.date_created as split_date_created
  FROM split_transactions
  INNER JOIN transactions ON split_transactions.transaction_id = transactions.id
  INNER JOIN merchants ON transactions.merchant_id = merchants.id
  where $1 = any(split_transactions.members::uuid[])`
  try {
    const r = await db.query(txt, [id])
    if (r.rows.length === 0) return res.status(404).send('No splits found')
    return res.status(200).json(r.rows)
  } catch (error) {
    console.log('error', error)
    return res.status(404).send('Not something exploded')
  }
}

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id)
  const text = 'SELECT * FROM users WHERE id = $1'
  const values = [id]

  try {
   const r = await db.query(text, values)
   if (r.rows.length === 0) {
    return res.status(404).send(`No user found with ID: ${id}`)
   }
   return res.status(200).json(r.rows)
  } catch (err) {
    console.error(err)
    res.status(404).send('Error fetching user')
  }
}

export const getOrCreateUserByEmail = async (req, res) => {
  const name = req.params.name
  const email = req.params.email
  const text = `
  WITH ins AS (
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    ON CONFLICT (email) DO NOTHING
    RETURNING *
  ),
  upd AS (
    UPDATE users
    SET date_last_login = now(), name = $1
    WHERE email = $2
    RETURNING *
  )
  SELECT * FROM ins
  UNION
  SELECT * FROM upd;
  `
  const values = [name, email]
  try {
   const r = await db.query(text, values)
   if (r.rows.length > 0) {
    await db.query(seedTX, [email])
    const seedSplits = `   
      -- seed split_transactions cause jerry wants money
      insert into split_transactions (transaction_id, members)
      values ((SELECT id FROM transactions WHERE price = '126.81' ORDER BY date_created DESC LIMIT 1), '{"fe389b85-b17d-4b81-9ffd-0b73ff0af300","14997873-12b2-4fd2-8aad-f2b42a7be1a6","${r.rows[0].id}"}')
      RETURNING *
    `
    const s = await db.query(seedSplits)
    const updateTX = `
      UPDATE transactions SET split_id = $1 WHERE id = $2
      RETURNING *
    ` 
    await db.query(updateTX, [s.rows[0].id, s.rows[0].transaction_id])
  //   const text = `
  //   INSERT INTO split_transactions (transaction_id, members) 
  //   VALUES ($1, ARRAY[${members.map((x) => "'" + x + "'")}]::uuid[])`
   }
   if (res.status) return res.status(200).json(r.rows[0])
   else return r.rows[0]
  } catch (err) {
    console.error(err)
    if (res.status) res.status(404).send('Error fetching or creating user')
  }
}

export const createUser = async (req, res) => {
  const { name, email } = req.body
  const text = 'INSERT INTO users (name, email) VALUES ($1, $2)'
  const values = [name, email]

  try {
   const r = await db.query(text, values)
   if (r.rowCount === 0) {
    return res.status(404).send('Error creating user')
   }
   return res.status(201).send(`User added with name: ${name}`)
  } catch (err) {
    console.error(err)
    res.status(404).send('Error creating user')
  }
}

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body
  const text = 'UPDATE users SET name = $1, email = $2 WHERE id = $3'
  const values = [name, email, id]

try {
   const r = await db.query(text, values)
   if (r.rowCount === 0) {
    return res.status(404).send(`No user found with ID: ${id}`)
   }
   return res.status(200).send(`User modified with ID: ${id}`)
  } catch (err) {
    console.error(err)
    res.status(404).send('Error modifying user')
  }
}

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const text = 'DELETE FROM users WHERE id = $1'
  const values = [id]

  try {
    const r = await db.query(text, values)
    if (r.rowCount === 0) {
      return res.status(404).send(`No user found with ID: ${id}`)
    }
    return res.status(200).send(`User deleted with ID: ${id}`)
    } catch (err) {
      console.error(err)
      res.status(404).send('Error deleting user')
    }
}