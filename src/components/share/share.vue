<template>
  <div class="share">
    <div class="loginBox">
      <div class="logo">
        <img src="../../assets/img/logo.png" style="max-width: 50%">
      </div>
      <div class="input">
        <input type="text" placeholder="请输入您的手机号码" v-model="phone">
      </div>
      <div class="input flex flex_sb">
        <input type="text" placeholder="请输入验证码" v-model="code">
        <div class="button btnCode" :class="inCode" @click="getCode">{{name}}</div>
      </div>
      <div class="input">
        <input type="password" placeholder="请设置登录密码" v-model="password">
      </div>
      <div class="button" @click="login">注册并下载APP</div>
    </div>
    <toast v-model="toast" type="text" :time="800" is-show-mask :text="toastText" position="bottom"></toast>
  </div>
</template>

<script>
import { Confirm, Toast, TransferDomDirective as TransferDom } from "vux";
import Http from "../../httpClient/httpClient";
import { clearInterval } from "timers";
export default {
  name: "share",
  directives: {
    TransferDom
  },
  components: {
    Confirm,
    Toast
  },
  data() {
    return {
      phone: "",
      code: "",
      password: "",
      uuid: "",
      inCode: "outCode",
      isCode: false,
      name: "获取验证码",
      time: 60,
      toast: false,
      toastText: "",
      interval: "",
      shareParam: {
        title: "",
        desc: "",
        link: "",
        imgUrl: ""
      }
    };
  },
  created() {
    // this.getCode();
    this.getWx();
  },
  methods: {
    getCode: function() {
      const _this = this;
      if (!_this.isCode) {
        Http.post("api/public/sendSmsCaptcha", {
          phone: _this.phone
        }).then(res => {
          if (res.data.code == 1) {
            _this.isCode = true;
            _this.uuid = res.data.data.uuid;
            _this.toast = true;
            _this.toastText = res.data.msg;
            _this.interval = setInterval(() => {
              if (_this.time > 0) {
                _this.name = _this.time + "s";
                _this.inCode = "inCode";
                _this.time--;
              } else {
                _this.inCode = "outCode";
                _this.isCode = false;
                _this.name = "获取验证码";
                window.clearInterval(_this.interval);
                _this.time = 60;
              }
            }, 1000);
          } else {
            _this.isCode = false;
            _this.toast = true;
            _this.toastText = res.data.msg;
          }
        });
      }
    },
    login: function() {
      const _this = this;
      Http.post("api/public/register", {
        phone: _this.phone,
        password: _this.password,
        captcha_uuid: _this.uuid,
        captcha: _this.code,
        pid: getUrlParam("user_id")
      }).then(res => {
        _this.toast = true;
        _this.toastText = res.data.msg;
        if (res.data.code == 1) {
          // if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
          //   window.location =
          //     "itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=";
          // } else if (navigator.userAgent.match(/android/i)) {
          //   window.location = "https://www.pgyer.com/rO2o";
          // }
          if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
            window.location = res.data.data.ios_url;
          } else if (navigator.userAgent.match(/android/i)) {
            window.location = res.data.data.android_url;
          }
        }
      });
    },
    getShareMsg: function() {
      const _this = this;
      Http.post("api/user/api", {
        api_name: "share",
        token: localStorage.getItem("token")
      }).then(res => {
        _this.toast = true;
        _this.toastText = res.data.msg;
        if (res.data.code == 1) {
          console.log("就獲取微信的信息而已嘛~");
          // if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
          //   window.location = res.data.data.ios_url;
          // } else if (navigator.userAgent.match(/android/i)) {
          //   window.location = res.data.data.android_url;
          // }
          _this.shareParam.title = res.data.data.title;
          _this.shareParam.desc = res.data.data.content;
          _this.shareParam.link = window.location.href;
          _this.shareParam.imgUrl = res.data.data.imgurl;
          _this.share();
        }
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
        _this.getShareMsg();
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
.share {
  background: url("../../assets/img/o_share.png") no-repeat;
  background-size: 100% 100%;
  height: 100%;
}
.loginBox {
  position: absolute;
  width: 94%;
  padding: 20px 3%;
  bottom: 0;
}
.input {
  border: 1px solid #fff;
  border-radius: 30px;
  padding: 10px;
  margin-bottom: 20px;
}
.input input {
  color: #fff;
  height: 30px;
}
.button {
  border-radius: 30px;
  position: relative;
}
.btnCode {
  padding: 5px 0;
  width: 35%;
}
.inCode {
  background: #e1e1e1;
}
.outCode {
  background: #46d1ff;
}
.logo {
  text-align: center;
}
</style>
