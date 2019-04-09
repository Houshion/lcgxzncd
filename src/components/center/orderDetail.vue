<template>
    <div class="orderDetail">
      <div class="flex1 pos_r" style="overflow: scroll;height: 100%" id="mmm">
        <div class="orderD">
       <!--   <img :src="z_img" class="z_toutu" >-->
          <swiper   auto loop dots-position="center" @on-index-change="onSwiperItemIndexChange" v-model="swiperItemIndex">
            <swiper-item v-for="(item, index) in demo01_list" :key="index" style="height:100%;width:100%;">
              <img :src="item" style="height:100%;width:100%;">
            </swiper-item>
          </swiper>
          <div class="plr30 bw">
            <p class="pt20 mb20">{{name}}</p>
            <p class="mb20"><span class="font16" style=" color:#ff5850;">¥{{price}}</span><span class="ml20 z_ld plr10" v-if="type_name!=''">{{type_name}}</span></p>
            <p class="flex_sb mb20"><span>快递：{{freight}}</span><span class="z_cols">月销量{{sales}}笔</span></p>
            <p class="pb20 col9 z_choose" @click="norms">选择: <span> 产品规格</span></p>
          </div>
          <p class="tac ptb30 col9">详情</p>
        </div>
        <div class="bw plr30" v-html="detail">
        </div>
        <!--购物车-->
        <router-link :to="{name:'car'}"  class="z_gouwucar">
          <img src="../../assets/img/z_gouwucar.png" style="position:relative;">
          <em v-show="show" class="l_num">{{numbers}}</em>
        </router-link>
        <!--遮罩层-->
        <div id="mask" v-show="close" ></div>
        <div id="norms" class="pos_r"  v-show="close">
          <!--删除-->
          <img src="../../assets/img/del.png" style="width: 0.23rem;height: 0.23rem;position: absolute;right: 0.3rem;top:0.3rem" @click="close_norms"/>
          <div class="bdb pb20 flex">
            <img :src="z_img" style="width: 2rem;height: 2rem;"/>
            <p class="ml20 flex flex_column">
              <span class="font17  color4 mt30" style=" color:#ff5850;">¥{{price}}</span>
              <span class="col9 mt20">请选择 产品规格</span>
            </p>
          </div>
          <div class="ptb20 bdb col6" v-for="(product,i1) in goods" :key="i1">
            <p>
              <span class="font14">产品{{product.name}}</span>
              <span class="">已选：<i>{{product.choose}}</i></span>
            </p>
            <ul class="flex flex_wrap forLabel">
              <label v-for="(i,i2) in product.data" :class="'r_label'+i1" :key="i2">
                <input type="radio" :name="'product'+i1" :value="i.text" @change="pickUp(i1,i2)" />
                <!-- <input type="radio" :name="'product'+i1" :value="i.text" @change="pickUp(i1,i2)" /> -->
                <span>{{i.text}}</span>
              </label>
            </ul>
          </div>
          <div class="ptb200">
            <p class="font16  mt10 mb30">数量</p>
            <div>
              <!--<group>-->
                <!--<x-number v-model="value" :min="1" :max="max" align="left" fillable></x-number>-->
              <!--</group>-->
              <div style="text-align:left;">
                <inline-x-number width="50px" :min="0" :max="max" v-model="value"></inline-x-number>
              </div>
            </div>
          </div>
        </div>

      </div>
        <div class="footer w100 flex" style="border-top:1px solid #ccc;z-index:9">
          <button class="box z_addcar font14" @click="gocar" style="height:59px;">加入购物车</button>
          <button class="box z_like font14" @click="buy" style="height:59px;">立即购买</button>
        </div>

      <toast v-model="show8" type="text" :text="toasttext" width="20em"></toast>
    </div>
</template>

