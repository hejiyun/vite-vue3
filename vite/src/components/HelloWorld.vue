<script setup>
import { onMounted,onBeforeMount, onBeforeUpdate , useSlots,useAttrs,  
  ref,reactive ,toRefs, computed,watch, watchEffect, readonly,shallowReadonly,shallowReactive ,
toRaw, markRaw  } from 'vue'
import { mainStore } from "@/store/main.js"
import { storeToRefs } from 'pinia'

const Store = mainStore()

// 需要注意的是,  用es6的解构赋值方法对pinia中的state数据进行解构, 同样可以得到相应值, 但是会让解构值失去响应性.
// 需要对state进行解构的话, 可以使用pinia提供的解构方法, storeToRefs进行解构,

// const { test } = Store   无响应特性
const { test } = storeToRefs(Store)  //  具有响应特性  ,, 通过之前研习vue3语法, 可以推测, pinia的storeToRefs也应用了类似toRefs赋予响应原理.


//  pinia- storeToRefs源码

// function storeToRefs(store) {
//   store = toRaw(store);
//   const refs = {};
//   for (const key in store) {
//     const value = store[key];
//     if (isRef(value) || isReactive(value)) {
         // 此处重新赋予响应关系
//       refs[key] = toRef(store, key); 
//     }
//   }
//   return refs;
// }





const updateName = ()=>{
  // $patch 修改 store 中的数据
  Store.$patch({
    name: '名称被修改了,nameLength也随之改变了'
  })
}

// 多条数据修改, 通过 patch + 对象的形式修改
const update = () =>{
    Store.$patch({
      name: '经过patch修改的值会相对更快',
      age: 5
    })
}

// 多条数据修改, 通过patch + 函数的形式修改, 优点即可以对于某些修改时需要特定条件特殊处理的动态数据.
const updateFun = () =>{
    Store.$patch((state) => {
         state.age == 5 ? (state.age = 4) : (state.age = 5)
         state.name = '经过patch函数修改对应的值'
         state.test = '测试响应之后是否变动'
    })
}


// actions方法同样挂载于Store上
const actionChange = () =>{
  Store.changeState()
}


const age = ref(18)
const age2 = reactive(184)
onBeforeMount(() =>{
  console.log('这里是初始化创建阶段')
})
//生命周期钩子函数
onMounted(()=>{
  console.log('初始阶段展开')
    //var _this = this
    // axios.get('http://localhost:8181/book/findAll/1/5').then(function(resp){
    //     console.log(resp.data)
    // })
}) 
onBeforeUpdate(() => {
  console.log('看好了， 页面要进行更新了')
})
// 相对于com API而言, 可以看成细化拆分了context, 依然可以使用对应新增的3个新api获取到想要的context内属性.某种意义上来说, 相较更便捷且针对了.
//  emit函数在自定义事件时, 需要将所有自定义事件都注册到emits数组中, 否则会报警告. 用法无太大区别
const emit = defineEmits(['child-click', 'daxiao','gaodi'])
const ctx = useAttrs()
const slot = useSlots()
const props = defineProps({
  msg:String
})
const obj = {
    attrs: ctx,
    props:props,
    emit: emit
}
const handleClick = () => {
  console.log('12321')
  emit('child-click', obj)
}
const handleClick2 = () => {
  console.log('12321')
  emit('daxiao', obj)
}
const handleClick3 = () => {
  console.log('12321')
  emit('gaodi', obj)
}

// 不使用方法创建的常见化对象或者基本数据, 只能作为常量, 无法做出响应关系.
const tiancai = {
  t:'天才',
  hua:'话说'
}
const sex = '男'
// reactive创建的复杂数据类型, 可以新增, 修改, 且具有响应性
const pepole = reactive(sex)

// ref创建的复杂数据类型, 可以新增, 修改, 但是对于页面来说会失去响应特性.
const pepole2 = ref({
  age: 4,
  name: '小张',
  sex: '女'
})

// toRefs创建的复杂数据类型 , 针对于reactive, 因为reactive在进行解构之后, 会失去响应性, 可以新增, 修改, 且具有响应性
const {name} = toRefs(pepole)
// toRefs无法针对于常见化创建数据赋予响应式.
// const {name} = toRefs({
//   age: 4,
//   name: '小丽丽',
//   sex: '女'
// })

