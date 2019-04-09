<template>
    <div class="frame">
      <img src="../../assets/img/bg-touxiang.png" style="height:0.06rem;">
      <div class=" ptb30 mb20 bdb z_arrow flex_a pl30" @click="goaddr">
        <img src="../../assets/img/z_dingwei.png" class="z_dw">
       <div class="pl30">
         <p class="font16 mb20">收货人：{{name}}{{mobile}}</p>
         <p class="font11 col9">{{total_address}}{{province_name}}{{area_name}}{{addresss}}</p>
       </div>
      </div>
      <div class="flex1" style="overflow-y: scroll;">
      <div class="flex_a ptb30 plr30 bdb" v-show="hide1" v-if="this.$route.query.type==2">
        <img :src="goods_img" class="mr20 z_img">
        <span class="flex flex_column z_Right">
              <span class="flex flex_column"><em class="mb10">{{names}}</em><em class="mb20">规格：{{sku_name}}</em></span>
              <span class="flex_sb"><em class="font18 z_cor">¥{{price}}<!-- <em class="col9 ml10 font11">2赖豆抵1元</em> --></em><em class="col9">数量：{{num}}</em></span>
            </span>
      </div>
        <div v-show="show0" v-if="this.$route.query.type==1">
          <div class="flex_a ptb30 plr30 bdb"  v-for="b in goods" :key="b">
            <img :src="b.img" class="mr20 z_img">
            <span class="flex flex_column z_Right">
                <span class="flex flex_column"><em class="mb10">{{b.name}}</em><em class="mb20">规格：{{b.attribute}}</em></span>
                <span class="flex_sb"><em class="font18 z_cor">¥{{b.price}}<!-- <em class="col9 ml10 font11">2赖豆抵1元</em> --></em><em class="col9">数量：{{b.num}}</em></span>
              </span>
          </div>
        </div>
      <div>
        <p class=" flex_sb plr30 ptb30 bdb"><span class="col6 font12">赖豆抵扣</span><span class="font12 col6">¥-{{offsetprice}}</span></p>
        <p class=" plr30 flex_sb ptb30 bdb"><span class="col6 font12">运费</span><span class="font12 col6">¥{{freight}}</span></p>
        <p class=" plr30 flex_sb ptb30 bdb"><span class="col6 font12">共{{num}}件商品</span><span class="font12 col6">小计：¥{{totalprice}}</span></p>
      </div>
      </div>
      <div class="z_fixed flex_sb pl30 w100">
        <span>合计：<em class="font18 z_cor">¥{{totalprice}}</em></span>
        <p style="height:100%;">
        <span class="col9 pr30">共{{nums}}{{num}}件商品</span>
        <button class="z_b plr60 font16 colw" @click="placeOrder">提交订单</button></p>
      </div>
      <toast v-model="show8" type="text" :text="toasttext" width="20em"></toast>
    </div>
</template>

