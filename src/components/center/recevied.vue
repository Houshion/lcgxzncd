<template>
    <div class="recevied">
        <p class="colw z_top ptb20 tac" v-if="this.$route.query.status==2">待收货</p>
        <p class="colw z_top ptb20 tac" v-else-if="this.$route.query.status==3">已完成</p>
      <div class=" ptb30 mb20 bdb bw plr30">
        <p class="font16 mb20">{{delivery_id}}</p>
        <p class="font16">{{delivery_code}}单号</p>
      </div>
      <div class=" ptb30 mb20 z_dizhi bdb">
        <p class="font16 mb20">收货人：{{contact_name}} {{contact_phone}}</p>
        <p class="font11 d8d8">{{contact_address}} </p>
      </div>
      <div class="bdb mb20 bw plr20">
        <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{orderid}}</span><span>{{status}}</span></p>
        <div class="flex_a ptb30 plr30 bdb" v-for="(item,index) in att" :key="index">
          <img :src="item.img" class="mr20 z_img">
          <span class="flex flex_column z_Right" style="width:100%">
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
          <p class="mb20 plr30 flex_sb"><span class="col6 font12">发货时间</span><span class="font12 col6">{{delivery_time}}</span></p>
        </div>
      </div>
      <p class="z_fixed w100 flex" @click="confir(id)" v-if="this.$route.query.status==2">
        <button class="z_gpay colw font20">确认收货</button>
      </p>
      <div v-transfer-dom>
        <confirm
          v-model="show"
          title="confirm title"
          confirm-text="confirm text"
          @on-cancel="onCancel"
          @on-confirm="onConfirm"
         >

        </confirm>
      </div>

      <toast v-model="show8" type="text" :text="toasttext"></toast>
    </div>
</template>

<script>
  import { Confirm ,Toast,TransferDomDirective as TransferDom} from 'vux'
  import Http from "../../httpClient/httpClient";
  export default {
    directives: {
      TransferDom
    },
    components: {
      Confirm,
      Toast
    },
    data(){
      return{
        show:false,
        contact_name:"",
        contact_phone:"",
        contact_address:"",
        orderid:"",
        status:"",
        created_at:"",
        att:[],
        length:"",
        totalprice:"",
        delivery_id:"",
        delivery_code:"",
        pay_time:"",
        delivery_time:"",
        id:"",
        freight:"",
        show8:false
      }
    },
    methods:{
      confir(id){
        let _this = this
        this.$vux.confirm.show({
          title: '是否确认收货？',
          confirmText:'知道了',
          // 组件除show外的属性
          onCancel () {
            console.log(this) // 非当前 vm
            console.log(_this) // 当前 vm
          },
          onConfirm (id) {
            console.log(_this.id);
            Http.post('api/Order/api',{api_name:'confirmReceipt',token:localStorage.getItem('token'),id:_this.id}).then((res)=> {
              console.log(res);
              _this.show8 = true;
              _this.toasttext = res.data.msg;
              setTimeout(function(){
                _this.$router.go(-1);
              },1500)
            })
          }
        })
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
        that.delivery_id = res.data.data.delivery_id;
        that.delivery_code = res.data.data.delivery_code;
        that.pay_time = res.data.data.pay_time;
        that.delivery_time = res.data.data.delivery_time;
        that.id = res.data.data.id;
        that.freight = res.data.data.freight;
      })
    }



  }
</script>

<style scoped>

  .z_top{
    background:#ff5850;
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

  .z_fixed{
    height:0.98rem;
  }
  .z_gpay{
    background:#00c0ff;
    height:100%;
    width:100%;
  }
</style>
