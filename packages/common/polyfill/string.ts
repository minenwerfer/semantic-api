declare global {
  interface String {
    capitalize: typeof capitalize
    formatDateTime: typeof formatDateTime
  }
}

export = {}

const capitalize = function(this: string) {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

const formatDateTime = function(this: string, hours: boolean = false) {
  const d = new Date(this)
  if( isNaN(d.getDate()) ) {
    return '-'
  }

  return d.formatToString(hours)
}

Object.assign(String.prototype, {
  capitalize,
  formatDateTime,
})
