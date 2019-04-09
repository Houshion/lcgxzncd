<template>
  <div class="flex flex_column">
    <div class="header flex_sb ptb60 bw plr30">
      <span class="flex_a">
        <img :src="imgs" class="z_ren mr20">
        <span class="flex flex_column">
          <em class="font21">{{name}}</em>
          <router-link :to="{name:'person_data'}">
            <button class="mt20 mp">编辑名片</button>
          </router-link>
        </span>
      </span>
      <span @click="qd">
        <button class="qd" v-show="qd1">签到</button>
        <button class="qd3" v-show="qd3">签到成功</button>
      </span>
    </div>
    <ul class="center">
      <router-link :to="{name:'wallet'}">
        <li class="flex_a c">
          <img src="../../assets/img/z_wallet.png" class="li">
          <span class="bdb w100 my flex_sb">
            <span>我的钱包</span>
            <span class="money col9">{{money}}元</span>
          </span>
        </li>
      </router-link>
      <router-link :to="{name:'shopOrder'}">
        <li class="flex_a c">
          <img src="../../assets/img/z_order.png" class="li">
          <span class="bdb w100 my">商城订单</span>
        </li>
      </router-link>
      <router-link :to="{name:'use_bed'}">
        <li class="flex_a c">
          <img src="../../assets/img/z_bed.png" class="li">
          <span class="bdb w100 my">用床记录</span>
        </li>
      </router-link>
      <router-link :to="{name:'my_bean'}">
        <li class="flex_a c">
          <img src="../../assets/img/z_dou.png" class="li">
          <span class="bdb w100 my flex_sb">
            <span>我的赖豆</span>
            <span class="money col9">{{score}}颗</span>
          </span>
        </li>
      </router-link>
      <!-- <router-link :to="{name:'sleepqua'}"><li class="flex_a c"><img src="../../assets/img/z_sleep.png" class="li"><span class="bdb w100 my">睡眠质量</span></li></router-link> -->
      <li class="flex_a c" @click="noneAction">
        <img src="../../assets/img/z_sleep.png" class="li">
        <span class="bdb w100 my">睡眠质量</span>
      </li>
      <router-link :to="{name:'addr'}">
        <li class="flex_a c">
          <img src="../../assets/img/z_addr.png" class="li">
          <span class="w100 my">地址管理</span>
        </li>
      </router-link>
    </ul>
    <buttoms></buttoms>
    <toast v-model="show8" type="text" :text="toasttext"></toast>
    <div v-transfer-dom>
      <loading :show="show2" text="加载中"></loading>
    </div>
  </div>
</template>

<script>
import buttoms from "../buttoms/buttoms.vue";
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";
import { Toast, Loading, TransferDomDirective as TransferDom } from "vux";
export default {
  name: "center",
  directives: {
    TransferDom
  },
  components: { buttoms, Toast, Loading },
  data() {
    return {
      qd1: true,
      qd3: false,
      show8: false,
      toasttext: "",
      imgs: "../../assets/img/head.png",
      name: "",
      score: "",
      money: "",
      show2: false
    };
  },
  created() {
    const _this = this;
    let now = Date.parse(new Date()) / 1000;
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == "undefined" ||
      now - localStorage.getItem("tokenTime") > 84600 * 3
    ) {
      if (getUrlParam("code") == "") {
        location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/center.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
      } else {
        this.show2 = true;
        Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
          res => {
            console.log(res);
            this.show2 = false;
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
            _this.init();
          }
        );
      }
    } else {
      _this.init();
    }
  },
  methods: {
    noneAction: function() {
      this.show8 = true;
      this.toasttext = "敬请期待";
    },
    init() {
      const _this = this;
      Http.post("api/User/api", {
        api_name: "userInfo",
        token: localStorage.getItem("token")
      }).then(reb => {
        console.log(reb);
        if (reb.data.data.is_sign == 1) {
          _this.qd3 = true;
          _this.qd1 = false;
        }
        _this.imgs = reb.data.data.head_img;
        _this.name = reb.data.data.nickname;
        _this.score = reb.data.data.score;
        _this.money = reb.data.data.money.toFixed(2);
      });
    },

    qd() {
      Http.post("api/User/api", {
        api_name: "sign",
        token: localStorage.getItem("token")
      }).then(ret => {
        console.log(ret);
        if (ret.data.code == 1) {
          this.qd3 = true;
          this.qd1 = false;
          this.show8 = true;
          this.toasttext = ret.data.msg;
        } else {
          this.show8 = true;
          this.toasttext = ret.data.msg;
        }
      });
    }
  }
};
</script>

<style scoped>
.z_ren {
  width: 1.28rem;
  height: 1.28rem;
}
.mp {
  font-size: 0.22rem;
  border: 1px solid #f0f0f0;
  border-radius: 0.1rem;
  width: 1.23rem;
  padding: 0.1rem;
}
.qd {
  padding: 0.1rem 0.2rem;
  color: #00c0ff;
  border: 1px solid #00c0ff;
  border-radius: 0.5rem;
}
.qd3 {
  background: #00c0ff;
  color: #fff;
  padding: 0.1rem 0.2rem;
  border-radius: 0.5rem;
}
.li,
.li a {
  padding: 0 !important;
}
.li {
  width: 0.4rem;
  height: 0.4rem;
}
.c {
  background: url("../../assets/img/z_arror.png") no-repeat 96% center;
  background-size: 0.1rem 0.18rem;
  padding-left: 0.3rem;
  background-color: #fff;
}
.my {
  margin-left: 0.3rem;
  padding: 0.3rem 0;
}
.money {
  padding-right: 0.8rem;
}
</style>
