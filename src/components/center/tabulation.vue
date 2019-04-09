<template>
  <div style="height:100%;">
    <div class="flex_sb flex_wrap plr30">
      <p class="bw z_tabulation flex flex_column" v-for="item in goods" @click="goDetails(item.id,item.name)">
        <img :src="item.img" class="z_csyp mb10">
        <em class="pl20 pb20">{{item.name}}</em>
        <span class="pl20 pb20 flex_a" style="display: flex;white-space: nowrap;text-overflow: ellipsis;">
          <span class="z_prices">¥ {{item.price}}</span>
          <span class=" ml20 z_lddg" style="font-size: 0.2rem;font-size: 0.2rem;overflow: hidden;text-overflow: ellipsis;" v-if="item.type_name!=''">{{item.type_name}}</span>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
  import Http from'../../httpClient/httpClient'
    export default {
        name: "tabulation",
      data(){
          return{
            goods:[]
          }
      },
      beforeMount(){
        var that = this;
        document.title = this.$route.query.title;
        Http.post('api/Home/home/api',{api_name:'classShop',token:localStorage.getItem('token'),classid:this.$route.query.id}).then((res)=>{
          console.log(res);
          that.goods = res.data.data;
        })
      },
      methods:{
        goDetails(n,i){
          this.$router.push({name:'orderDetail',query:{id:n,ti:i}})
        }
      }
    }
</script>

<style scoped>
  .z_tabulation{
    width:48%;
    margin-bottom: 0.3rem;
  }
  .z_csyp{
    width:3.3rem;
    height:3.3rem;
  }
  .z_prices{
    color:#ff5850;
  }
  .z_lddg{
    display: inline-block;
    color:#ff5850;
    background: url("../../assets/img/z_ldbg.png") no-repeat center center;
    background-size:100% 100%;
   padding:0.05rem 0.09rem;
  }


</style>
