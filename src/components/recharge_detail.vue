<template>
	<div>

		<ul class="list bw plr20">
			<li class="ptb30  flex_sb bdb">
				<span>明细详情</span>
				<span :class="[type==1?'color3':'color2']">{{type==1?"+":'&minus;'}} ¥{{this.$route.query.money}}</span>
			</li>
			<li class="ptb30  flex_sb bdb">
				<span>类型</span>
				<span>{{remark}}</span>
			</li>
			<li class="ptb30  flex_sb bdb">
				<span>时间</span>
				<span>{{ctime}}</span>
			</li>
			<li class="ptb30  flex_sb bdb">
				<span>交易单号</span>
				<span>{{type==1?orderno:orderid}}</span>
			</li>
			<li class="ptb30  flex_sb bdb">
				<span>剩余零钱</span>
				<span>{{surplus}}</span>
			</li>
			<li class="ptb30  flex_sb bdb">
				<span>备注</span>
				<span>{{remark}}</span>
			</li>
		</ul>

	</div>
</template>

<script>
  import Http from'../httpClient/httpClient'
	export default {
        name: "recharge_detail",
        data(){
          return{
            type:"",
            remark:"",
            ctime:"",
            orderno:"",
            surplus:"",
            orderid:""
          }
        },
    beforeMount(){
          var that = this;
      Http.post('api/User/api',{api_name:'consumptionInfo',token:localStorage.getItem('token'),id:this.$route.query.id,type:this.$route.query.type}).then((res)=>{
        console.log(res);
        that.type=res.data.data.type;
        that.remark=res.data.data.remark;
        that.ctime=res.data.data.ctime;
        that.orderno=res.data.data.orderno;
        that.surplus=res.data.data.surplus;
        that.orderid=res.data.data.orderid
      })
    }


   }

</script>

<style>

</style>
