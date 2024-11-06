import express from 'express'
import session from 'express-session'
import { pool } from './db'
import connectPgSimple from 'connect-pg-simple'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import * as api from './api.js'
import { magicLogin } from './magiclogin.js'
import passport from "passport"

const app = express()
const port = process.env.PORT
const callbackURL = process.env.MAGIC_CALLBACK_URL
const baseURL = process.env.ENV === 'dev' ? `http://localhost:5173/` : `process.env.PROD_DOMAIN/`

console.log('env', app.get('env'))

const pgSession = connectPgSimple(session)
const sessionStore = new pgSession({
  pool: pool,
  tableName: 'sessions',
  createTableIfMissing: true
})

//MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ status: "Please login first" })
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SESSION_SECRET))

let sesh = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  store: sessionStore
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sesh.cookie.secure = true // serve secure cookies
}
app.use(session(sesh))
app.use(passport.initialize())
app.use(passport.session())

app.post('/auth/magiclogin', magicLogin.send)
app.get(callbackURL, passport.authenticate('magiclogin', { successRedirect: baseURL, failureRedirect: `${baseURL}/login`, failureMessage: true, profile: true }))
app.get('/users', isLoggedIn, api.getUsers)
app.get('/user/:id', isLoggedIn, api.getUserById)
app.get('/get_or_create_by_email/:email', isLoggedIn, api.getOrCreateUserByEmail)
app.post('/user', isLoggedIn, api.createUser)
app.put('/user/:id', isLoggedIn, api.updateUser)
app.delete('/user/:id', isLoggedIn, api.deleteUser)
app.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (!err) {
      res.status(200).clearCookie('connect.sid', { path: '/' }).json({ status: "Success" });
    } else {
      res.status(500).json({ status: "Error" })
    }
  })
})
app.get('/transactions', isLoggedIn, api.getTransactions)
app.post('/transactions/updateNotes', isLoggedIn, api.updateNotes)
app.post('/split', isLoggedIn, api.createSplit)
app.get('/splits', isLoggedIn, api.getSplits)
app.get('/contacts', isLoggedIn, api.getContacts)

app.get('/auth/testAuth', (req, res) => {
  if (req.isAuthenticated()) return res.json({ message: 'success', user: req.user })
  else return res.status(405).json({ message: 'failed' })
})
app.get('/profile', isLoggedIn, (req, res) => {
  res.json({
    message: 'success',
    user: req.user
  })
})

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, user)
  })
})

passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    done(null, user)
  })
})

passport.use(magicLogin)
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