// ref创建的基本数据类型, 可以直接修改, 且具有响应性
const ageInc = () => {
  age.value++
}
// reactive创建的基本数据类型, 不仅不可以直接修改, 而且还会报错
const ageInc2 = () => {
  age2.value++
}
// 所以 , 综上, 在创建对应数据的时候, 应当依照, 基本数据类型使用ref, 复杂数据类型使用reactive.
const count = ref(0)


// computed方面, 没有太大区别
const newAge = computed({
  //取值
  get: () => {
    return age.value * 10
  },
  // 赋值
  set: (val) => {
    age.value = val / 10
  }
})


// watch也没有太大的变化, 监听基本数据ref
watch(age, (newVal, oldVal) => {
      console.log('age 变化：', newVal, oldVal)
}, { immediate: true, deep: true })
// 监听复杂数据reactive
watch(pepole.age, (newVal, oldVal) => {
      console.log('age 变化：', newVal, oldVal)
}, { immediate: true, deep: true })



// vue3 中, 新增了一个高级监听属性watchEffect,它的作用是可以自定义设置监听数据前后的变化过程中, 需要进行的操作,
// 相比于watch, watchEffect的优点在于不需要取特定声明, 它会自动监听使用到的属性, 并且是非惰性的,初始化也会执行, 
// 且可以更细致的自定义监听过程中的操作. 当然,在每次修改时, 只会看到修改后的值
// 并且也可以设置自定义代码执行的时机, 是在更新前, 更新后, 亦或者是同步执行.
 // 监听值变化之前，会先执行一下函数，无论什么位置，都会先执行函数，在执行其他内容，只有在监听值发生变化时，才会触发
const stop = watchEffect((oninvalidata) => {
  // 在函数前面输入一下
  console.log('oninvalidata - 前', age.value)
  // 先执行这个函数，可以用来提前处理一些需要的东西
  oninvalidata(() => {
    console.log('before')
  })
  // 在函数后面输入一下
  console.log('oninvalidata - 后', age.value)
}, {
  // 执行时机： pre（组件更新前）、sync（强制效果始终同步）、post（组件更新后执行）
  // 此处设置的函数, 根据执行时机设置不同, 函数执行的时间也不同, 
  flush: 'post', // dom 加载完毕后执行
  // 数据发生变化时，根据flush设置比较上面的 oninvalidata 函数是否先调用onTrigger
  onTrigger(e) {
    console.log('onTrigger')
    // console.log(e) // 数据变化信息，可以在这里拿到新旧值、变化对象、变化类型、变化key
    // debugger // 用于 debugger 调试
  }
})



// readonly 与 shallowReadonly 函数, 深只读与浅只读
// readonly函数中属性任何层次都不可以修改
const obj2 = reactive({
  id: 1,
  name: 'drh',
  job:{
    neg: 30
  }
}) 
const user = readonly(obj2)

const change = () => {
  user.id = 3
  user.job.neg = 2
}

// shallowReadonly 函数中, 第一层级数据不可以被修改, 深层次的可以 (响应性依然遵循数据类型创建规则)
const obj1 = reactive({
  id: 1,
  name: 'drh',
  job:{
    neg: 30
  }
}) 
const user2 = shallowReadonly({...obj1})

const change2 = () => {
  user2.job.neg = 2
}
const change3 = () => {
  user2.id= 2
}

// reactive 与 shallowReactive 函数 reactive 为深劫持(深响应)，shallowReactive 为浅劫持(浅响应)。
// 修改reactive任意层级的数据都会更新页面,  但修改shallowReactive 数据, 只有第一层级会刷新页面
const obj4 = reactive({
  id: 1,
  name: 'drh',
  job:{
    neg: 30
  }
}) 
const change4 = () => {
  obj4.job.neg= 2
}

const obj5 = shallowReactive({
  id: 1,
  name: 'drh',
  job:{
    neg: 30
  }
}) 
const change5 = () => {
  obj5.job.neg= 2
}


// toRaw : 将一个reactive响应对象转换为普通对象.   markRaw. 将一个reactive响应对象永久转化为普通对象.不可被响应

