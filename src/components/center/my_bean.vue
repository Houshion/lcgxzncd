<template>
    <div>
        <div class="z_header flex_aj flex_column">
            <p class="colw z_ge">{{score}}</p>
             <p class="font16 my_lai">我的赖豆（颗）</p>
        </div>
        <p class="ptb20 bdb pl30 col9">明细</p>
        <ul class="bw pl30">
          <!-- <scroller lock-x  @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200"> -->
            <div class="box2">
              <li class="flex_sb ptb30 bdb pr30" v-for="item in array" :key="item">
                <span class="flex flex_column">
                  <em class="font16 mb10">{{item.remarks}}</em>
                  <em class="font12 col9">{{item.ctime}}</em>
                </span>
                <span :class="[item.type==1?'z_green':'z_red']" class="font15">{{item.type==1?"+":'&minus;'}}¥{{item.num}}</span>
              </li>
            </div>
          <!-- </scroller> -->
          
          <!--<li class="flex_sb ptb30 bdb pr30">-->
            <!--<span class="flex_a flex_column">-->
              <!--<em class="font16 mb10">商城购物抵扣</em>-->
              <!--<em class="font12 col9">2017-12-22  20:23</em>-->
            <!--</span>-->
            <!--<span class="font15 z_red">-¥100.00</span>-->
          <!--</li>-->
        </ul>
    </div>
</template>

<script>
import Http from "../../httpClient/httpClient";
import { Scroller, LoadMore, Spinner } from "vux";
export default {
  components: {
    Scroller,
    LoadMore,
    Spinner
  },
  name: "my_bean",
  data() {
    return {
      array: [],
      score: "",
      onFetching: false,
      page: 1,
    };
  },
  created() {
    console.log(1111)
  },
  mounted() {
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
        api_name: "laiBean",
        token: localStorage.getItem("token"),
        page: page,
      }).then(res => {
        console.log(res);
        that.score = res.data.data.score;
        res.data.data.lai_bean.forEach(item => {
          that.array.push(item)
        });
        console.log(that.array);
      });
    }
  }
};
</script>

<style scoped>
.z_header {
  height: 4rem;
  background: #65d9ff;
}
.z_ge {
  font-size: 1.2rem;
}
.my_lai {
  color: #f1f1f1;
}
.z_green {
  color: #2fe89c;
}
.z_red {
  color: #ff5850;
}
</style>
