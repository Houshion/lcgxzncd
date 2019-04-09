<template>
  <div id="frame">
    <div class="menu">
      <span v-for="(list,index) in navLists" class="nav" :class="{ red:changeRed == index-1}" @click="reds(index)" id="span">{{list.text}}</span>
      <!--<span class="span">待付款</span>-->
      <!--<span class="span">待发货</span>-->
      <!--<span class="span">待收货</span>-->
    </div>
    <ul>
      <div v-for="item in arr" :key="item">
        <div v-if="changeRed < 0">
          <li class="bdb mb20 bw plr20" :key="item">
            <div @click="Payment(item.status,item.id)">
              <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{item.orderid}}</span><span class="z_coR">{{item.status == 0 ? "未付款" : item.status == 1 ? "待发货" : item.status==3?"已完成":"待收货"}}</span></p>
              <div class="flex_a ptb30 plr30 bdb" v-for="val in item.goods" :key="val" >
                <img :src="val.img" class="z_chanpin mr20">
                <span class="flex flex_column z_right">
                  <span class="flex flex_column"><em class="mb10">{{val.name}}</em><em class="mb20 z_ge">规格：{{val.sku_name}}</em></span>
                  <span class="flex_sb"><em class="font16 z_coR">¥{{val.price}}<em class="col9 z_ge ml10" v-if="val.is_type==1">{{val.type_name}}</em></em><em class="col9 z_ge">数量：{{val.num}}</em></span>
                </span>
              </div>
              <p class="flex_sb bdb ptb20 plr30 font12"><span class="col6">共{{item.goods.length}}件商品</span><span class="font12 col6">合计：¥{{item.totalprice}}</span></p>
            </div>
            <div v-if="item.status == 0">
              <p class="tae ptb30 plr30"><button class="z_yanse plr30 mr20 border-r1" @click="cancel(item.id)">取消订单</button><button class="ptb20 colw z_fukuan border-r1" @click="gopay(item.orderid,item.totalprice)">去付款</button></p>
            </div>
            <div v-else-if="item.status == 1"></div>
            <div v-else-if="item.status==2">
              <p class='tae ptb30 plr30'><button class='ptb20 colw z_fukuan border-r1' @click="confirm(item.id)">确认收货</button></p>
            </div>
          </li>
        </div>
        <div v-else>
          <li class="bdb mb20 bw plr20" v-if="item.status == changeRed" :key="item">
            <div @click="Payment(item.status,item.id)">
              <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{item.orderid}}</span><span class="z_coR">{{item.status == 0 ? "未付款" : item.status == 1 ? "待发货" : "待收货"}}</span></p>
              <div class="flex_a ptb30 plr30 bdb" v-for="val in item.goods" :key="val" >
                <img :src="val.img" class="z_chanpin mr20">
                <span class="flex flex_column z_right">
                  <span class="flex flex_column"><em class="mb10">{{val.name}}</em><em class="mb20 z_ge">规格：{{val.sku_name}}</em></span>
                  <span class="flex_sb"><em class="font16 z_coR">¥{{val.price}}<em class="col9 z_ge ml10" v-if="val.is_type==1">{{val.type_name}}</em></em><em class="col9 z_ge">数量：{{val.num}}</em></span>
                </span>
              </div>
              <p class="flex_sb bdb ptb20 plr30 font12"><span class="col6">共{{item.goods.length}}件商品</span><span class="font12 col6">合计：¥{{item.totalprice}}</span></p>
            </div>
            <div v-if="item.status == 0">
              <p class="tae ptb30 plr30"><button class="z_yanse plr30 mr20 border-r1" @click="cancel(item.id)">取消订单</button><button class="ptb20 colw z_fukuan border-r1" @click="gopay(item.orderid,item.totalprice)">去付款</button></p>
            </div>
            <div v-else-if="item.status == 1"></div>
            <div v-else>
              <p class='tae ptb30 plr30'><button class='ptb20 colw z_fukuan border-r1' @click="confirm(item.id)">确认收货</button></p>
            </div>
          </li>
        </div>
        
        <!-- <li class="bdb mb20 bw plr20"  v-show="one" v-if="item.status==0" :key="item">
          <div @click="nonPayment(0,item.id)">
            <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{item.orderid}}</span><span class="z_coR">未付款</span></p>
            <div class="flex_a ptb30 plr30 bdb" v-for="val in item.goods" :key="val" >
              <img :src="val.img" class="z_chanpin mr20">
              <span class="flex flex_column z_right">
                <span class="flex flex_column"><em class="mb10">{{val.name}}</em><em class="mb20 z_ge">规格：{{val.sku_name}}</em></span>
                <span class="flex_sb"><em class="font16 z_coR">¥{{val.price}}<em class="col9 z_ge ml10" v-if="val.is_type==1">{{val.type_name}}</em></em><em class="col9 z_ge">数量：{{val.num}}</em></span>
              </span>
            </div>
            <p class="flex_sb bdb ptb20 plr30 font12"><span class="col6">共{{item.goods.length}}件商品</span><span class="font12 col6">合计：¥{{item.totalprice}}</span></p>
          </div>
            <p class="tae ptb30 plr30"><button class="z_yanse plr30 mr20 border-r1" @click="cancel(item.id)">取消订单</button><button class="ptb20 colw z_fukuan border-r1" @click="gopay(item.orderid,item.totalprice)">去付款</button></p>
        </li>
        <li class="bdb mb20 bw plr20"  v-show="two" @click="accPaid(1,item.id)" v-if="item.status==1">
          <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{item.orderid}}</span><span class="z_coR">待发货</span></p>
          <div class="flex_a ptb30 plr30 bdb" v-for="i in item.goods">
            <img :src="i.img" class="z_chanpin mr20">
            <span class="flex flex_column z_right">
                <span class="flex flex_column"><em class="mb10">{{i.name}}</em><em class="mb20 z_ge">规格：{{i.sku_name}}</em></span>
                <span class="flex_sb"><em class="font16 z_coR">¥{{i.price}}<em class="col9 z_ge ml10" v-if="val.is_type==1">{{i.type_name}}</em></em><em class="col9 z_ge">数量：{{i.num}}</em></span>
              </span>
          </div>
          <p class="flex_sb bdb ptb20 plr30 font12"><span class="col6">共{{item.goods.length}}件商品</span><span class="font12 col6">合计：¥{{item.totalprice}}</span></p>
        </li>
        <li class="bdb mb20 bw plr20" v-show="three" v-if="item.status==2" @click="go_revevied(item.id)">
          <div>
              <p class="flex_sb bdb ptb30 plr30"><span>订单编号:{{item.orderid}}</span><span class="z_coR">待收货</span></p>
              <div class="flex_a ptb30 plr30 bdb" v-for="b in item.goods">
                <img :src="b.img" class="z_chanpin mr20">
                <span class="flex flex_column z_right">
                    <span class="flex flex_column"><em class="mb10">{{b.name}}</em><em class="mb20 z_ge">规格：{{b.sku_name}}</em></span>
                    <span class="flex_sb"><em class="font16 z_coR">¥{{b.price}}<em class="col9 z_ge ml10" v-if="val.is_type==1">{{b.type_name}}</em></em><em class="col9 z_ge">数量：{{b.num}}</em></span>
                  </span>
              </div>
              <p class="flex_sb bdb ptb20 plr30 font12"><span class="col6">共{{item.goods.length}}件商品</span><span class="font12 col6">合计：¥{{item.totalprice}}</span></p>
          </div>
          <p class="tae ptb30 plr30"><button class="ptb20 colw z_fukuan border-r1">确认收货</button></p>
        </li> -->
      </div>
    </ul>

    <div v-transfer-dom>
        <confirm
          v-model="show"
          title="confirm title"
          confirm-text="confirm text"
          @on-cancel="onCancel"
          @on-confirm="onConfirm"
         >

        </confirm>
      </div>

      <toast v-model="show8" type="text" :text="toasttext"></toast>
  </template>