<script>
import { Group, Toast, InlineXNumber, Swiper, SwiperItem } from "vux";
import Http from "../../httpClient/httpClient";
const baseList = [];
export default {
  name: "order-detail",
  components: {
    Group,
    Toast,
    InlineXNumber,
    Swiper,
    SwiperItem
  },
  data() {
    return {
      z_img: "",
      name: "",
      price: "",
      freight: "",
      sales: "",
      detail: "",
      goods: [],
      choose: "",
      car_num: "",
      close: false,
      id: "",
      show: true,
      numbers: "0",
      show8: false,
      max: "",
      toasttext: "",
      type_name: "",
      value: "1",
      demo01_list: baseList,
      sku: "",
      skuArr: [],
      spec: 0
    };
  },
  created() {
    var that = this;
    Http.post("api/Shopcar/api", {
      api_name: "shopList",
      token: localStorage.getItem("token")
    }).then(res => {
      console.log(res);
      that.numbers = res.data.data.num;
    });
  },
  beforeMount() {
    var that = this;
    document.title = this.$route.query.ti;
    Http.post("api/Home/home/api", {
      api_name: "detail",
      token: localStorage.getItem("token"),
      id: this.$route.query.id
    }).then(res => {
      that.z_img = res.data.data.img;
      that.name = res.data.data.name;
      that.price = res.data.data.price;
      that.freight = res.data.data.freight;
      that.sales = res.data.data.sales;
      that.detail = res.data.data.detail;
      that.id = res.data.data.id;
      that.max = res.data.data.store;
      that.type_name = res.data.data.type_name;
      that.demo01_list = res.data.data.imgs;
      that.value = res.data.data.store == 0 ? 0 : 1;

      // that.goods = res.data.data.guige;

      res.data.data.guige.forEach(item => {
        // item.choose = item.data[0].text
        (item.choose = ""), (item.chooseId = ""), that.goods.push(item);
      });
      console.log(that.goods);
    });

    /* Http.post('api/Shopcar/api',{
          api_name:'shopList',
          token:localStorage.getItem('token'),
        }).then((res)=>{
          console.log(res);
          this.numbers = res.data.data.num;
        })*/
  },
  methods: {
    pickUp(i1, i2) {
      const _this = this;

      _this.goods[i1].choose = _this.goods[i1].data[i2].text;
      _this.goods[i1].chooseId = _this.goods[i1].data[i2].id;

      _this.skuArr = [];
      _this.goods.forEach(item => {
        _this.skuArr.push(item.chooseId);
      });

      _this.sku = _this.skuArr.join("-");

      _this.getSkuPrice();

      console.log(JSON.stringify(_this.sku));
    },
    checkSku() {
      const _this = this;
      let status = true;
      _this.goods.forEach(item => {
        if (item.chooseId == "") {
          status = false;
        }
      });
      return status;
    },
    norms() {
      this.close = true;
    },
    close_norms() {
      this.close = false;
      document.getElementById("mmm").style.overflow = "scroll";
    },
    buy() {
      const _this = this;
      if (_this.checkSku()) {
        if (_this.value) {
          _this.$router.push({
            name: "confirmOrder",
            query: {
              num: _this.value,
              spec: _this.spec,
              goods_id: _this.id,
              type: "2"
            }
          });
        } else {
          _this.show8 = true;
          _this.toasttext = "请选择数量";
        }
      } else {
        _this.show8 = true;
        _this.toasttext = "请选择产品规格";
      }
    },
    getSkuPrice() {
      const _this = this;
      Http.post("api/Home/home/api", {
        api_name: "sku_price",
        token: localStorage.getItem("token"),
        pro_id: _this.id,
        sku_ids: _this.sku
      }).then(res => {
        if (res.data.code == 1) {
          _this.price = res.data.data.price;
          _this.spec = res.data.data.id;
          _this.max = res.data.data.store;
        } else {
          _this.value = 0;
          _this.max = 0;
        }
      });
    },
    gocar() {
      var _this = this;
      if (_this.checkSku()) {
        if (_this.value) {
          Http.post("api/Shopcar/api", {
            api_name: "addShopcar",
            token: localStorage.getItem("token"),
            shop_id: _this.$route.query.id,
            attribute: _this.spec,
            num: _this.value
          }).then(res => {
            console.log(res);
            _this.close = false;
            _this.show8 = true;
            _this.toasttext = res.data.msg;
            _this.numbers++;
          });
        } else {
          _this.show8 = true;
          _this.toasttext = "请选择数量";
          _this.close = true;
          document.getElementById("mmm").style.overflow = "hidden";
          document.getElementById("mmm").scrollTo(0, 0);
        }
      } else {
        _this.show8 = true;
        _this.toasttext = "请选择产品规格";
      }
    }
  }
};
</script>

<style scoped>
.orderDetail {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.z_toutu {
  height: 3.9rem;
  width: 100%;
}
.z_gouwucar {
  position: fixed;
  left: 1%;
  bottom: 10%;
  width: 1.54rem;
  height: 1.54rem;
}
.z_addcar {
  background: url("../../assets/img/z_addcar.png") no-repeat 20% center #fff;
  background-size: 0.32rem 0.29rem;
  width: 50%;
}
.z_like {
  background: url("../../assets/img/z_likegoumai.png") no-repeat 20% center
    #00c0ff;
  background-size: 0.32rem 0.29rem;
  width: 50%;
  color: #fff;
}
.z_cols {
  color: #00c0ff;
}
.z_ld {
  color: #ff5850;
  display: inline-block;
  background: url("../../assets/img/z_ldbg.png") no-repeat center center;
  background-size: 100% 100%;
  padding: 0.05rem 0.09rem;
}
.z_choose {
  background-image: url("../../assets/img/z_arror.png");
  background-size: 0.1rem 0.18rem;
  background-repeat: no-repeat;
  background-position: right 30%;
}
#mask {
  position: fixed;
  background: #000000;
  opacity: 0.5;
  left: 0;
  top: 0;
  bottom: 60px;
  width: 100%;
  height: 100%;
  z-index: 5;
}
#norms {
  padding: 0.3rem;
  position: fixed;
  background: #ffffff;
  left: 0;
  bottom: 60px;
  width: 92%;
  z-index: 10;
  /*border-bottom:1px solid #ccc;*/
}
.forLabel label {
  height: 0.5rem;
  margin-top: 4%;
  margin-bottom: 3%;
  padding-right: 0.2rem;
}
.forLabel label span {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid #999;
  color: #666;
  padding: 0 5px;
}
input[type="radio"] {
  display: none;
}
input[type="radio"]:checked + span {
  color: #00c0ff;
  border: 1px solid #00c0ff;
}
#x_number {
  width: 2rem;
  height: 0.5rem;
  display: flex;
}
.active {
  border: 1px solid #ccc;
  background: #fff;
}
#orderDetail .weui-cells:after {
  bottom: 0;
  border-bottom: none;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}

.l_num {
  width: 0.4rem;
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 12px;
  background: red;
  color: #fff;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  position: absolute;
  left: 60%;
  top: 6%;
}
</style>
