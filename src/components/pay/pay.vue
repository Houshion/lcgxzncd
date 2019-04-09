<template>
  <div>
    <div class="title flex_sa flex_wrap">
      <div>消费金额</div>
      <div class="money">{{ money }}元</div>
      <div>使用时长{{ time }}分钟</div>
    </div>
    <group>
      <cell
        title="优惠券"
        @click.native="goCoupon"
        is-link
        :value="coupon ? '抵扣'+couponMoney+'元' : ''"
      ></cell>
    </group>
    <div id="payWay">
      <div
        class="payWay flex_sb"
        v-for="(i,index) in checkList"
        :key="index"
        @click="select(index)"
      >
        <div class="flex_sb icon">
          <img :src="i.img" alt>
          {{i.name}}
        </div>
        <div v-if="index==1">
          <div>￥{{i.money}}</div>
        </div>
        <div v-if="i.status">
          <img src="../../assets/img/z_circle.png">
        </div>
        <div v-else>
          <img src="../../assets/img/z_circle0.png">
        </div>
      </div>
    </div>
    <div class="paymsg flex_aj">
      <div class="payStr">充值优惠 {{paymsg}}</div>
      <router-link :to="{name:'recharge'}">
        <u>马上充值</u>
      </router-link>
    </div>
    <footer>
      <button @click="payBtn">立即支付</button>
    </footer>
    <toast
      v-model="toast"
      type="text"
      :time="1500"
      is-show-mask
      :text="toastText"
      position="bottom"
    ></toast>
  </div>
</template>

<script>
import { Toast, Cell, Group } from "vux";
import getUrlParam from "../dlc/getUrl.js";
import Http from "../../httpClient/httpClient";

export default {
  name: "pay",
  components: {
    Toast,
    Cell,
    Group
  },
  created: function() {
    const _this = this;

    _this.time = _this.$route.query.time;
    _this.money = _this.$route.query.money;
    _this.totalMoney = _this.money;

    if (_this.$route.query.coupon) {
      _this.couponMoney = _this.$route.query.couponMoney;
      _this.couponId = _this.$route.query.couponId;
      _this.coupon = _this.$route.query.coupon;
      _this.money =
        Number(_this.money) - Number(_this.couponMoney) > 0
          ? Number(_this.money) - Number(_this.couponMoney)
          : 0;
    }

    Http.post("api/User/api", {
      api_name: "consumptionList",
      token: localStorage.getItem("token")
    }).then(res => {
      _this.checkList[1].money = res.data.data.money;
    });
  },
  mounted() {
    //
  },
  methods: {
    goCoupon() {
      const _this = this;
      console.log();
      _this.$router.push({
        name: "couponList",
        query: {
          time: _this.time,
          money: _this.totalMoney,
          deviceNum: _this.$route.query.deviceNum,
          hotelt_id: _this.$route.query.hotelt_id
        }
      });
    },
    select(index) {
      for (let i = 0; i < this.checkList.length; i++) {
        this.checkList[i].status = false;
      }
      this.checkList[index].status = !this.checkList[index].status;
      this.payType = this.checkList[index].type;
      console.log(this.checkList);
    },
    payBtn() {
      const _this = this;
      if (_this.isCharge) {
        _this.isCharge = false;
        let param = {
          api_name: "buy_taocan",
          device_number: _this.$route.query.deviceNum,
          hotelt_id: _this.$route.query.hotelt_id,
          token: localStorage.getItem("token")
        };
        _this.$route.query.coupon
          ? (param.coupon_id = _this.$route.query.couponId)
          : "";
        console.log(param);
        Http.post("api/api/Index/api", param).then(res => {
          if (res.data.code == 1) {
            _this.pay(res.data.data.bed_order_no);
          } else {
            _this.toast = true;
            _this.toastText = res.data.msg;
          }
        });
      }
    },
    pay(orderId) {
      const _this = this;
      Http.post("api/pay/order_pay", {
        pay_type: _this.payType,
        order_id: orderId,
        token: localStorage.getItem("token"),
        type: 2
      }).then(res => {
        if (res.data.code == 1) {
          if (_this.payType == "yue") {
            _this.toast = true;
            _this.toastText = res.data.msg;
            setTimeout(() => {
              localStorage.setItem("payStatus", true);
              _this.$router.push({
                name: "controlor"
              });
            }, 1500);
          } else {
            jsApiParameters = res.data.data.jsApiParameters;
            callpay();
            _this.show2 = false;
            var jsApiParameters = {};
            function jsApiCall() {
              WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                jsApiParameters, // 提交的支付信息
                function(res) {
                  WeixinJSBridge.log(res.err_msg);
                  _this.isCharge = true;
                  if (res.err_msg == "get_brand_wcpay_request:ok") {
                    localStorage.setItem("payStatus", true);
                    _this.$router.push({
                      name: "controlor"
                    });
                  } else {
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
        } else {
          _this.toast = true;
          _this.toastText = res.data.msg;
        }
      });
    }
  },
  data() {
    return {
      money: 0,
      time: 0,
      paymsg: "充100送15",
      payType: "JSAPI",
      toast: false,
      isCharge: true,
      toastText: "",
      couponMoney: 0,
      couponId: 0,
      coupon: false,
      checkList: [
        {
          type: "JSAPI",
          name: "微信支付",
          status: true,
          img: require("../../assets/img/wxpay.png")
        },
        {
          type: "yue",
          name: "余额支付",
          status: false,
          money: 0,
          img: require("../../assets/img/yepay.png")
        }
      ]
    };
  }
};
</script>
<style scoped>
.title {
  margin-bottom: 10px;
  background: #ffffff;
  text-align: center;
}
.title div {
  width: 100%;
  padding: 10px;
}
.title div.money {
  font-weight: bold;
  font-size: 20px;
}
#payWay .payWay {
  padding: 15px;
  background: #ffffff;
  border-bottom: 1px solid #eee;
}
.payWay img {
  width: 24px;
}
.payWay .icon img {
  margin-right: 15px;
}
.paymsg {
  margin: 10px 0;
}
.paymsg u {
  color: #46d1ff;
}
.payStr {
  margin-right: 10px;
}
footer button {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 15px 0;
  text-align: center;
  background: #46d1ff;
  color: #ffffff;
  font-size: 18px;
}
</style>