<script>
 import { Confirm ,Toast,TransferDomDirective as TransferDom} from 'vux'
import Http from "../../httpClient/httpClient";
export default {
  name: "shopOrder",
   directives: {
      TransferDom
    },
    components: {
      Confirm,
      Toast
    },
  data() {
    return {
      one: true,
      two: true,
      three: true,
      navLists: [
        {
          text: "全部"
        },
        {
          text: "待付款"
        },
        {
          text: "待发货"
        },
        {
          text: "待收货"
        }
      ],
      changeRed: -1,
      arr: [],
      goods: [],
      type: "",
      no: false
    };
  },

  methods: {
    reds: function(index) {
      this.changeRed = index - 1;
      console.log(this.changeRed);
      if (index == 1) {
        (this.one = true), (this.two = false), (this.three = false);
      } else if (index == 2) {
        (this.one = false), (this.two = true), (this.three = false);
      } else if (index == 3) {
        (this.one = false), (this.two = false), (this.three = true);
      } else {
        (this.one = true), (this.two = true), (this.three = true);
      }
      console.log(this.one, this.two, this.three);
    },
    //待付款，待发货
    Payment(status, type) {
      let name,
        num = 0;
      if (status == 0) {
        name = "nonpayment";
      } else if (status == 1) {
        name = "accPaid";
        num = 1;
      }
      else{
        name = "recevied";
      }
      console.log(name, num, type);
      this.$router.push({ name: name, query: { id: num, type: type,status:status } });
    },
    confirm(id) {
      console.log(id)
      let _this = this
      let idx =  id
        this.$vux.confirm.show({
          title: '是否确认收货？',
          confirmText:'知道了',
          // 组件除show外的属性
          onCancel () {
            console.log(this) // 非当前 vm
            console.log(_this) // 当前 vm
          },
          onConfirm (id) {
            console.log(idx);
            Http.post('api/Order/api',{api_name:'confirmReceipt',token:localStorage.getItem('token'),id:idx}).then((res)=> {
              console.log(res);
              _this.show8 = true;
              _this.toasttext = res.data.msg;
              setTimeout(function(){
                 Http.post("api/Order/api", {
                    api_name: "orderList",
                    token: localStorage.getItem("token")
                  }).then(res => {
                    console.log(res);
                    _this.arr = res.data.data;
                  });
              },1500)
            })
          }
        })
    },
    //取消订单
    cancel(itid) {
      Http.post("api/Order/api", {
        api_name: "cancel",
        token: localStorage.getItem("token"),
        id: itid
      }).then(res => {
        console.log(res);
        var that = this;
        Http.post("api/Order/api", {
          api_name: "orderList",
          token: localStorage.getItem("token")
        }).then(res => {
          console.log(res);
          that.arr = res.data.data;
        });
      });
    },
    //  去付款
    gopay(orderid, allprice) {
      console.log(orderid);
      this.$router.push({
        name: "cashier",
        query: { orderid: orderid, allprice: allprice }
      });
    }
  },
  created() {
    var that = this;
    Http.post("api/Order/api", {
      api_name: "orderList",
      token: localStorage.getItem("token")
    }).then(res => {
      // console.log(res.data.data);
      that.arr = res.data.data;
      console.log(that.arr);
    });
  }
};
</script>

<style scoped>
.red {
  border-bottom: 2px solid #00c0ff;
  color: #00c0ff;
}
#frame {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.menu {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.menu #span {
  padding: 3% 0;
  width: 25%;
  text-align: center;
}
.menu .activ {
  border-bottom: 2px solid #00c0ff;
  color: #00c0ff;
}
ul {
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
ul::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.z_chanpin {
  width: 1.64rem;
  height: 1.64rem;
}

.z_right {
  width: 77%;
}
.z_ge {
  font-size: 0.22rem;
}
.z_coR {
  color: #ff5850;
}
.z_yanse {
  border: 1px solid #00c0ff;
  color: #00c0ff;
  padding-top: 0.17rem;
  padding-bottom: 0.17rem;
}
.z_fukuan {
  background: #00c0ff;
  padding-left: 1rem;
  padding-right: 1rem;
}
#frame .yo-scroll {
  top: 0.9rem;
}
</style>
