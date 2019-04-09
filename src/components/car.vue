<template>
<div style="height: 100%;" class="flex_column flex">

	<div class="flex_sb plr24 ptb30 bdb">
		<span class="col9 font16">购物车（{{goods.length}}）</span>
		<span v-show="show" @click="aa" class="font16">编辑</span>
		<span v-show="hide" @click="aa" class="font16">确认</span>
	</div>
	<div class="flex_column flex flex1" style="overflow-y: scroll;">
		<ul class="bw flex1 plr24">
			<li class="bdb" v-for="i in goods" >
				<label>
					<input type="checkbox" name="goods" hidden='' :value="i.id" v-model="checkModel" :data-num="i.price"  :data-shop="i.shop_id"  @change="b($event)" :data-price="i.num"  class="ipts"/>
					<div class="goods_info flex ptb30">
						<div class="flex1 flex">
							<img :src="i.img" style="width: 1.64rem;height: 1.64rem;margin-right: 0.2rem;"/>
							<p class="flex flex_column">
								<span class="font14">{{i.shop_name}}</span>
								<span class="font12 mt20 mb30 col6">规格：{{i.attribute}}</span>
								<span class="font16 color3">¥{{i.price}}<!-- <span class="ml20 plr10 col9" style=" font-size:0.22rem;">{{i.discount==""?"":i.discount}}</span> --></span>
							</p>
						</div>
						<span class="col9 font12">数量：{{i.num}}</span>
					</div>
				</label>
			</li>
			<!--<li class="bdb">
				<label>
					<input type="checkbox" name="goods" hidden='' value="002" v-model="goods" @change="b"/>
					<div class="goods_info flex ptb30">
						<div class="flex1 flex">
							<img src="../assets/img/img0.png" style="width: 1.64rem;height: 1.64rem;margin-right: 0.2rem;"/>
							<p class="flex flex_column">
								<span class="font14">赖床多功能床垫</span>
								<span class="font12 mt20 mb30 col6">规格：中型</span>
								<span class="font16 color3">¥288</span>
							</p>
						</div>
						<span class="col9 font12">数量：01</span>
					</div>
				</label>
			</li>-->
		</ul>
	</div>
  <div class="bdt bw flex">
    <p class="flex1 flex_sb plr30">
      <label class="all">
        <input type="checkbox" name="all" hidden='' @change="c" v-model="all"/>
        <span class="col9">全选（{{a}}）</span>
      </label>
      <span v-show="show" class="color3">￥{{total_fee}}</span>
    </p>
    <button v-show="show" class="ptb30 w20 colw bgc1 font16" @click="check" >结算</button>
    <button v-show="hide" class="ptb30 w20 colw bgc2 font16" @click="del">删除</button>
  </div>
  <toast v-model="show8" type="text" :text="toasttext"></toast>
</div>
</template>

<script>
import Http from "../httpClient/httpClient";
import { Toast } from "vux";
export default {
  name: "recharge",
  components: { Toast },
  data() {
    return {
      show: true,
      hide: false,
      goods: [
        /*{id:'001',name:'赖床多功能床垫',pirce:10},
    		 	  {id:'002',name:'多功能床垫',pirce:20},
    		 	  {id:'003',name:'赖床多',pirce:30}*/
      ],
      checkModel: [],
      all: false,
      a: 0,
      carval: "",
      total_fee: 0,
      carid: [],
      show8: false,
      toasttext: ""
    };
  },
  beforeMount() {
    var that = this;
    Http.post("api/Shopcar/api", {
      api_name: "shopList",
      token: localStorage.getItem("token")
    }).then(res => {
      console.log(res);
      that.goods = res.data.data.shop_list;
    });
  },
  watch: {
    //  		checkModel:{//深度监听
    //  			handler(val, oldVal){
    //  				console.log(oldVal)
    //  				if(this.checkModel.length==this.goods.length){
    //  					this.all=true
    //  				}else{
    //  					this.all=false
    //  				}
    //  			},
    //  			deep:true
    //  		}
    checkModel: function(val, oldVal) {
			console.log(val);
      if (this.checkModel.length == this.goods.length) {
        this.all = true;
        this.a = val.length;
        console.log(val, oldVal);
      } else {
        this.all = false;
        this.a = val.length;
      }
    }
  },
  methods: {
    aa() {
      (this.all = false), (this.checkModel = []), (this.total_fee = 0);
      if (this.show) {
        this.show = false;
        this.hide = true;
      } else {
        this.show = true;
        this.hide = false;
      }
    },
    b(e) {
      if (e.target.checked) {
        this.total_fee += Number(
          e.target.getAttribute("data-num") *
            e.target.getAttribute("data-price")
        );
      } else if (!e.target.checked) {
        this.total_fee -= Number(
          e.target.getAttribute("data-num") *
            e.target.getAttribute("data-price")
        );
      }
    },
    c() {
      this.checkModel = [];
      this.total_fee = 0;
      if (this.all == true) {
        this.goods.forEach((val, idx) => {
          this.checkModel.push(val.id);
          this.total_fee += Number(val.price * val.num);
        });
      }
    },
    d(i) {
    },
    check() {
      var ipts = document.getElementsByClassName("ipts");
      var arr = [];
      for (var i = 0; i < ipts.length; i++) {
        if (ipts[i].checked) {
          arr.push(ipts[i].value);
          this.carid.push(ipts[i].getAttribute("data-shop"));
        }
      }
      if (this.a > 0) {
        this.$router.push({ name: "confirmOrder", query: { type: "1" } });
        localStorage.setItem("arr1", arr.join(","));
      }else{
				this.show8 = true;
				this.toasttext = "请选择商品进行结算"
			}

    },
    //删除
    del() {
      var _this = this;
      var ipts = document.getElementsByClassName("ipts");
      for (var i = 0; i < ipts.length; i++) {
        if (ipts[i].checked) {
          this.carid.push(ipts[i].value);
        }
      }
      Http.post("api/Shopcar/api", {
        api_name: "delShop",
        token: localStorage.getItem("token"),
        id: this.carid.join(",")
      }).then(res => {
        if(res.data.code==1){
        _this.show8 = true;
        _this.toasttext = res.data.msg;
        Http.post("api/Shopcar/api", {
          api_name: "shopList",
          token: localStorage.getItem("token")
        }).then(res => {
          _this.goods = res.data.data.shop_list;
        });
        }else{
          _this.toasttext ='请选择商品'
        }
      });
      
    }
  }
};
</script>

<style>
.all span {
  padding-left: 0.5rem;
  background-image: url(../assets/img/z_circle0.png);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 0.36rem;
}
input[name="all"]:checked + span {
  background-image: url(../assets/img/z_circle.png);
}
.goods_info {
  padding-left: 0.5rem;
  background-image: url(../assets/img/z_circle0.png);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 0.36rem;
}
input[name="goods"]:checked + div {
  background-image: url(../assets/img/z_circle.png);
}
</style>
