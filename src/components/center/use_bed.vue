<template>
    <div class="use_bed bw">
      <ul class="bw pl30">

        <router-link :to="{name:'bedDetails',query:{ids:item.border_id}}" v-for="item in good">
            <li class="flex_sb ptb30 bdb bw pr30">
            <span class="flex flex_column">
              <em class="font16 mb10">设备编号：{{item.device_number}}</em>
              <em class="font12 col9">{{item.ctime}}</em>
            </span>
            <span class="font15 z_green1">{{item.status_name}}</span>
            </li>
        </router-link>
      </ul>
    </div>
</template>

<script>
  import Http from'../../httpClient/httpClient'
    export default {
        name: "use_bed",
      data(){
          return{
            good:[]
          }
      },
      beforeMount(){
          var that = this;
        Http.post('api/User/api',{api_name:'bedList',token:localStorage.getItem('token')}).then((res)=>{
          console.log(res);
          that.good = res.data.data;
        })
      }
    }
</script>

<style scoped>
 .use_bed{
   height:100%;
 }
  .z_green1{
    color:#2fe89c;
  }
  .z_red1{
    color:#00c0ff;
  }
</style>
