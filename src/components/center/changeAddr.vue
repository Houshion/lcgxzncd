<template>
  <div class="changeAddr flex_column flex">
  	<div class="flex1">
    <div class="pl30 bw">
    <div class="ptb30 bdb font16">收货人：<input type="text" placeholder="请输入收货人名称" v-model="input1"></div>
    <div class="ptb30 bdb font16">联系电话：<input type="number" placeholder="请输入收货人联系电话" v-model="input2"></div>
    </div>
    <group>
       <popup-picker :title="title" :data="list" :columns="3" v-model="value" show-name @on-change="onChange"></popup-picker>
     </group>
    <textarea name="" id="" cols="50" rows="10" placeholder="请填写详细地址" class="ptb30 pl30 bdb font16 bw" v-model="input3"></textarea>
    <div class="flex_sb bdb plr30 bw"><span class="font18">设为默认</span>
      <group>
        <x-switch title="" v-model="value1" @on-change="change"></x-switch>
      </group>
    </div>
  	</div>
    <button class="z_addrs colw font19" v-model="show1" @click="confirm">保存</button>
    <toast v-model="show1" type="text" :text="toasttext" width="20em"></toast>
  </div>
</template>

<script>
import { PopupPicker, Group, XSwitch, Toast } from "vux";
import Http from "../../httpClient/httpClient";
export default {
  components: {
    PopupPicker,
    Group,
    XSwitch,
    Toast
  },
  data() {
    return {
      title: "省市区",
      list: citySelect,
      value: [],
      value1: false,
      show1: false,
      input1: "",
      input2: "",
      input3: "",
      toasttext: "",
      type: ""
    };
  },
  methods: {
    confirm() {
      if(this.input1=="" || this.input2=="" || this.input3==""){
        this.toasttext = "输入不能为空";
          this.show1 = true;
          return false;
      }else{
           var that = this;
      if (that.$route.query.id == 2) {
        Http.post("api/Address/api", {
          api_name: "saveAddress",
          token: localStorage.getItem("token"),
          type: 2,
          id: that.$route.query.idx,
          contacts: that.input1,
          mobile: that.input2,
          province_id: that.value[0],
          city_id: that.value[1],
          area_id: that.value[2],
          address: that.input3
        }).then(res => {
          console.log(res);
          that.toasttext = res.data.msg;
          that.show1 = true;
          if (that.value1 == true) {
            Http.post("api/Address/api", {
              api_name: "isDefault",
              token: localStorage.getItem("token"),
              id: that.$route.query.idx
            }).then(res => {
              console.log(res);
            });
          }
          if (res.data.code == 1) {
            setTimeout(() => {
              that.$router.go(-1);
            }, 2000);
          }
        });
      } else {
        if (that.value1 == true) {
          that.type = 1;
        } else {
          that.type = 0;
        }
        if (that.value.length <= 0) {
          that.show1 = true;
          that.toasttext = "请选择地区";
        } else {
          var province_id = that.value[0];
          var city_id = that.value[1];
          var area_id = that.value[2];
          Http.post("api/Address/api", {
            api_name: "add",
            token: localStorage.getItem("token"),
            contacts: that.input1,
            mobile: that.input2,
            province_id: province_id,
            city_id: city_id,
            area_id: area_id,
            address: that.input3,
            type: that.type
          }).then(res => {
            console.log(res);
            that.toasttext = res.data.msg;
            that.show1 = true;
            if (res.data.code == 1) {
              setTimeout(() => {
                that.$router.go(-1);
              }, 2000);
            }
          });
        }
      }
      }
     
    },
    onChange() {
      console.log(that.value[0]);
    }
  },
  created() {
    var _this = this;
    if (_this.$route.query.id == 2) {
      Http.post("api/Address/api", {
        api_name: "saveAddress",
        token: localStorage.getItem("token"),
        type: 1,
        id: _this.$route.query.idx
      }).then(res => {
        console.log(res);
        _this.input1 = res.data.data.contacts;
        _this.input2 = res.data.data.mobile;
        _this.input3 = res.data.data.address;
        _this.value = [
          res.data.data.province_id,
          res.data.data.city_id,
          res.data.data.area_id
        ];
        console.log(_this.value);
        if (res.data.data.is_status == 1) {
          _this.value1 = true;
        }
      });
    }
  }
};
</script>
<style>
.changeAddr {
  position: relative;
  overflow: hidden;
  height: 100%;
}
.z_addrs {
  height: 1rem;
  width: 100%;
  background: #00c0ff;
}
.vux-no-group-title {
  margin-top: 0 !important;
}
.weui-cells:before {
  border-top: 0 !important;
}
.weui-cells {
  font-size: 0.32rem !important;
}

label {
  width: auto;
  margin-bottom: 0px;
  height: auto;
}
label span {
  width: auto;
  height: auto;
  display: -ms-flexbox;
  display: initial;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 0;
  border: none;
  color: initial;
}
</style>
