<template>
    <div class="flex flex_column" style="height:100%;">
        <p class="font16 pt20 pl30">请选择支付方式</p>
      <div class="flex1">
          <div class="bw flex_sb plr30 ptb30 mt20 bdb bdt flex_sb">
            <p class="flex_a">
              <img src="../../assets/img/wxpay.png" alt="" style="width:0.49rem;height: 0.44rem;margin-right: 0.5rem;"/>
              <span class="font16">微信支付</span>
            </p>
            <img src="../../assets/img/checked.png" style="width:0.48rem;height: 0.48rem;"/>
          </div>
      </div>
      <div class="z_f bw w100 flex" style="height:1rem;">
        <span class="flex_j flex_column pl30" style="width:70%;" ><em style="color:#ff5850;font-size: 0.36rem;">应付款：¥{{this.$route.query.allprice}}</em></span>
        <button class="font16 plr20" style="height:100%;color:#fff;background:#00c0ff;width:30%;" @click="fkuan">付款</button>
      </div>

      <div v-transfer-dom>
        <alert v-model="show1" title="错误" content="支付失败，请重试" button-text="知道了" @on-show="onShow" @on-hide="onHide"></alert>
        <alert v-model="show3" title="成功" content="支付成功！" button-text="知道了" @on-show="onShow" @on-hide="onHideSuccess"></alert>
      </div>

      <div v-transfer-dom>
        <loading :show="show2" text="加载中"></loading>
      </div>
    </div>
</template>

<script>
import {
  Alert,
  TransferDomDirective as TransferDom,
  Clocker,
  Loading
} from "vux";
import Http from "../../httpClient/httpClient";
export default {
  name: "cashier",
  directives: {
    TransferDom
  },
  components: {
    Alert,
    Clocker,
    Loading
  },
  data() {
    return {
      show1: false,
      show3: false,
      show2: false,
      times: ""
    };
  },
  created() {
    this.times = Number(new Date()) + 900000;
  },
  methods: {
    fkuan() {
      // this.show3 = true;
      this.show2 = true;
      var _this = this;
      Http.post("api/pay/order_pay", {
        pay_type: "JSAPI",
        order_id: this.$route.query.orderid,
        /*    goods_id:this.$route.query.goods_id,*/
        type: "1",
        token: localStorage.getItem("token")
      }).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          jsApiParameters = res.data.data.jsApiParameters;
          callpay();
          _this.show2 = false;
          var jsApiParameters = {};
          function jsApiCall() {
            WeixinJSBridge.invoke(
              "getBrandWCPayRequest",
              jsApiParameters, // 提交的支付信息
              function(res) {
               // WeixinJSBridge.log(res.err_msg);
                //alert(JSON.stringify(res));
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  _this.show3 = true;
                  setTimeout(() => {
                    _this.$router.push("/shopOrder");
                  }, 2000);
                } else {
                  _this.show1 = true;
                }
              }
            );
          }
          //调用微信 支付
          function callpay() {
            if (typeof WeixinJSBridge == "undefined") {
              if (document.addEventListener) {
                document.addEventListener(
                  "WeixinJSBridgeReady",
                  jsApiCall,
                  false
                );
              } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", jsApiCall);
                document.attachEvent("onWeixinJSBridgeReady", jsApiCall);
              }
            } else {
              jsApiCall();
            }
          }
        }
      });
    },
    finish() {
      var that = this;
      Http.post("api/Order/api", {
        api_name: "cancel",
        token: localStorage.getItem("token"),
        id: this.$route.query.orderid
      }).then(res => {
        console.log(res);
        that.show1 = true;
        that.$router.push("/center");
      });
    },
    onHideSuccess() {
      this.$router.push({
        name: "shopOrder"
      });
    }
  }
};
</script>

<style scoped>
</style>
