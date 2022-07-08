import { defineStore } from 'pinia'

export const allStore = defineStore('all',{
  state: () =>({
     testList: ['cat', 'dog', 'fish', 'chicken']
  }),
  getters:{
  }, 

  actions:{
        allState() {
            console.log('all内方法')
        }
  }
})

