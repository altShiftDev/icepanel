import MagicLoginStrategy from "passport-magic-login"
import * as api from './api.js'
import { sendEmail } from './sendmail.js'
import { welcomeMail } from './emails/welcome'

export const magicLogin = new MagicLoginStrategy.default({
  secret: process.env.SESSION_SECRET,
  userFields: [ 'name', 'email' ],
  tokenField: 'token',
  verifyUserAfterToken: true,
  callbackUrl: process.env.MAGIC_CALLBACK_URL,
  sendMagicLink: async (destination, href) => {
    const link = process.env.ENV === 'dev' ? `http://localhost:3000${href}` : `process.env.PROD_DOMAIN${href}`
    await sendEmail({
      to: destination.email,
      body: welcomeMail(destination.name, link)
    })
  },
  verify: (payload, callback) => {
    // Get or create a user with the provided email from the database
    api.getOrCreateUserByEmail({ params: { name: payload.destination.name, email: payload.destination.email }}, {})
      .then(user => {
        callback(null, user)
      })
      .catch(err => {
        callback(err)
      })
  },
  jwtOptions: {
    expiresIn: '2 days',
  }
})