import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify } from 'quasar'
import { date } from 'quasar'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {
        name: null,
        email: null
      },
      tab: 'tx',
      activeTX: {},
      showTX: false,
      transactions: [],
      contacts: [],
      selectedContacts: [],
      txTab: 'details',
      originalNotes: null,
      splitData: []
    }
  },

  getters: {
    // findPartner: (state) => (id) => state.rawList.find(item => item.id === id)
  },

  actions: {
    async getProfile () {
      const r = await axios.get('/profile')
      if (r.status === 200) { 
        this.user = r.data.user
        this.getTransactions()
      }
    },
    async getTransactions () {
      const r = await axios.get('/transactions')
      if (r.status === 200) this.transactions = r.data
      this.getSplits()
      this.getContacts()
    },
    async getContacts () {
      const r = await axios.get('/contacts')
      if (r.status === 200) this.contacts = r.data
    },
    async getSplits () {
      const r = await axios.get('/splits')
      if (r.status === 200) this.splitData = r.data
      // if (r.status === 200) this.transactions = r.data
    },
    async split (tx, members) {
      const r = await axios.post('/split', { id: tx.id, members})
      if (r.status === 200) {
        this.getSplits()
        this.getTransactions()
        this.showNotif('Split requested', 'notification_important')
      }
      else this.showNotif('Split request failed', 'notification_important')
    },
    async authenticate (name, email) {
      const r = await axios.post('/auth/magiclogin', { destination: {name, email} })
      return r
    },
    async updateNote (tx) {
      const r = await axios.post('/transactions/updateNotes', { tx })
      if (r.status === 200) {
        this.showNotif('Note updated', 'notification_important')
        this.getTransactions()
      }
      return r
    },
    async testAuth () {
      const r = await axios.get('/auth/testAuth')
      if (r.status === 200) { // looks like we were already logged in, move user to app home
        this.user = r.data.user
        this.router.push({ name: 'home' })
      }
    },
    async logout () {
      const r = await axios.post('/logout')
      if (r.status === 200) this.router.push({ name: 'login' })
      else console.error('Error logging out')
      this.showNotif('You have successfully logged out', 'notification_important')
    },
    showNotif (msg, icon) {
      Notify.create({
        message: msg,
        icon: icon
      })
    },
    formatDate (x, options) {
      if (options) return date.formatDate(x, options)
      const now = Date.now()
      const offset = date.getDateDiff(now, x, options)
      let str = ''
      switch (offset) {
        case 0:
          str = 'Today'
          break;
        case 1:
          str = 'Yesterday'
          break;
        default:
          str = date.formatDate(x, 'dddd Do MMMM')
          break;
      }
      return str
    },
    findSplitNamesByID (id) {
      const members = this.splitData.find((x)=> x.split_id === id).members
      return this.findSplitterNames(members)
    },
    findSplitterNames (members) {
      let arr
      const index = members.indexOf(this.user.id)
      if (index >= 0) arr = members.toSpliced(index, 1)
      let str = ''
      arr.forEach(x => {
        str = str + `${str ? ' & ' : ''}${this.contacts.find((y) => y.id === x)?.name}`
      })
      return str
    },
    findDebtors (id) { 
      this.contacts.find((val) => id === val.id)?.name
    }
  }
})
