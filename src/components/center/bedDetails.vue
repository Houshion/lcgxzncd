<template>
    <div class="bedDetails bw">
        <ul class="plr30">
          <li class="flex_sb ptb30 bdb"><span class="font16">设备编号</span><span class="font16">{{device_number}}</span></li>
          <li class="flex_sb ptb30 bdb"><span>套餐</span><span>{{duration}}小时／{{meal_money}}元</span></li>
          <li class="flex_sb ptb30 bdb"><span>付款时间</span><span>{{pay_time!=""?pay_time:"暂无"}}</span></li>
          <li class="flex_sb ptb30 bdb"><span>开始时间</span><span>{{start_time!=""?start_time:"暂无"}}</span></li>
          <li class="flex_sb ptb30 bdb"><span>结束时间</span><span>{{end_time!=""?end_time:"暂无"}}</span></li>
          <li class="flex_sb ptb30 bdb"><span>消费金额</span><span>¥{{meal_money}}</span></li>
          <li class="flex_sb ptb30 bdb"><span>实付</span><span>¥{{pay_money}}</span></li>
        </ul>
    </div>
</template>

<script>
  import Http from'../../httpClient/httpClient'
    export default {
        name: "bed-details",
        data(){
          return{
            device_number:"",
            meal_money:"",
            duration:"",
            pay_time:"",
            start_time:"",
            end_time:"",
            pay_money:""
          }
        },
      beforeMount(){
          var that = this;
        Http.post('api/User/api',{api_name:'bedInfo',token:localStorage.getItem('token'),id:this.$route.query.ids}).then((res)=>{
          console.log(res);
          that.device_number = res.data.data.device_number;
          that.duration = res.data.data.duration;
          that.meal_money = res.data.data.meal_money;
          that.pay_time = res.data.data.pay_time;
          that.start_time = res.data.data.start_time;
          that.end_time = res.data.data.end_time;
          that.pay_money = res.data.data.pay_money;
        })
      }
    }
</script>

<style scoped>
  .bedDetails{
      height:100%;
  }
</style>
