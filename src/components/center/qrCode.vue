<template>
  <div class="qrCode flex_aj flex_column">
    <!-- <qrcode :value="value" type="img"></qrcode> -->
    <!-- <img :src="value" alt="" id="qrcode"> -->
    <div id="qrcode"></div>
    <!-- <a :href="app_url" class="font18 mt30">{{app_url}}</a> -->
    <div class="shareImgBg">
      <img src="../../assets/img/shareImgBg.jpg" style="height:100%;width:100%">
    </div>
  </div>
</template>

<script>
import Http from "../../httpClient/httpClient";
import { Qrcode, Loading, TransferDomDirective as TransferDom } from "vux";
import getUrlParam from "../dlc/getUrl.js";
export default {
  name: "qr-code",
  directives: {
    TransferDom
  },
  components: {
    Qrcode,
    Loading
  },
  data() {
    return {
      value: "",
      fgColor: "#000000",
      app_url: "",
      show2: false,
      shareParam: {
        title: "",
        desc: "",
        link: "",
        imgUrl: ""
      }
    };
  },
  created() {
    var _this = this;
    if (getUrlParam("code") == "") {
      location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/qrCode.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
    } else if (!localStorage.getItem("token")) {
      _this.show2 = true;
      Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
        res => {
          console.log(res);
          localStorage.setItem("token", res.data.data.token);
          Http.post("api/User/api", {
            api_name: "userInfo",
            token: localStorage.getItem("token")
          }).then(res => {
            _this.getShareMsg();
          });
        }
      );
      // alert('微信授权成功')
    } else {
      _this.getShareMsg();
    }
  },
  methods: {
    getShareMsg() {
      const _this = this;
      Http.post("api/user/api", {
        api_name: "share",
        token: localStorage.getItem("token")
      }).then(res => {
        console.log(res);
        // _this.value = res.data.data.qrcode_url;
        $("#qrcode").qrcode({
          render: "image",
          size: 100,
          text: res.data.data.url
        });
        console.log(_this.value);
        _this.app_url = res.data.data.app_url;
        _this.shareParam.title = res.data.data.title;
        _this.shareParam.desc = res.data.data.content;
        _this.shareParam.link = window.location.href;
        _this.shareParam.imgUrl = res.data.data.imgurl;
        _this.getWx();
      });
    },
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
            "updateAppMessageShareData",
            "updateTimelineShareData",
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        _this.show = false;
        _this.share();
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
    share() {
      const _this = this;
      wx.ready(function() {
        // wx.updateAppMessageShareData({
        //   title: _this.shareParam.title, // 分享标题
        //   desc: _this.shareParam.desc, // 分享描述
        //   link: _this.shareParam.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: _this.shareParam.imgUrl, // 分享图标
        //   success: function() {
        //     // 设置成功
        //   }
        // });
        // wx.updateTimelineShareData({
        //   title: _this.shareParam.title, // 分享标题
        //   link: _this.shareParam.desc, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //   imgUrl: _this.shareParam.link, // 分享图标
        //   success: function() {
        //     // 设置成功
        //   }
        // });
        wx.onMenuShareTimeline({
          title: _this.shareParam.title, // 分享标题
          link: _this.shareParam.desc, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: _this.shareParam.link, // 分享图标
          success: function() {
            // 用户点击了分享后执行的回调函数
          }
        });
        wx.onMenuShareAppMessage({
          title: _this.shareParam.title, // 分享标题
          desc: _this.shareParam.desc, // 分享描述
          link: _this.shareParam.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: _this.shareParam.imgUrl, // 分享图标
          success: function() {
            // 用户点击了分享后执行的回调函数
          }
        });
        wx.onMenuShareQQ({
          title: _this.shareParam.title, // 分享标题
          desc: _this.shareParam.desc, // 分享描述
          link: _this.shareParam.link, // 分享链接
          imgUrl: _this.shareParam.imgUrl, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareWeibo({
          title: _this.shareParam.title, // 分享标题
          desc: _this.shareParam.desc, // 分享描述
          link: _this.shareParam.link, // 分享链接
          imgUrl: _this.shareParam.imgUrl, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.onMenuShareQZone({
          title: _this.shareParam.title, // 分享标题
          desc: _this.shareParam.desc, // 分享描述
          link: _this.shareParam.link, // 分享链接
          imgUrl: _this.shareParam.imgUrl, // 分享图标
          success: function() {
            // 用户确认分享后执行的回调函数
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.qrCode {
  height: 100%;
}
#qrcode {
  background: #ffffff;
  padding: 5px;
  position: absolute;
  bottom: 20px;
  left: 20px;
}
.shareImgBg {
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
}
</style>
