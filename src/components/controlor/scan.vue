<template>
  <div>
    <loading :show="show" text="加载中..."></loading>
  </div>
</template>

<script>
// import jssdk from "../dlc/wx-sdk";
import { Loading } from "vux";
import Http from "../../httpClient/httpClient";
import { setTimeout } from 'timers';

export default {
  components: {
    Loading
  },
  name: "scan",

  created: function() {
    const _this = this;
    let now = Date.parse(new Date()) / 1000

    // if (
    //   !localStorage.getItem("token") ||
    //   localStorage.getItem("token") == "undefined" ||
    //   now - localStorage.getItem("tokenTime") > 84600 * 3
    // ) {
    //   if (getUrlParam("code") == "") {
    //     location.href =
    //     "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/controlor.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
    //   } else {
    //     Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
    //       res => {
    //         localStorage.setItem("token", res.data.data.token);
    //         localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
    //         localStorage.setItem("userid", res.data.data.user_id);
    //         _this.getWx();
    //       }
    //     );
    //   }
    // }else{
      // _this.getWx();
    // }
  },
  mounted: function() {
    setTimeout(() => {
      this.getWx();
    }, 100);
  },
  data() {
    // ticket: "";
    return {
      show: true
    };
  },
  methods: {
    getWx() {
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
        _this.show = false;
        _this.scan();
      });
    },
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
    scan() {
      const _this = this;
      wx.ready(function() {
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function(res) {
            // _this.$router.push({
            //   name: "addPackage",
            //   query: {
            //     device_number: res.resultStr,
            //     // device_number: "1000100010001612",
            //     type: 1
            //   }
            // });
          },
          error: function(err) {
            dlctipbox.show(err);
          }
        });
      });
    }
  }
};
</script>