<template>
  <div>
    <div class="bg">
        <img :src="bgImg" alt="" class="w100" style="height:2.8rem;">
    </div>
    <div class="message">
        <div class="msg">
            <div class="flex">设备编号：{{deviceNum}}</div>
            <div class="flex">设备状态：
                <span :class='deviceStatus ? "green" : "red"'>{{deviceStatus ? "设备正常" : "设备异常"}}</span>
            </div>
        </div>
    </div>
    <div class="package">
        <div>请选择套餐</div>
        <div class="packageList">
            <div :class="i.status?'select':'unselect'" v-for="(i,index) in packageList" :key="index" @click="select(index,i.id,i.time,i.money)">{{i.name}}</div> 
            <div class="confirmBtn" @click="confirmBuy()">确定</div> 
        </div>
    </div>
    <toast v-model="toast" type="text" :time="1500" is-show-mask :text="toastText" position="bottom"></toast>
  </div>
</template>

<script>
import { Toast } from "vux";
import buttoms from "../buttoms/buttoms.vue";
import getUrlParam from "../dlc/getUrl.js";
import Http from "../../httpClient/httpClient";

export default {
  name: "addPackage",
  components: {
    buttoms,
    Toast
  },
  created: function() {
    const _this = this;
    console.log(_this.$route.query.device_number, _this.$route.query.type);
    _this.deviceNum = _this.$route.query.device_number;
    // _this.deviceNum = 123456789;

    Http.post("api/api/Index/api", {
      api_name: "getStandardList",
      device_number: _this.deviceNum,
      token: localStorage.getItem("token"),
      type: _this.$route.query.type
    }).then(res => {
      if (res.data.code == 1) {
        _this.selctId = res.data.data.list[0].hotelt_id;
        _this.bgImg = res.data.data.img;
        for (var i = 0; i < res.data.data.list.length; i++) {
          _this.packageList.push({
            id: res.data.data.list[i].hotelt_id,
            status: i == 0 ? true : false,
            name:
              res.data.data.list[i].duration +
              "分钟 " +
              res.data.data.list[i].money +
              "元",
            time: res.data.data.list[i].duration,
            money: res.data.data.list[i].money
          });
          if (i == 0) {
            _this.money = res.data.data.list[i].money;
            _this.time = res.data.data.list[i].duration;
          }
        }
      } else {
        _this.toast = true;
        _this.toastText = res.data.msg
        setTimeout(() => {
            WeixinJSBridge.call('closeWindow');
        }, 1500);
      }
    });
  },
  data() {
    return {
      deviceNum: "2013154651851",
      deviceStatus: true,
      packageList: [
        // { status: true, name: "30分钟 9.9元" },
        // { status: false, name: "120分钟 19.9元" },
        // { status: false, name: "360分钟 39.9元" }
      ],
      selctId: 0,
      money: 0,
      time: 0,
      toast: false,
      toastText: "",
      bgImg: ""
    };
  },
  methods: {
    select(index, id, time, money) {
      for (let i = 0; i < this.packageList.length; i++) {
        this.packageList[i].status = false;
      }
      this.packageList[index].status = !this.packageList[index].status;
      this.selctId = id;
      this.money = money;
      this.time = time;
    },
    confirmBuy() {
      const _this = this;
      this.$router.push({
        name: "pay",
        query: {
          deviceNum: this.deviceNum,
          hotelt_id: this.selctId,
          time: this.time,
          money: this.money
        }
      });
    }
  }
};
</script>

<style scoped>
.flex {
  display: flex;
  font-size: 12px;
}
.message {
  display: flex;
  padding: 10px 15px;
  margin: 10px 0;
  background: #ffffff;
}
.message .msg div {
  padding: 5px 0;
}
.green {
  color: #2fe89c;
}
.red {
  color: #ff5850;
}
.package {
  background: #ffffff;
  padding: 10px 15px;
}
.packageList div.select,
.packageList div.confirmBtn {
  border: #00c0ff 1px solid;
  background: #00c0ff;
  width: 95%;
  margin: 10px auto 0;
  text-align: center;
  border-radius: 5px;
  padding: 15px 0;
  color: #ffffff;
  box-shadow: 1px 1px 3px #88d6f0;
}
.packageList div.confirmBtn {
  margin-top: 30px;
  border-radius: 30px;
}
.packageList div.unselect {
  border: #00c0ff 1px solid;
  width: 95%;
  margin: 10px auto 0;
  text-align: center;
  border-radius: 5px;
  padding: 15px 0;
  color: #00c0ff;
  box-shadow: 1px 3px 10px #88d6f0;
}
</style>