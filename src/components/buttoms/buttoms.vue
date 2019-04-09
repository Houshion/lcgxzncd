<template>
  <div class="bottom-navigation">
    <router-link :to="{name:'index'}"><span class="bed"></span>赖床</router-link>
    <router-link :to="{name:'controlor'}"><span class="yao"></span>遥控</router-link>
    <router-link :to="{name:'weshop'}"><span class="shop"></span>商场</router-link>
    <router-link :to="{name:'center'}" exact><span class="mine"></span>我的</router-link>
  </div>
</template>

<script>

    export default {
        name: "buttom-nav",
      data(){
          return{
            pic1:require("../../assets/img/z_mine.png"),
            pic2:require("../../assets/img/mine.png")
          }
      },
      methods:{
          dj:function(){
            console.log(1)
          }
      }
    }
</script>

<style scoped>
  .bottom-navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    padding-top: 0.076667rem;
    background: #fff;
  }
  .router-link-active{
    color: #22c8ff;
  }

  a{
    padding: 0 0.5rem;
    padding-top:0.1rem;
    padding-bottom:0.1rem;
  }
  .router-link-active .mine{
    background:url("../../assets/img/mine.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
  }
  .router-link-active .shop{
    background:url("../../assets/img/z_shang2.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
  }
  .router-link-active .yao{
    background:url("../../assets/img/z_yaokong2.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
  }
  .router-link-active .bed{
    background:url("../../assets/img/z_shouye2.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
  }

  .mine{
    display: block;
    width: .4rem;
    height: .4rem;
    background:url("../../assets/img/z_mine.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
    margin:0 auto;
  }
  .shop{
    display: block;
    width: .4rem;
    height: .4rem;
    background:url("../../assets/img/z_shang.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
    margin:0 auto;

  }
  .yao{
    display: block;
    width: .4rem;
    height: .4rem;
    background:url("../../assets/img/z_yaokong.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
    margin:0 auto;
  }
  .bed{
    display: block;
    width: .4rem;
    height: .4rem;
    background:url("../../assets/img/z_shouye.png") no-repeat center top;
    background-size:0.4rem 0.4rem;
    margin:0 auto;
  }


</style>
