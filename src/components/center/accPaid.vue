<template>
  <div class="nonpayment">
    <div class="colw z_top ptb20 flex_a flex_column">
      <em>待发货</em>
    </div>
    <div class=" ptb30 mb20 z_dizhi bdb">
      <p class="font16 mb20">收货人：{{contact_name}} {{contact_phone}}</p>
      <p class="font11 d8d8">{{contact_address}}</p>
    </div>
    <div class="bdb mb20 bw min-height plr20" >
      <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{orderid}}</span><span>{{status}}</span></p>
      <div class="flex_a ptb30 plr30 bdb" v-for="item in att">
        <img :src="item.img" class="mr20 z_img">
        <span class="flex flex_column z_Right">
              <span class="flex flex_column"><em class="mb10">{{item.name}}</em><em class="mb20">规格：{{item.sku_name}}</em></span>
              <span class="flex_sb"><em class="font18 z_cor">¥{{item.price}}<em class="col9 ml10 font11">{{item.type_name}}</em></em><em class="col9">数量：{{item.num}}</em></span>
            </span>
      </div>
      <div class="bdb">
        <p class="flex_sb ptb20 plr30 font12"><span class="col6">共{{length}}件商品</span><span class="font12 col6">小计：¥{{totalprice*1 - freight*1}}</span></p>
        <p class="flex_sb ptb20 plr30 font12"><span class="col6">快递费</span><span class="font12 col6">¥{{freight}}</span></p>
      </div>
      <p class="flex_sb bdb ptb30 plr30"><span class="col6 font12">共{{length}}件商品</span><span class="font18 z_cor">合计：¥{{totalprice}}</span></p>
      <div class="ptb30">
        <p class="mb20 flex_sb plr30"><span class="col6 font12">订单编号</span><span class="font12 col6">{{orderid}}</span></p>
        <p class="mb20 plr30 flex_sb"><span class="col6 font12">创建时间</span><span class="font12 col6">{{created_at}}</span></p>
        <p class="mb20 plr30 flex_sb"><span class="col6 font12">付款时间</span><span class="font12 col6">{{pay_time}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  import Http from "../../httpClient/httpClient";
  export default {
    name: "accPaid",
    data(){
      return{
        contact_name:"",
        contact_phone:"",
        contact_address:"",
        orderid:"",
        status:"",
        created_at:"",
        att:[],
        length:"",
        totalprice:"",
        idx:"",
        show8: false,
        num:"",
        pay_time:"",
        freight:""
      }
    },
    beforeMount(){
      var that = this;
      Http.post('api/Order/api',{api_name:'orderInfo',token:localStorage.getItem('token'),id:this.$route.query.type}).then((res)=>{
        console.log(res);
        that.att = res.data.data.goods;
        that.contact_name = res.data.data.contact_name;
        that.contact_phone = res.data.data.contact_phone;
        that.contact_address = res.data.data.contact_address;
        that.orderid = res.data.data.orderid;
        that.status = res.data.data.status;
        that.created_at = res.data.data.created_at;
        that.length = res.data.data.goods.length;
        that.totalprice = res.data.data.totalprice;
        that.idx = res.data.data.id;
        that.pay_time = res.data.data.pay_time;
        that.freight = res.data.data.freight
      })

    },
    methods:{
    }
  }
</script>

<style scoped>
  .min-height{
    min-height:9.29rem;
  }
  .z_top{
    background:#ff5850;
  }
  .z_sec{
    font-size:0.2rem;
  }
  .z_dizhi{
    background:url("../../assets/img/z_dingwei.png") no-repeat 4% center #fff;
    background-size:0.28rem 0.36rem;
    padding-left:1rem;
  }
  .font11{
    font-size:0.22rem;
  }
  .d8d8{
    color:#d8d8d8;
  }
  .z_img{
    width:1.65rem;
    height:1.65rem;
  }
  .z_cor{
    color:#ff5850;
  }
  .z_Right{
    width:77%;
  }
  .z_fixed{
    height:0.98rem;
  }
  .z_qxdd{
    color:#00c0ff;
    height:100%;
    width:30%;
  }
  .z_gpay{
    background:#00c0ff;
    height:100%;
    width:70%;
  }
</style>

