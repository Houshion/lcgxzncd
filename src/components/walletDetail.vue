<template>
    <div id="walletDetail">
		<p class="font16 plr30 ptb30 col6">消费明细</p>
      <ul class="list bw plr20" >
        <scroller lock-x @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200">
            <div class="box2">
            <!-- <router-link :to="{name:'recharge_detail',query:{id:item.id,type:item.type,money:item.pay_money}}" v-for="item in detailList" :key="item"> -->
              <li class="ptb30 bdt flex_sb" v-for="item in detailList" :key="item" >
                <div>
                    <p class="col3 mb10">{{item.type_name}}</p>
                    <span class="col9 mt10">{{item.ctime}}</span>
                </div>
                <div :class="[item.type==1?'color3':'color2']" >{{item.type==1?"+":'&minus;'}} ¥{{item.pay_money}}</div>
              </li>
            <!-- </router-link> -->
            </div>
        </scroller>
		  </ul>
    </div>    
</template>
<script>
import Http from "../httpClient/httpClient";
import { Scroller } from "vux";
export default {
  components: {
    Scroller
  },
  name: "walletDetail",
  data() {
    return {
      detailList: [],
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
          that.detailList.push(item);
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.income {
  height: 4rem;
  background-image: linear-gradient(90deg, #81e0ff, #01c0ff);
}
</style>
