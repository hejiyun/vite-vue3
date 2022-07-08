<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Child from './components/HelloWorld.vue'
 const childCtx = (texs) => {
   console.log(texs)
 }
 const daxiao = () => {
   console.log('dianjidaxiao')
 }
 const gaodi = (text) => {
   console.log('dianjigaodi',text)
 }
</script>

<template>
<div>
  <img alt="Vue logo" src="./assets/logo.png" />
  <!--<img alt="Vue logo" src="./assets/1.jpg" />-->
   <Child msg="hello" @daxiao="daxiao" @gaodi="gaodi" @child-click="childCtx" />
  
  <!--<router-view></router-view>-->
</div>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
