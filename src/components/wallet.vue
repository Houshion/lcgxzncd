<template>
	<div>
		<div class="income flex_aj flex_column">
			<span class="font60 colw">{{money}}</span>
			<span class="colw font16 mt10 mb20">我的总收益（元）</span>
			<router-link :to="{name:'recharge'}" class="bw h60 border-r6 flex_aj color1 mt20" style="width: 1.6rem;">充值</router-link>
		</div>
    <group>
      <div class="borderb">
        <router-link :to="{name: 'walletDetail'}">
          <cell title="明细"  @click="getDetail" is-link></cell>
        </router-link>
      </div>
      <div class="borderb">
        <router-link :to="{name: 'couponList'}">
          <cell title="优惠券" @click="getCoupon" is-link></cell>
        </router-link>
      </div>
    </group>
	</div>
</template>

<script>
import Http from "../httpClient/httpClient";
import { Cell, Group } from "vux";
export default {
  components: {
    Cell,
    Group
  },
  name: "wallet",
  data() {
    return {
      money: "",
      goods: [],
      onFetching: false,
      page: 1
    };
  },
  beforeMount() {
    this.getList(this.page);
  },
  methods: {
    onScrollBottom() {
      if (!this.onFetching) {
        this.onFetching = true;
        setTimeout(() => {
          this.page++;
          // this.$nextTick(() => {
          //   this.$refs.scrollerBottom.reset();
          // });
          this.onFetching = false;
          this.getList(this.page);
        }, 1000);
      }
    },
    getList(page) {
      var that = this;
      Http.post("api/User/api", {
        api_name: "consumptionList",
        token: localStorage.getItem("token"),
        page: page
      }).then(res => {
        console.log(res);
        that.money = res.data.data.money;
        res.data.data.consumptio.forEach(item => {
          that.goods.push(item);
        });
        console.log(that.goods);
      });
    },
  }
};
</script>

<style scoped>
.income {
  height: 4rem;
  background-image: linear-gradient(90deg, #81e0ff, #01c0ff);
}
.borderb {
  border-bottom: 1px solid #efefef
}
</style>
