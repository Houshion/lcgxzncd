
<template>
  <div>
    <ul>
      <li class="li">
        <div>智能唤醒时长</div>
        <div class="arrow">
          <popup-picker :title="title" :data="minuteList" v-model="minutes"></popup-picker>
        </div>
      </li>
      <li class="switch li">
        <div>唤醒震动</div>
        <x-switch :title="title" v-model="open"></x-switch>
      </li>
      <li class="li">
        <div>日期</div>
        <div class="arrow">
          <datetime
            v-model="dateTime"
            format="YYYY-MM-DD HH:mm"
            :start-date="startDate"
            :end-date="endDate"
            @on-change="change"
            :compute-hours-function="computeHoursFunction"
            :title="title"
          ></datetime>
        </div>
      </li>
    </ul>
    <button class="button" @click="add()">添加</button>
    <toast
      v-model="toast"
      type="text"
      :time="1500"
      is-show-mask
      :text="toastText"
      position="bottom"
    ></toast>
  </div>
</template>

<script>
import {
  Swipeout,
  SwipeoutItem,
  SwipeoutButton,
  XSwitch,
  Datetime,
  Picker,
  PopupPicker,
  DatetimeRange,
  Toast
} from "vux";
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";

let minute = [],
  minuteList = [];
for (let i = 1; i <= 1; i++) {
  minute.push({ name: "1 分", value: 1 }, { name: "2 分", value: 2 });
}

export default {
  name: "addPackage",
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XSwitch,
    Datetime,
    Picker,
    PopupPicker,
    DatetimeRange,
    Toast
  },
  data() {
    return {
      open: true,
      title: "",
      startDate:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1) +
        "-" +
        (new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate()),
      dateTime: "",
      // dateTime: [],
      minutes: ["1"],
      minuteList: [minute],
      toast: false,
      toastText: "",
      endDate:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1) +
        "-" +
        (new Date().getDate() + 1 < 10
          ? "0" + (new Date().getDate() + 1)
          : new Date().getDate() + 1),
      minute_list: [],
      hour_list: [],
      computeHoursFunction(date, isToday, generateRange) {
        if (isToday) {
          return generateRange(new Date().getHours(), 23);
        } else {
          return generateRange(0, 23);
        }
      }
    };
  },
  created() {
    const _this = this;
    console.log(new Date().getHours(), new Date().getMinutes());
    // 获取时间，过滤当前以前的时间
    _this.get_hours();
    _this.get_minustes();
  },
  methods: {
    get_hours() {
      const _this = this;
      let hour_list = [];
      let hour = new Date().getHours();
      for (let i = hour; i < 24; i++) {
        hour_list.push(i);
      }
      _this.hour_list = [...hour_list];
      console.log(_this.hour_list);
    },
    get_minustes() {
      const _this = this;
      let minute_list = [];
      let minute = new Date().getMinutes();
      for (let i = minute; i < 60; i++) {
        minute_list.push(i);
      }
      _this.minute_list = [...minute_list];
      console.log(_this.minute_list);
    },
    onButtonClick(type) {
      // alert("on button click " + type);
    },
    change(value) {
      console.log("change", value);
      this.dateTime = value;
    },
    addWake() {
      //
    },
    onConfirm() {
      //
    },
    log(str1, str2 = "") {
      console.log(str1, str2);
    },
    add() {
      const _this = this;
      let time;
      if (_this.dateTime == "") {
        // time = new Date().valueOf();
        _this.toast = true;
        _this.toastText = "日期不能为空";
        return;
      } else {
        time = _this.dateTime + ":00";
        let resData = time.replace(/-/g, "/");
        time = Date.parse(resData).toString();
      }
      let param = {
        // code: getUrlParam("code"),
        music_num: 1,
        bed_id: _this.$route.query.bed_id,
        api_name: "addAwakenPlan",
        awaken_duration: _this.minutes * 60,
        is_shock: _this.open ? 1 : 0,
        awaken_time: parseInt(time.slice(0, 10)),
        token: localStorage.getItem("token")
      };
      Http.post("api/api/Index/api", param).then(res => {
        if (res.data.code == 1) {
          _this.toastText = res.data.msg;
          _this.toast = true;
          setTimeout(() => {
            history.go(-1);
          }, 1000);
        } else {
          _this.toastText = res.data.msg;
          _this.toast = true;
        }
      });
    }
  }
};
</script>

<style>
.weui-cells {
  margin-top: 0;
}
li.li {
  padding: 15px;
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #eee;
}
li.switch {
  padding: 0 15px;
}
.arrow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 50%;
  text-align: right;
}
.arrow img {
  margin-left: 10px;
  width: 3%;
}
.vux-cell-value {
  color: #ccc;
  width: 100%;
}
.vux-picker,
.vux-cell-box {
  width: 100%;
}
.button {
  width: 100%;
  text-align: center;
  background: #46d1ff;
  padding: 15px 0;
  position: fixed;
  bottom: 0;
  color: #ffffff;
}
</style>

