<template>
  <div>
    <div>
        <img :src="hotelMsg.data.head_img" alt="">
    </div>
    <div class="message bw">
        <div class="msg">
            <b>{{hotelMsg.data.name}}</b>
            <div class="flex">
                <img src="../../assets/img/o_iconPhone.png" class="iconImg">
                <a :href="'tel:'+hotelMsg.data.contact_way">{{hotelMsg.data.contact_way}}</a>
            </div>
            <div class="flex colbbb">
                <img src="../../assets/img/o_iconAddress.png" class="iconImg">
                {{hotelMsg.data.address}}
            </div>
        </div>
        <div>
            <div class="daohangBtn" @click="daohang()">
                <img src="../../assets/img/o_daohang.png" alt="">
                <div class="font12">立即导航</div>
            </div>
        </div>
    </div>
    <div class="content mt20 bw">
        <p class="plr20 p mb30 lh40" v-html="hotelMsg.data.info_img"></p>
    </div>
  </div>
</template>

<script>
import buttoms from "../buttoms/buttoms.vue";
import getUrlParam from "../dlc/getUrl.js";
import Http from "../../httpClient/httpClient";

export default {
  name: "index",
  components: {
    buttoms
  },
  created: function() {
    const _this = this;
    _this.init();
  },
  methods: {
    init() {
      const _this = this;
      Http.post("api/api/Index/api", {
        api_name: "getHotelInfo",
        hotel_id: _this.$route.query.userId,
        token: localStorage.getItem("token")
      }).then(
        res => {
          if (res.data.code == 401) {
            _this.getToken(function() {
              _this.init();
            });
          } else {
            _this.hotelMsg = res.data;
          }

          console.log(_this.hotelMsg.data);
        },
        err => {
          console.log(JSON.stringify(err));
        }
      );
    },
    getToken(func) {
      Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
        res => {
          localStorage.setItem("token", res.data.data.token);
          func();
        }
      );
    },
    daohang() {
      location.href =
        "http://apis.map.qq.com/tools/routeplan/eword=" +
        this.hotelMsg.data.name +
        "&epointx=" +
        this.hotelMsg.data.lng +
        "&epointy=" +
        this.hotelMsg.data.lat +
        "?referer=myapp&key=4LYBZ-CHBRG-TIMQ3-I3N32-2LJ4K-FZBTY";
    }
  },
  data() {
    return {
      hotelMsg: {}
    };
  }
};
</script>

<style scoped>
.iconImg {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}
.flex {
  display: flex;
  font-size: 12px;
}
.message {
  display: flex;
  padding: 10px 15px;
}
.message .msg div {
  padding: 5px 0;
}
.message .msg b {
  font-size: 16px;
}
.mgr15 {
  margin-right: 15px;
}
.colbbb {
  color: #bbb;
}
.daohangBtn {
  color: #77ddff;
  position: absolute;
  right: 20px;
  margin-top: -40px;
}
.daohangBtn img {
  width: 60px;
  height: 60px;
  padding: 15px;
  border-radius: 50%;
  background: #77ddff;
}
.font12 {
  font-size: 12px;
  text-align: center;
  margin: auto;
}
</style>
