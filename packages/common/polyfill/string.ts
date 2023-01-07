declare global {
  interface String {
    capitalize: typeof capitalize
    formatDateTime: typeof formatDateTime
    formatDocument: typeof formatDocument
    formatPhone: typeof formatPhone
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

const formatDocument = function(this: string) {
  return this && this
  .split(/(\w{3})/).filter(_ => _).join('.')
  .replace(/\.(\w{2})$/, '-$1')
}

const formatPhone = function(this: string) {
  return this && this
  .replace(/^0?(\w{2})/, '($1) ')
  .replace(/(\w{4})$/, '-$1')
}

Object.assign(String.prototype, {
  capitalize,
  formatDateTime,
  formatDocument,
  formatPhone
})