<script>
import Http from "../../httpClient/httpClient";
import { Toast } from "vux";
export default {
  name: "confirm-order",
  components: { Toast },
  data() {
    return {
      hide1: true,
      show0: true,
      name: "",
      total_address: "",
      sku_name: "",
      price: "",
      num: "",
      offsetprice: "",
      freight: "",
      totalprice_org: "",
      totalprice: "",
      address_id: "",
      goods_img: "",
      mobile: "",
      province_name: "",
      area_name: "",
      addresss: "",
      goods: [],
      aid: "",
      sku: '',
      show8: false,
      toasttext: ""
    };
  },
  beforeMount() {
    var that = this;
    if (this.$route.query.type == 1) {
      var arr = localStorage.getItem("arr1");
      console.log(arr);
      Http.post("api/order/api", {
        api_name: "xiadan",
        car_ids: localStorage.getItem("arr1"),
        token: localStorage.getItem("token")
      }).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          that.name = res.data.data.address.contacts;
          that.mobile = res.data.data.address.mobile;
          that.province_name = res.data.data.address.province_name;
          that.area_name = res.data.data.address.area_name;
          that.addresss = res.data.data.address.address;
          that.aid = res.data.data.address.id;
          that.goods = res.data.data.goods;
          that.totalprice = res.data.data.totalprice;
          that.num = res.data.data.num;
          that.freight = res.data.data.freight;
          that.offsetprice = res.data.data.discount;
          console.log(that.goods);
        } else {
          that.show8 = true;
          that.toasttext = res.data.msg;
          setTimeout(() => {
            that.$router.push({
              name: "car",
            });
          }, 2000);
        }
      });
    } else if (this.$route.query.type == 2) {
      Http.post("api/Order/api", {
        api_name: "confirmOrder",
        token: localStorage.getItem("token"),
        goods_id: this.$route.query.goods_id,
        num: this.$route.query.num,
        spec: this.$route.query.spec
      }).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          that.name = res.data.data.order_contact.name;
          that.mobile = res.data.data.order_contact.phone;
          that.total_address = res.data.data.order_contact.total_address;
          that.names = res.data.data.order_detail.name;
          that.sku_name = res.data.data.order_detail.sku_name;
          that.price = res.data.data.order_detail.price;
          that.num = res.data.data.order_detail.num;
          that.offsetprice = res.data.data.order.offsetprice;
          that.freight = res.data.data.order.freight;
          that.totalprice_org = res.data.data.order.totalprice_org;
          that.totalprice = res.data.data.order.totalprice;
          that.address_id = res.data.data.order_contact.address_id;
          that.goods_img = res.data.data.order_detail.goods_img;
          that.sku = res.data.data.order_detail.sku_id;
        } else {
          that.show8 = true;
          that.toasttext = res.data.msg;
        }
      });
    }
  },
  methods: {
    goaddr() {
      this.$router.push("/addr");
    },
    placeOrder() {
      var _this = this;
      console.log(this.name);
      if (!this.name) {
        console.log(111);
        this.show8 = true;
        this.toasttext = "地址不能为空";
        return false;
      } else {
        if (this.$route.query.type == 2) {
          Http.post("api/Order/api", {
            api_name: "addOrder",
            token: localStorage.getItem("token"),
            goods_id: this.$route.query.goods_id,
            num: this.num,
            spec: this.sku,
            address_id: this.address_id
          }).then(res => {
            console.log(res);
            if (res.data.code == 1) {
              _this.$router.push({
                name: "cashier",
                query: {
                  orderid: res.data.data.orderid,
                  allprice: _this.totalprice
                }
              });
            } else {
              _this.show8 = true;
              _this.toasttext = res.data.msg;
            }
          });
        } else if (this.$route.query.type == 1) {
          Http.post("api/shop/order/index/set_order", {
            car_ids: localStorage.getItem("arr1"),
            token: localStorage.getItem("token"),
            contact_id: this.aid
          }).then(res => {
            console.log(res);
            if (res.data.code == 1) {
              _this.$router.push({
                name: "cashier",
                query: {
                  orderid: res.data.data.orderid,
                  allprice: _this.totalprice
                }
              });
            } else {
              _this.show8 = true;
              _this.toasttext = res.data.msg;
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.frame {
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}
.z_arrow {
  background: url("../../assets/img/z_arror.png") no-repeat 96% center;
  background-size: 0.1rem 0.18rem;
}
.z_dw {
  width: 0.28rem;
  height: 0.36rem;
}
.font11 {
  font-size: 0.26rem;
}

.z_img {
  width: 1.65rem;
  height: 1.65rem;
}
.z_cor {
  color: #ff5850;
}
.z_Right {
  width: 77%;
}

.z_fixed {
  height: 0.98rem;
  border-top: 1px solid #e5e5e5;
}

.z_b {
  background: #00c0ff;
  height: 100%;
}
</style>
