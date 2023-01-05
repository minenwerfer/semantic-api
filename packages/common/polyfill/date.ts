Object.assign(Date.prototype, {
  formatToString: function(this: Date, hours: boolean = false, locale = 'pt-BR'): string {
    return hours
      ? this.toLocaleString(locale).split(':').slice(0, -1).join(':')
      : this.toLocaleDateString(locale)
  },

  daysAgo: function(this: Date, days: number): Date {
    const d = new Date()
    d.setDate(this.getDate() - days)
    return d
  }
})
