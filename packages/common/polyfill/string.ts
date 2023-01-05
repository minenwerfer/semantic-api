Object.assign(String.prototype, {
  capitalize: function(this: string): string {
    return this.charAt(0).toUpperCase() + this.slice(1)
  },

  formatDateTime: function(this: string, hours: boolean = false): string {
    const d = new Date(this)
    if( isNaN(d.getDate()) ) {
      return '-'
    }

    return (d as any).formatToString(hours)
  },

  formatDocument: function(this: string) {
    return this && this
      .split(/(\w{3})/).filter(_ => _).join('.')
      .replace(/\.(\w{2})$/, '-$1')
  },

  formatPhone: function(this: string) {
    return this && this
      .replace(/^0?(\w{2})/, '($1) ')
      .replace(/(\w{4})$/, '-$1')
  }
})
