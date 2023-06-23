import { defineStore } from 'pinia'

const useTestStore = defineStore('test', {
  state: () => {
    return {
      name: 'test'
    }
  },
  actions: {
    greet(prefix: 'dr'|'sr') {
      return `${prefix} ${this.name}`
    }
  }
})

const t = useTestStore()

// expected error since 'oi' is not a known property
t.oi

// expected function signature to be present
t.greet()
