<template>
    <div class="partner">
      <group gutter="0rem">
        <popup-picker :title="title1" :data="list1" v-model="value1" @on-show="onShow" @on-hide="onHide" @on-change="onChange">
        </popup-picker>
      </group>
      <p class="bw ptb30 flex_sb plr30" @click="z_where"><span>所在城市</span><em class="z_ct pr30">{{city}}</em></p>

      <div class="bw ssdq pt30" v-show="show1" style="min-height: 10rem;">
       <p><p class="z_sousuokuang ptb20"><input type="text" placeholder="搜索地区" class="z_inputs" v-model="search"></p></p>
        <p class="mt30 pl30 xzcity ptb20">请选择城市</p>
        <ul v-if="searchData.length > 0" class="flex flex_column mt30 pl30">
          <li v-for="item in searchData" class="z_spa" @click="searchCity($event,item.code)" :key="item">{{item.name}}</li>
        </ul>
        <div v-else>暂无数据</div>
      </div>
      <div class="mt30 ptb30 bw pl30 mb30">
          <p class="mb20 font18">联系人信息</p>
          <p class="ptb30 bdb"><em>联系人：</em><input type="text" v-model="contact"></p>
          <p class="ptb30 bdb"><em>联系方式：</em><input type="number" v-model="phone"></p>
          <p class="pt30"><em>微信号：</em><input type="text" v-model="wx_code"></p>
      </div>
      <div class="bw flex flex_column pl30 ptb30">
        <em class="font18 mb20">资源及优势</em>
        <textarea name="" id="" class="pl30 pt20" cols="30" rows="10" style="width:6.89rem;height:2.24rem;background:#eee;border-radius: 0.1rem;" placeholder="请输入你所想的！" v-model="advantage"></textarea>
      </div>
      <button class="bgc1 db colw font16 m_atuo mt80 w90 border-r6 ptb20" @click="tj">提交</button>
      <toast v-model="show8" type="text" :text="toasttext"></toast>
    </div>
</template>

<script>
import { PopupPicker, Group, Toast } from "vux";
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";
export default {
  name: "partner",
  components: {
    PopupPicker,
    Group,
    Toast
  },
  data() {
    return {
      title1: "选择合作模式",
      list1: [["我是代理商", "我是商家"]],
      value1: ["我是商家"],
      show1: false,
      search: "",
      city: "",
      products: [],
      idx: "",
      type: "",
      show8: false,
      toasttext: "",
      close: false
    };
  },
  methods: {
    init() {
      const that = this;
      Http.post("api/public/get_region", {}).then(res => {
        console.log(res);
        Http.post("api/public/get_region", {
          code: res.data.data.code
        }).then(res => {
          console.log(res);
          that.products = res.data.data;
          console.log(that.products);
        });
      });
    },
    onChange(val) {
      console.log("val change", val);
    },
    z_where() {
      this.show1 = true;
    },
    searchCity(e, id) {
      console.log(id);
      this.idx = id;
      this.city = e.target.innerText;
      this.show1 = false;
    },
    tj() {
      var _this = this;
      if (
        this.city == "" ||
        this.contact == "" ||
        this.phone == "" ||
        this.wx_code == "" ||
        this.advantage == ""
      ) {
        this.show8 = true;
        this.toasttext = "输入不能为空";
        return false;
      } else {
        if (this.value1 == "我是商家") {
          this.type = 2;
        } else {
          this.type = 1;
        }
        Http.post("api/user1/index/join_hands", {
          type: this.type,
          linkman: this.contact,
          city_id: this.idx,
          phone: this.phone,
          wx_code: this.wx_code,
          advantage: this.advantage,
          token: localStorage.getItem("token")
        }).then(res => {
          console.log(res);
          _this.show8 = true;
          _this.toasttext = res.data.msg;
        });
      }
    }
  },
  computed: {
    searchData: function() {
      var search = this.search;
      if (search) {
        return this.products.filter(function(product) {
          return Object.keys(product).some(function(key) {
            return (
              String(product[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }

      return this.products;
    }
  },
  created() {
    const that = this;
    let now = Date.parse(new Date()) / 1000;
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == "undefined" ||
      now - localStorage.getItem("tokenTime") > 84600 * 3
    ) {
      if (getUrlParam("code") == "") {
        location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/partner.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
      } else {
        this.show2 = true;
        Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
          res => {
            console.log(res);
            this.show2 = false;
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
            that.init();
          }
        );
      }
    } else {
      that.init();
    }
  }
};
</script>

<style>
.weui-cells .vux-no-group-title {
  background: #fff;
}
.vux-cell-box .vux-popup-picker-value {
  font-size: 0.28rem !important;
}
.vux-cell-box .weui-cell__hd {
  font-size: 0.28rem !important;
}
.partner {
  position: relative;
}
.ssdq {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.z_sousuokuang {
  background: url("../../assets/img/z_sousuokuang.png") no-repeat 5% center
    #eeeeee;
  background-size: 0.28rem 0.28rem;
  border-radius: 0.1rem;
  width: 95%;
  margin: 0 auto;
}
.z_inputs {
  padding-left: 0.8rem;
  width: 96%;
}
.xzcity {
  background: #f0f2f4;
}
.z_spa {
  padding: 0.2rem 0;
  border-bottom: 1px solid #eee;
}
</style>
