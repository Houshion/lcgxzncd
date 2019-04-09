<template>
	<div id="couponList">
        <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" class="pd-b-50">
		    <div class="list mg-auto" v-for="(item,index) in couponList" :key="index" @click="pickUp(item.money,item.id,item.status)">
                <div class="bgCoupon">
                    <img src="../assets/img/o_coupon1.png" class="wd-100" v-if="item.status!=0">
                    <img src="../assets/img/o_coupon2.png" class="wd-100" v-else>
                    <div class="couponMsg">
                        <div class="wd-100 pd-lr-30">
                            <div class="money">
                                <span>{{item.money}}</span>元
                            </div>
                            <div class="borderSlash"></div>
                            <div class="status">
                                <!-- <div class="use">满100可使用</div> -->
                                <div>{{item.status == 0 ? "未使用" : item.status == 1 ? "已使用" : "已过期"}}</div>
                            </div>
                        </div>
                        <div class="time wd-100 pd-lr-30">有效期：{{item.end_time}}</div>
                    </div>
                </div>
            </div>
        </scroller>
        <div class="noUse" v-show="useStatus" @click="noCoupon">
            <div class="btnNoCoupon">不使用优惠券</div>
        </div>
        <toast v-model="toast" type="text" :time="1500" is-show-mask :text="toastText" position="bottom"></toast>
	</div>
</template>

<script>
import Http from "../httpClient/httpClient";
import { Scroller, Toast } from "vux";
export default {
  name: "couponList",
  components: {
    Scroller,
    Toast
  },
  data() {
    return {
      couponList: [],
      onFetching: false,
      page: 1,
      useStatus: false,
      toast: false,
      toastText: ""
    };
  },
  beforeMount() {
    this.getCoupon();
  },
  created() {
    if (this.$route.query.time) {
      this.useStatus = true;
    }
  },
  methods: {
    onScrollBottom() {
      if (!this.onFetching) {
        this.onFetching = true;
        setTimeout(() => {
          this.page++;
          this.onFetching = false;
          this.getCoupon(this.page);
        }, 1000);
      }
    },
    getCoupon(page) {
      const _this = this;
      Http.post("api/User/api", {
        api_name: "userCoupons",
        token: localStorage.getItem("token"),
        page: page
      }).then(res => {
        console.log(res);
        _this.couponList = res.data.data;
        // that.money = res.data.data.money;
        // res.data.data.consumptio.forEach(item => {
        //   that.goods.push(item);
        // });
        // console.log(that.goods);
      });
    },
    pickUp(money, id, status) {
      const _this = this;
      if (_this.useStatus && status == 0) {
        if (money < _this.$route.query.money) {
          _this.$router.push({
            name: "pay",
            query: {
              couponMoney: money,
              couponId: id,
              deviceNum: _this.$route.query.deviceNum,
              hotelt_id: _this.$route.query.hotelt_id,
              time: _this.$route.query.time,
              money: _this.$route.query.money,
              coupon: true
            }
          });
        } else {
          _this.toast = true;
          _this.toastText = "优惠券金额不可大于支付金额";
        }
      }
    },
    noCoupon() {
      const _this = this;
      _this.$router.push({
        name: "pay",
        query: {
          deviceNum: _this.$route.query.deviceNum,
          hotelt_id: _this.$route.query.hotelt_id,
          time: _this.$route.query.time,
          money: _this.$route.query.money
        }
      });
    }
  }
};
</script>

<style scoped>
.mg-auto {
  margin: auto;
}
.pd-lr-30 {
  padding: 0 30px;
}
.wd-100 {
  width: 100%;
}
.pd-b-50 {
  padding-bottom: 50px;
  height: 100% !important;
}

.list {
  width: 300px;
  margin-top: 10px;
}
.borderSlash {
  height: 1px;
  width: 70px;
  margin: auto;
  transform: rotate(-45deg);
  border-bottom: 1px dashed #ffffff;
}
.couponMsg {
  height: 160px;
  margin-top: -160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-around;
  color: #ffffff;
}
.money span {
  font-size: 40px;
}
.status {
  text-align: center;
  width: 50%;
  margin-left: 50%;
}
.noUse {
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
}
.btnNoCoupon {
  width: 90%;
  text-align: center;
  padding: 10px 0;
  border: 1px solid;
  border-radius: 10px;
  margin: 5px 5%;
}
</style>
