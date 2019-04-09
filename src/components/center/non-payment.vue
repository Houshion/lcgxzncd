<template>
    <div class="nonpayment">
        <div class="colw z_top ptb20 flex_a flex_column">
            <em>未付款</em>
            <p class="z_sec">还剩{{minute}}:{{second}}
              自动关闭</p>
        </div>
        <div class=" ptb30 mb20 z_dizhi bdb">
          <p class="font16 mb20">收货人：{{contact_name}} {{contact_phone}}</p>
          <p class="font11 d8d8">{{contact_address}}</p>
        </div>
      <div class="bdb mb20 bw min-height plr20" >
        <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{orderid}}</span><span>{{status}}</span></p>
        <div class="flex_a ptb30 plr30 bdb" v-for="item in att" :key="item">
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
        </div>
      </div>
      <p class="z_fixed w100 flex">
        <button class="z_qxdd bw" @click="cancels(idx)">取消订单</button>
        <button class="z_gpay colw" @click="z_gpay(orderid)">去付款</button>
      </p>

      <toast v-model="show8" type="text" :text="toasttext"></toast>
    </div>
</template>

<script>
  import Http from "../../httpClient/httpClient";
  import { Toast } from 'vux';
    export default {
        name: "non-payment",
      components: {Toast },
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
            time:"",
            num:"",
            minute:'00',
            second:'00',
            freight:"",
            timer:null
          }
      },
      beforeMount(){
          var that = this;
          console.log(this.$route.query.type)
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
          that.countDown(res.data.data.ctime-(Number(new Date())/1000).toFixed(0)+1800);
          that.freight = res.data.data.freight
        })

      },
      methods:{
        cancels(idx){
          console.log(idx)
          var _this = this;
          Http.post('api/Order/api',{api_name:'cancel',token:localStorage.getItem('token'),id:idx}).then((res)=> {
            console.log(res);
            _this.show8 = true;
            _this.toasttext = res.data.msg;
            setTimeout(function(){
              _this.$router.go(-1);
            },1500)
          })
        },
        z_gpay(orderid){
            console.log(orderid);
          this.$router.push({name:"cashier",query:{orderid:orderid,allprice:this.totalprice}})
        },
        countDown(times){
          var _this = this;
          _this.timer=setInterval(function(){
            var day=0,
              hour=0,
              minute=0,
              second=0;//时间默认值
            if(times > 0){
              day = Math.floor(times / (60 * 60 * 24));
              hour = Math.floor(times / (60 * 60)) - (day * 24);
              minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
              second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }

            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            //
            console.log(hour+"小时："+minute+"分钟："+second+"秒");
            // var abc = document.getElementsByClassName('z_sec')[0].innerHTML=hour+"："+minute+"："+second+""
            times--;
            _this.hour = hour;
            _this.minute = minute;
            _this.second = second;
          },1000);
          if(times<=0){
            clearInterval(_this.timer);
            Http.post('api/Order/api',{api_name:'cancel',token:localStorage.getItem('token'),id:_this.idx}).then((res)=> {
              console.log(res);
              setTimeout(function(){
                _this.$router.go(-1);
              },1500)
            })
          }
        }
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
