declare global {
  interface Date {
    formatToString: typeof formatToString
    daysAgo: typeof daysAgo
    getRelativeTimeFromNow: typeof getRelativeTimeFromNow
  }
}

export = {}

const rtf = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto'
})

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365/12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

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

const getRelativeTimeFromNow = function(this: any) {
  const now = new Date()
  const elapsed = now as any - this

  for( const [u, value] of Object.entries(units) ) {
    if( Math.abs(elapsed) > value || u === 'second' ) {
      return rtf.format(-1*Math.round(elapsed/value), u as Intl.RelativeTimeFormatUnit)
    }
  }
}

Object.assign(Date.prototype, {
  formatToString,
  daysAgo,
  getRelativeTimeFromNow
})
