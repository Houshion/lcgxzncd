<template>
    <div>
        <ul>
            <li class="li">
                <router-link :to="{name:'addAwaken',query: {bed_id: bed_id}}">
                    <div>添加唤醒</div>
                    <div class="arrow">
                        <img src="../../assets/img/z_arror.png" alt="">
                    </div>
                </router-link>
            </li>
        </ul>
        <div class="listTitle">唤醒列表</div>
        <div class="wakeList">
            <swipeout v-for="(i,index) in list" :key="index">
                <swipeout-item transition-mode="follow">
                    <div slot="right-menu">
                    <swipeout-button @click.native="onDelete(i.aplan_id)" type="warn">删除</swipeout-button>
                    </div>
                    <div slot="content" class="demo-content vux-1px-t flex_sb">
                        <div>{{i.awaken_time_str}}</div>
                        <div @click="onChange(index,i.aplan_id)">
                            <x-switch :title="title" v-model="i.is_open"></x-switch>
                        </div>
                    </div>
                </swipeout-item>
            </swipeout>
        </div>
        <toast v-model="toast" type="text" :time="800" is-show-mask :text="toastText" position="bottom"></toast>
    </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, XSwitch, Toast } from "vux";
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";

export default {
  name: "addPackage",
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    XSwitch,
    Toast
  },
  data() {
    return {
      stringValue: 0,
      list: [
        // { awaken_time: "2018-08-08 08:08:00", open: true, aplan_id: 1 },
        // { awaken_time: "2018-08-08 08:08:00", open: true, aplan_id: 2 },
        // { awaken_time: "2018-08-08 08:08:00", open: true, aplan_id: 3 }
      ],
      title: "",
      toast: false,
      toastText: "",
      bed_id: this.$route.query.bed_id
    };
  },
  created() {
    const _this = this;

    Http.post("api/api/Index/api", {
      api_name: "getAwakenList",
      token: localStorage.getItem("token"),
      code: getUrlParam("code")
    }).then(res => {
      _this.list = res.data.data;
      for (let i = 0; i < res.data.data.length; i++) {
        _this.list[i].is_shock = res.data.data[i].is_shock == 1 ? true : false;
        _this.list[i].is_open = res.data.data[i].is_open == 1 ? true : false;
      }
      console.log(_this.list);
    });
  },
  methods: {
    onDelete(id) {
      const _this = this;

      Http.post("api/api/Index/api", {
        api_name: "delAwakenPlan",
        token: localStorage.getItem("token"),
        awaken_id: id
      }).then(res => {
        _this.toastText = res.data.msg;
        _this.toast = true;
        console.log(id);
        // setTimeout(() => {
        //   window.location.replace('http://www.zjgxkl.com/h5/dist/index.html#/awaken');
        // }, 2000);
        Http.post("api/api/Index/api", {
          api_name: "getAwakenList",
          token: localStorage.getItem("token"),
          code: getUrlParam("code")
        }).then(res => {
          _this.list = res.data.data;
          for (let i = 0; i < res.data.data.length; i++) {
            _this.list[i].is_shock =
              res.data.data[i].is_shock == 1 ? true : false;
            _this.list[i].is_open =
              res.data.data[i].is_open == 1 ? true : false;
          }
          console.log(_this.list);
        });
      });
    },
    onChange(i, id) {
      const _this = this;
      Http.post("api/api/Index/api", {
        api_name: "saveStatus",
        token: localStorage.getItem("token"),
        id: id,
        is_open: _this.list[i].is_open ? 0 : 1
      }).then(res => {
        console.log(_this.list);
      });
    },
    addWake() {}
  }
};
</script>

<style>
.weui-cells {
  margin-top: 0;
}
.li,
.li a {
  padding: 15px;
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #ffffff;
}
.li a {
  padding: 0;
  width: 100%;
}
.arrow {
  display: flex;
  align-items: center;
}
.arrow img {
  width: 50%;
}
.listTitle {
  border: 1px solid #eee;
  padding: 15px;
  border-left: none;
  border-right: none;
}
.wakeList .vux-swipeout-content {
  padding: 0 15px;
  border-bottom: 1px solid #eee;
}
</style>

