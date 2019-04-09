<template>
  <div class="afterScan">
  </div>
</template>
<script>
import getUrlParam from "../dlc/getUrl.js";
import Http from "../../httpClient/httpClient";

export default {
  name: "afterScan",
  data() {
    return {
      deviceNum: 0
    };
  },
  created: function() {
    const _this = this;
    let now = Date.parse(new Date()) / 1000;
    _this.deviceNum = Number(getUrlParam("deviceNum"));
    localStorage.setItem("deviceNum", Number(getUrlParam("deviceNum")));
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == "undefined" ||
      now - localStorage.getItem("tokenTime") > 84600 * 3
    ) {
      if (getUrlParam("code") == "") {
        location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/afterScan.html?deviceNum='" +
          parseInt(localStorage.getItem("deviceNum")) +
          "'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
      } else {
        Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
          res => {
            localStorage.setItem(
              "deviceNum",
              getUrlParam("deviceNum")
                .split("'")
                .join("")
            );
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
            localStorage.setItem("userid", res.data.data.user_id);
            _this.getInit();
          }
        );
      }
    } else {
      _this.getInit();
    }
  },
  methods: {
    getInit() {
      const _this = this;
      Http.post("api/api/Index/api", {
        api_name: "controlIndex",
        token: localStorage.getItem("token")
      }).then(res => {
        let name;
        if (res.data.code == 1) {
          name = "controlor";
        } else {
          name = "addPackage";
        }
        _this.$router.push({
          name: name,
          query: {
            device_number: localStorage.getItem("deviceNum"),
            type: 1
          }
        });
      });
    }
  }
};
</script>