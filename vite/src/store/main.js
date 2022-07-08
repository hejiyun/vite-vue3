import { defineStore } from 'pinia'
import {allStore} from './all.js'

// pinia 仅提供一种方法来定义如何更改状态的规则.Actions,

 //  state为数据基本库. 可以通过调用导出函数获取store. 
 // 修改store的方法区分以下几种

/**
 //  1.修改单一条基本数据,  
 //  可以直接store.属性修改, 互为响应式关系.
 // 2. 修改多条时, 可以用1.一条条修改,  也可以用pinia推荐的$patch方法,  它是经过优化, 可以加快修改进度对性能友好的官方方法.
//  $patch方法接收两个类型参数, 函数和对象.
   
   $patch + 对象  :  即将需要修改的多条数据结果 统一成对象, 传入方法中, 即可完成修改.

   $patch + 函数  :   通过函数修改时, 函数接收一个形参即为state(store仓库中的state, ) , 可以通过逻辑操作对修改过程进行一定程度的自定义.

*/

export const mainStore = defineStore({
  id: 'mian',
  state: () =>({
    name: '超级管理员',
    age:3,
    test: '测试解构响应'
  }),
  //getters, 与vuex中getters基本用法相同, 
  getters:{
        nameLength:(state) => state.name.length,
        //  可以传入形参进行调用
        getAgeBuff(state){
            console.log('getter被调用')
            return `${state.name}`
        },
        // 也可以直接使用this指代
        getnameBuff(){
            console.log('getter被调用')
            return `${this.name}`
        },
        getALLList() {
            return allStore().testList
        }
  }, 
  // 跟vuex中actions类似, 同样是通过定义函数方法来调用改变state数据
  actions:{
        changeState() {
            this.age++
            this.name = '通过actions修改state数据'
        }
  }
})


