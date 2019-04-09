<template>
  <div>
      <div>
        <!--<img src="../../assets/img/z_lunbo.png" class="z_lunbo">-->
        <swiper  auto loop dots-position="center" @on-index-change="onSwiperItemIndexChange" v-model="swiperItemIndex">
          <swiper-item v-for="(item, index) in demo01_list" :key="index" style="height:100%;">
            <a :href="item.url" v-if="item.url != ''">
              <img :src="item.img" style="height:100%;">
            </a>
            <div v-else>
              <img :src="item.img" style="height:100%;">
            </div>
          </swiper-item>
        </swiper>
        <img src="../../assets/img/z_sousuo.png" class="z_sousuo" @click="z_sousuo">
      </div>
      <div class="z_nav ptb30 bw">
            <p class="flex_a flex_column z_navp mb20" v-for="item in shop_class" @click="golist(item.id,item.name)">
            <img :src="item.class_img" class="z_navimg mb10">
            <em class="font12">{{item.name}}</em>
          </p>
      </div>
      <div class="ptb30 bw mt30 pl30 bdb">
          <p class="z_biaoti pl30 font16">商品</p>
      </div>
      <div class="flex_sb ptb30 plr30 flex_wrap" style="margin-bottom: 1rem;">
          <p class="bw z_shangpinp flex flex_column" v-for="i in shop" @click="goDetail(i.id,i.name)">
            <img :src="i.shop_img" class="z_chunmian">
            <em class="pl30 pb20 pt20 z_bti">{{i.name}}</em>
            <span class="pl30 pb20"><span class="z_prices">¥ {{i.price}} {{i.discount}}</span></span>
          </p>
      </div>
    <buttoms></buttoms>
    <div v-transfer-dom>
      <loading :show="show2" text="加载中"></loading>
    </div>
  </div>
</template>


<script>
import {
  Swiper,
  Loading,
  TransferDomDirective as TransferDom,
  SwiperItem
} from "vux";
import buttoms from "../buttoms/buttoms.vue";
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";
const baseList = [];
export default {
  directives: {
    TransferDom
  },
  components: {
    Swiper,
    buttoms,
    Loading,
    SwiperItem
  },
  data() {
    return {
      demo01_list: baseList,
      show2: false,
      shop_class: [],
      shop: []
    };
  },
  created() {
    const that = this;
    this.show2 = true;
    let now = Date.parse(new Date()) / 1000;
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == "undefined" ||
      now - localStorage.getItem("tokenTime") > 84600 * 3
    ) {
      if (getUrlParam("code") == "") {
        location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/weshop.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
      } else {
        Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
          res => {
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
            localStorage.setItem("userid", res.data.data.user_id);
            Http.post("api/User/api", {
              api_name: "userInfo",
              token: localStorage.getItem("token")
            }).then(res => {
              that.init();
            });
            
          }
        );
      }
    } else {
      that.init();
    }
  },
  methods: {
    init() {
      const that = this;
      this.show2 = true;
      Http.post("api/Home/home/api", {
        api_name: "index",
        token: localStorage.getItem("token")
      }).then(res => {
        /*  alert(JSON.stringify(res)+'授权成功')*/
        console.log(res);
        that.show2 = false;
        that.demo01_list = res.data.data.banner;
        that.shop_class = res.data.data.shop_class;
        that.shop = res.data.data.shop;
      });
    },
    z_sousuo() {
      this.$router.push("/shopSearch");
    },
    golist(id, title) {
      this.$router.push({
        name: "tabulation",
        query: { id: id, title: title }
      });
    },
    goDetail(ids, ti) {
      console.log(111);
      this.$router.push({ name: "orderDetail", query: { id: ids, ti: ti } });
    }
  }
};
</script>
<style>
.z_lunbo {
  position: relative;
  height: 4rem;
}
.z_sousuo {
  position: absolute;
  top: 2%;
  left: calc(50% - 3.45rem);
  height: 0.6rem;
  width: 6.9rem;
}
.z_navimg {
  height: 1.34rem;
  width: 1.41rem;
}
.z_nav {
  display: flex;
  flex-wrap: wrap;
}
.z_navp {
  width: 50%;
}
.z_biaoti {
  background: url("../../assets/img/z_juxing.png") no-repeat left center;
  background-size: 0.09rem 0.32rem;
}
.z_chunmian {
  width: 100%;
  height: 3.65rem;
}
.z_shangpinp {
  width: 48%;
  margin-bottom: 0.3rem;
}
.z_prices {
  color: #ff5850;
}
.z_bti {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
