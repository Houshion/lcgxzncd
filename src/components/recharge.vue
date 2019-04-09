<template>
<div style="overflow: hidden;">

	<div class="main bdt plr30 ptb30 mt20 bw bdb">
		<p class="col9 font16">请选择充值金额</p>
		<ul class="mt20 flex_sb flex_wrap" id="charge">
			<label v-for="(i,index) in goods" :key="index">
				<input type="radio" name="money"  :value="i.rec_id" v-model="checkModel"  hidden/>
				<span>{{i.title}}</span>
			</label>
			<!--<label>
				<input type="radio" name="money"  value="80"  hidden />
				<span>充500送100</span>
			</label>
			<label>
				<input type="radio" name="money"  value="50"  hidden />
				<span>充200送50</span>
			</label>
			<label>
				<input type="radio" name="money"  value="30"  hidden />
				<span>充100送20</span>
			</label>-->
		</ul>
	</div>
	<div class="bw flex_sb plr30 ptb30 mt20 bdb bdt flex_sb">
		<p class="flex_a">
			<img src="../assets/img/wxpay.png" alt="" style="width:0.49rem;height: 0.44rem;margin-right: 0.5rem;"/>
			<span class="font16">微信支付</span>
		</p>
		<img src="../assets/img/checked.png" style="width:0.48rem;height: 0.48rem;"/>
	</div>
	<button class="bgc1 db colw font16 m_atuo mt80 w90 border-r6 ptb20" @click="charge">立即充值</button>
	<p class="tac pos_a w100 plr20 col6" style="left: 0;bottom: 5%;">点击充值即表示同意<赖床充值协议>，知悉充值本金和 赠送金额都不可提现、转移<router-link :to="{name:'agreement'}" class="color1">查看详细协议</router-link>。</p>

  <div v-transfer-dom>
    <loading :show="show2" text="加载中"></loading>
  </div>
  <toast v-model="toast" type="text" :time="1500" is-show-mask :text="toastText" position="bottom"></toast>
  <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
    <div class="img-box">
      <img src="../assets/img/z_right.png" style="max-width:50%" v-if="imgShow">
      <img src="../assets/img/z_error.png" style="max-width:50%" v-else>
      <div class="tac">{{toastText}}</div>
    </div>
    <div @click="showHideOnBlur=false" class="tac btnConfirm">
      知道了
    </div>
  </x-dialog>
</div>
</template>

<script>
import {
  XDialog,
  Loading,
  Toast,
  TransferDomDirective as TransferDom
} from "vux";
import Http from "../httpClient/httpClient";
export default {
  name: "recharge",
  data() {
    return {
      goods: [],
      checkModel: "",
      show2: false,
      toast: false,
      toastText: "",
      imgShow: true,
      showHideOnBlur: false
    };
  },
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    Loading,
    Toast
  },
  methods: {
    charge() {
      var _this = this;
      if (_this.checkModel != "") {
        _this.show2 = true;
        Http.post("api/api/Index/api", {
          api_name: "Recharge",
          token: localStorage.getItem("token"),
          rec_id: _this.checkModel
        }).then(res => {
          console.log(res);
          Http.post("api/pay/order_pay", {
            pay_type: "JSAPI",
            order_id: res.data.data.orderno,
            type: "3",
            token: localStorage.getItem("token")
          }).then(res => {
            console.log(res);
            if (res.data.code == 1) {
              jsApiParameters = res.data.data.jsApiParameters;
              _this.show2 = false;
              callpay();
              var jsApiParameters = {};
              function jsApiCall() {
                WeixinJSBridge.invoke(
                  "getBrandWCPayRequest",
                  jsApiParameters, // 提交的支付信息
                  function(res) {
                    WeixinJSBridge.log(res.err_msg);
                    _this.showHideOnBlur = true;
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                      _this.imgShow = true;
                      _this.toastText = "充值成功";
                      setTimeout(() => {
                        _this.$router.push({
                          name: "wallet"
                        });
                      }, 2000);
                    } else {
                      _this.imgShow = false;
                      _this.toastText = "充值失败，请重试！";
                      setTimeout(() => {
                        _this.showHideOnBlur = false;
                      }, 2000);
                      off = 0;
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
        });
      } else {
        _this.toast = true;
        _this.toastText = "请选择充值金额";
      }
    }
  },
  beforeMount() {
    var that = this;
    Http.post("api/api/Index/api", {
      api_name: "getRechargeList",
      token: localStorage.getItem("token")
    }).then(res => {
      console.log(res);
      that.goods = res.data.data;
    });
  }
};
</script>

<style>
#charge label {
  width: 45%;
  margin-bottom: 5%;
  height: 1rem;
}
#charge label span {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #999;
  color: #666;
}
#charge input[type="radio"]:checked + span {
  background: #00c0ff;
  color: #fff;
  border: 1px solid #00c0ff;
}
.tac {
  text-align: center;
}
.img-box {
  padding: 50px;
}
.btnConfirm {
  color: #00c0ff;
  padding: 10px;
  border-top: 1px solid #e1e1e1;
}
</style>
