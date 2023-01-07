declare global {
  interface Date {
    formatToString: typeof formatToString
    daysAgo: typeof daysAgo
  }
}

export = {}

const formatToString = function(this: Date, hours: boolean = false, locale = 'pt-BR') {
  return hours
    ? this.toLocaleString(locale).split(':').slice(0, -1).join(':')
    : this.toLocaleDateString(locale)
}

const daysAgo = function(this: Date, days: number) {
  const d = new Date()
  d.setDate(this.getDate() - days)
  return d
}

Object.assign(Date.prototype, {
  formatToString,
  daysAgo
})
