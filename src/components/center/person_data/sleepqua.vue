<template>
    <div>
        <ul class="bw pl30">
          <router-link :to="{name:'sleep',query:{idx:item.id}}" v-for="item in items">
            <li class="z_sleep pr30 ptb30 bdb">
               <span class="font16">{{item.ctime}}</span>
            </li>
          </router-link>
        </ul>
    </div>
</template>

<script>
  import Http from'../../../httpClient/httpClient'
    export default {
        name: "sleepqua",
        data(){
            return{
              items:[]
            }
        },
        beforeMount(){
          Http.post('api/User/api',{api_name:'sleepRecord',token:localStorage.getItem('token')}).then((res)=>{
            console.log(res);
            this.items=res.data.data
          })
        }
    }
</script>

<style scoped>
  .z_sleep{
      background:url("../../../assets/img/z_arror.png") no-repeat 97% center #fff;
      background-size:0.1rem 0.18rem;
  }
</style>
