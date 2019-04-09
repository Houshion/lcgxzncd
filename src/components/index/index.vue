<template>
  <div>
    <swiper :list="swiper_list" auto loop dots-position="center" v-model="swiperIndex" @on-index-change="onIndexChange"></swiper>
    <div class="listTitle">附近的赖床(<span>{{count}}</span>)</div>
    <div class="list">
        <div class="listDiv" v-for="(i,index) in hotel_list" :key="index">
          <router-link class="flex_sb" :to="{name:'indexDetail', query: { userId: i.hotel_id }}">
            <div class="img">
              <img :src="i.head_img" alt="">
            </div>
            <div class="line">
              <div>{{i.name}}</div>
              <div class="flex">
                <img src="../../assets/img/o_iconPhone.png" class="iconImg">
                {{i.contact_way}}
              </div>
              <div class="flex colbbb">
                <img src="../../assets/img/o_iconAddress.png" class="iconImg">
                {{i.address}}
              </div>
              <div class="flex colbbb">
                <img src="../../assets/img/ic_nav.png" class="iconImg">
                {{i.juli}} 公里
              </div>
            </div>
            <x-button class="mgr15" mini :gradients="['#1D62F0', '#19D5FD']">立即导航</x-button>
          </router-link>
        </div>
    </div>
    <router-link :to="{name:'scan'}" class="scan">扫一扫</router-link>
    <loading :show="loading" text="数据加载中..."></loading>
    <buttoms></buttoms>
  </div>
</template>

<script>
import buttoms from "../buttoms/buttoms.vue";
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";
import { Swiper, XButton, Loading } from "vux";

// let baseList = [
//   {
//     url: "javascript:",
//     img: require("../../assets/img/nav1.png")
//   },
//   {
//     url: "javascript:",
//     img: require("../../assets/img/nav2.png")
//   }
// ];

export default {
  name: "index",
  components: {
    Swiper,
    XButton,
    buttoms,
    Loading
  },
  created: function() {
    const _this = this;
    let now = Date.parse(new Date()) / 1000;
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == "undefined" ||
      now - localStorage.getItem("tokenTime") > 84600 * 3
    ) {
      if (getUrlParam("code") == "") {
        location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/index0.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
      } else {
        Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
          res => {
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
            localStorage.setItem("userid", res.data.data.user_id);
            _this.getIndex();
          }
        );
      }
    } else {
      _this.getIndex();
    }
  },
  mounted() {
    const _this = this;

    Http.post("api/public/getTicket", {
      api_name: "getTicket"
    }).then(res => {
      let timestamp = (new Date().getTime() / 1000).toFixed(0);
      let noncestr = Math.random()
        .toString(36)
        .substr(2);
      let ticket = _this.wx_js(res.data.data.ticket, timestamp, noncestr);
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端//alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: "wx744d7da2444764d5", // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: ticket, // 必填，签名，见附录1
        jsApiList: [
          "checkJsApi",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "hideMenuItems",
          "showMenuItems",
          "hideAllNonBaseMenuItem",
          "showAllNonBaseMenuItem",
          "translateVoice",
          "startRecord",
          "stopRecord",
          "onRecordEnd",
          "playVoice",
          "pauseVoice",
          "stopVoice",
          "uploadVoice",
          "downloadVoice",
          "chooseImage",
          "previewImage",
          "uploadImage",
          "downloadImage",
          "getNetworkType",
          "openLocation",
          "getLocation",
          "hideOptionMenu",
          "showOptionMenu",
          "closeWindow",
          "scanQRCode",
          "chooseWXPay",
          "openProductSpecificView",
          "addCard",
          "chooseCard",
          "openCard"
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      _this.getAddress();
    });
  },
  methods: {
    wx_js(signature, timestamp, nonceStr) {
      var e = decodeURIComponent(
          "jsapi_ticket=" +
            signature +
            "&noncestr=" +
            nonceStr +
            "&timestamp=" +
            timestamp +
            "&url=" +
            location.href.split("#")[0]
        ),
        s = new jsSHA(e, "TEXT"),
        signature = s.getHash("SHA-1", "HEX");
      return signature; // 返回微信签名算法
    },

    getToken(func) {},

    getAddress() {
      const _this = this;
      wx.ready(function() {
        wx.getLocation({
          type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            let speed = res.speed; // 速度，以米/每秒计
            let accuracy = res.accuracy; // 位置精度
            _this.getIndex(latitude, longitude);
          }
        });
      });
    },

    getIndex(lat, lng) {
      console.log(111111);
      const _this = this;

      Http.post("api/api/Index/api", {
        api_name: "getHotelList",
        lng: lng,
        lat: lat
      }).then(res => {
        if (res.data.code == 1) {
          let bannerlist = [];

          for (let i = 0; i < res.data.data.banner_list.length; i++) {
            bannerlist.push({
              url: "javascript:",
              img: res.data.data.banner_list[i]
            });
          }

          _this.swiper_list = bannerlist;
          _this.count = res.data.data.hotel_list.length;
          _this.hotel_list = res.data.data.hotel_list;
          _this.loading = false;
        }
      });
    },
    onIndexChange(index) {
      this.swiperIndex = index;
    },
    onImgError(item, $event) {
      console.log(item, $event);
    }
  },
  data() {
    return {
      swiper_list: {},
      swiperIndex: 0,
      count: 2,
      hotel_list: [],
      loading: true
    };
  }
};
</script>

<style scoped>
.copyright {
  font-size: 12px;
  color: #ccc;
  text-align: center;
}
.text-scroll {
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
}
.text-scroll p {
  font-size: 12px;
  text-align: center;
  line-height: 30px;
}
.black {
  background-color: #000;
}
.title {
  line-height: 100px;
  text-align: center;
  color: #fff;
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
.vux-indicator.custom-bottom {
  bottom: 30px;
}
@-webkit-keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
.fadeInUp {
  animation-name: fadeInUp;
}
.swiper-demo-img img {
  width: 100%;
}
.listTitle {
  padding: 15px;
  background: #eee;
}
.list {
  padding-left: 20px;
  /* margin-bottom: 60px; */
      height: 6.9rem;
    overflow: scroll;
    margin-bottom: 1.4rem;
}
.list .listDiv {
  border-bottom: 1px #eeeeee solid;
  padding: 20px 0;
  display: flex;
}
.img {
  width: 25%;
}
.img img {
  width: 100%;
}
.iconImg {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}
.flex {
  display: flex;
  font-size: 12px;
}
.line {
  width: 40%;
  padding-left: 10px;
}
.line div {
  padding: 5px 0;
}
.mgr15 {
  margin-right: 15px;
}
.colbbb {
  color: #bbb;
}
.scan {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-radius: 50%;
  background: #77ddff;
  color: #fff;
  position: fixed;
  bottom: 60px;
  right: 20px;
}
.flex_sb {
  width: 100%;
}
</style>