//   似乎针对于对象中属性起效, 无法对对象本身进行去响应化.  是不是因为会创建一个无法响应的对象, 可以赋值在对象属性上, 形成对象中无法响应的特定
// 属性, 但由于方法返回的是新对象的关系, 无法被作用于对象本身.? 查看一下源码.
// 通过源码确实可以看出, markRaw/toRaw本身就是通过复制对象去创建一个无法被响应的数据,并且这个数据需要被赋值才能生效, 这个过程无法影响对象本身, 
// 所以会出现obj= markRaw(obj)无效, obj数据改变依然会出现响应的问题.
// function markRaw(value) {
//     shared.def(value, "__v_skip" /* SKIP */, true);
//     return value;
// }

// toRaw 作用是将响应对象转化为普通对象, 这个普通对象仍然具有响应性， 只是在类型上产生了变化， 可以看作是toRaw只是将响应对象以浅拷贝的形式进行了一个对象的简化复制。对它的响应性不会产生影响

//mark  *标记一个对象，使其不能成为一个响应式对象。* ：作用是将普通对象设置为永远不可响应对象， 即使后续被融入进响应对象中， 也不会进行响应。  但是无法使本身具有响应性的对象变为不可响应。

// markRaw / toRaw 使用的注意点是， 他们二者都不能包裹转化本身经过reactive/ref转化的响应式数据, 或者说, 不能使已具备响应性的对象失去响应特性.
// let chw = markRaw({
//   name:"张三",
//       age:25,
//       job:{
//         salary:30
//       }
// })
//  let person = reactive(chw)
 let person = reactive({
  name:"张三",
      age:25,
      job:{
        salary:30
      }
})
      let p = toRaw(person);

    const showRawPerson = () => {
      console.log("person=",person);
      console.log("raw person = ",p);
    }

const changename = () => {
  pepole2.name = '小芳'
  console.log(pepole2)
}
const changename2 = () => {
  pepole.name = '小李'
  console.log(pepole2)
}
const changename3 = () => {
  pepole3.name = '小何'
  console.log(pepole2)
}
const nameInc = () => {
  console.log('123213')
    name.value = '小天'
}
const tiancaiInc = () => {
  tiancai.t = 'zjelg'
}


 
</script>

<template>
<div>
   <!--<div>用户名:{{ Store.name }}<br />长度:{{ Store.nameLength }}</div>
   <div>年龄:{{ Store.age }}</div>
   <div>test:{{ test }}</div>
   <div>list:{{  Store.getALLList }}</div>
  <hr/>
  <button @click="updateName">修改store中的name</button>
  <button @click="Store.name = '我点击这里的时候,通过响应性去修改store里的name值'">修改store中的name</button>
  <button @click="update">修改store中的值</button>
  <button @click="updateFun">Fun修改store中的值</button>
  <button @click="actionChange">actions修改store中的值</button>-->
     <!--<div @click="handleClick3">{{msg}}</div> 
    <h1 @click="ageInc">{{ age }}</h1>
    <h1 @click="newAge = 100" >{{ newAge }}</h1>-->
    <!--<h1 @click="change" >{{ user.id }}</h1>
    <h1 @click="change" >{{ user.job.neg }}</h1>
    <h1 @click="change3" >{{ user2.id }}</h1>
    <h1 @click="change2" >{{ user2.job.neg }}</h1>
      <h1 @click="change4" >{{ obj4.job.neg }}</h1>
    <h1 @click="change5" >{{ obj5.job.neg }}</h1>-->
<!--<h2>姓名：{{person.name}}</h2>
  <h2>年龄：{{person.age}}</h2>
  <h2>薪酬：{{person.job.salary}}K</h2>
  <button @click="person.age++">增长年龄</button>&nbsp;
  <button @click="person.job.salary++">涨薪</button>&nbsp;
  <button @click="showRawPerson">点我显示原始person</button>-->
    <!--<h1 @click="ageInc2">{{ age2 }}</h1>12321
    <h1 @click="nameInc">{{ name }}</h1>
    <h1 @click="tiancaiInc">{{ tiancai.t}}</h1>
    <div @click="changename">{{pepole2.name}}</div>
    <div @click="changename2">{{pepole.name}}</div>
    <div @click="changename3">{{pepole3.name}}</div>-->
      
</div>
</template>
<style scoped>
  a {
    color: #42b983;
  }
</style>