<template>
  <div v-if="!abnormal">
    <div class="mask" v-show="show" @click="close"></div>
    <div class="controlor">
      <div style="width:200px;height:200px;">
        <x-circle :percent="percent" :stroke-width="3" stroke-color="#77ddff" anticlockwise>
          <div class="circleDiv flex_sb">
            <div class="font30">{{deviceMsg.surplus_time}}</div>
            <div>倒计时</div>
            <div class="bigImg" @click="open()" v-if="funcStatus">
              <img src="../../assets/img/o_bofang.png" v-if="!status">
              <img src="../../assets/img/o_zangting.png" v-else>
            </div>
            <div class="bigImg" v-else>
              <img src="../../assets/img/o_bofang2.png" v-if="!status">
              <img src="../../assets/img/o_zangting2.png" v-else>
            </div>
          </div>
        </x-circle>
      </div>
      <div @click="player()" class="player" v-if="funcStatus">
        <div class="flex_aj" v-if="play">
          <img src="../../assets/img/o_bofang.png">
          <div>启动震动、音乐</div>
        </div>
        <div class="flex_aj" v-else>
          <img src="../../assets/img/o_zangting.png">
          <div>停止震动、音乐</div>
        </div>
      </div>
      <div class="player" v-else>
        <div class="flex_aj" v-if="play">
          <img src="../../assets/img/o_bofang2.png">
          <div>启动震动、音乐</div>
        </div>
        <div class="flex_aj" v-else>
          <img src="../../assets/img/o_zangting2.png">
          <div>停止震动、音乐</div>
        </div>
      </div>
      <!-- <router-link :to="{name:'addPackage', query: { device_number: deviceMsg.device_number, type: 2 }}" class="more flex_aj">加时</router-link> -->
      <div class="more flex_aj" @click="addMoreTime()">加时</div>
    </div>
    <div class="functionBtn flex_sa">
      <div
        v-for="(b,index) in btn"
        @click="clickBtn(index)"
        class="btn"
        :class="b.className"
        :key="index"
      >
        <router-link
          v-if="index==3"
          :to="{name:'awaken',query: {bed_id: deviceMsg.bed_id}}"
          class="flex_sa"
        >
          <div class="btnImg">
            <img v-if="b.status" :src="b.pickImg">
            <img v-else :src="b.unImg">
          </div>
          <div>
            <p style="color:#46d1ff">{{b.name}}</p>
            <p class="font10" v-if="index == 0">{{type1Name}}</p>
          </div>
        </router-link>
        <div v-else class="flex_sa">
          <div class="btnImg">
            <img v-if="b.status" :src="b.pickImg">
            <img v-else :src="b.unImg">
          </div>
          <div>
            <p>{{b.name}}</p>
            <p class="font10" v-if="index == 0">{{type1Name}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mgb60">
      <a :href="'tel:'+deviceMsg.cs_tel">客服电话: {{deviceMsg.cs_tel}}</a>
    </div>

    <div class="iconClose" v-show="closeIcon" @click="close">
      <x-icon type="ios-close" size="30"></x-icon>
    </div>
    <!-- 情趣震动选择框 -->
    <div class="type1" v-show="type1">
      <div
        v-for="(b,index) in btn1"
        @click="changeEx(index)"
        class="btn"
        :class="b.className"
        :key="index"
      >{{b.name}}</div>
      <div class="btn confirmBtn" @click="clickBtn1()">确定</div>
    </div>

    <!-- 体感音乐选择框 -->
    <div class="type2" v-show="type2">
      <div class="picker2">
        <picker :data="typeMsg2" v-model="typeData2" @on-change="changeSong"></picker>
      </div>
      <div class="musicName1">{{musicName}}</div>
      <div class="playControl flex_sb" v-if="funcStatus">
        <div class="iconLast" @click="changeModel(31)">
          <img src="../../assets/img/o_last.png" alt>
        </div>
        <div class="iconPlay1" @click="Play()">
          <img src="../../assets/img/bofang11.png" v-if="play">
          <img src="../../assets/img/o_pause.png" v-else>
        </div>
        <div class="iconNext" @click="changeModel(32)">
          <img src="../../assets/img/o_next.png" alt>
        </div>
      </div>
      <div class="playControl flex_sb" v-else>
        <div class="iconLast">
          <img src="../../assets/img/o_last2.png" alt>
        </div>
        <div class="iconPlay1">
          <img src="../../assets/img/bofang22.png" v-if="play">
          <img src="../../assets/img/o_pause2.png" v-else>
        </div>
        <div class="iconNext">
          <img src="../../assets/img/o_next2.png" alt>
        </div>
      </div>
      <div class="rangBox flex">
        <div class="rangTitle">音量</div>
        <!-- <x-number :title="title" v-model="loud1" button-style="square" @on-change="change1"></x-number> -->
        <div class="rangButton flex flex_sa" v-if="funcStatus">
          <div @click="changeModel(35)">-</div>
          <div @click="changeModel(34)">+</div>
        </div>
        <div class="rangButton flex flex_sa" v-else>
          <div class="no">-</div>
          <div class="no">+</div>
        </div>
      </div>
      <div class="rangBox flex">
        <div class="rangTitle">力度</div>
        <!-- <x-number :title="title" v-model="power" button-style="square" @on-change="change2"></x-number> -->
        <div class="rangButton flex flex_sa" v-if="funcStatus">
          <div @click="changeModel(37)">-</div>
          <div @click="changeModel(36)">+</div>
        </div>
        <div class="rangButton flex flex_sa" v-else>
          <div class="no">-</div>
          <div class="no">+</div>
        </div>
      </div>
    </div>

    <!-- 儿童故事选择框 -->
    <div class="type3" v-show="type3">
      <div class="picker3">
        <picker :data="typeMsg3" v-model="typeData3" @on-change="changeSong"></picker>
      </div>
      <div class="musicName2">{{musicName}}</div>
      <div class="playControl flex_sb" v-if="funcStatus">
        <div class="iconLast" @click="changeModel(31)">
          <img src="../../assets/img/o_last2.png" alt>
        </div>
        <div class="iconPlay1" @click="Play()">
          <img src="../../assets/img/bofang11.png" v-if="play">
          <img src="../../assets/img/o_pause.png" v-else>
        </div>
        <div class="iconNext" @click="changeModel(32)">
          <img src="../../assets/img/o_next2.png" alt>
        </div>
      </div>
      <div class="playControl flex_sb" v-else>
        <div class="iconLast">
          <img src="../../assets/img/o_last2.png" alt>
        </div>
        <div class="iconPlay1">
          <img src="../../assets/img/bofang22.png" v-if="play">
          <img src="../../assets/img/o_pause2.png" v-else>
        </div>
        <div class="iconNext">
          <img src="../../assets/img/o_next2.png" alt>
        </div>
      </div>
      <div class="rangBox flex">
        <div class="rangTitle">音量</div>
        <!-- <x-number :title="title" v-model="loud2" button-style="square" @on-change="change3"></x-number> -->
        <div class="rangButton flex flex_sa" v-if="funcStatus">
          <div @click="changeModel(37)">-</div>
          <div @click="changeModel(36)">+</div>
        </div>
        <div class="rangButton flex flex_sa" v-else>
          <div class="no">-</div>
          <div class="no">+</div>
        </div>
      </div>
    </div>

    <!-- 智能唤醒显示框 -->
    <div class="type4" v-show="type4">
      <div class="clock">
        <img src="../../assets/img/o_clock.png" alt>
      </div>
      <div>唤醒中...</div>
      <div class="button">关闭</div>
    </div>

    <buttoms></buttoms>
    <toast v-model="toast" type="text" :time="800" is-show-mask :text="toastText" position="bottom"></toast>
    <div v-transfer-dom>
      <loading :show="load" text="请稍候..."></loading>
    </div>
  </div>
  <div v-else>
    <div class="mask" v-show="show" @click="close"></div>

    <div class="abnormal">
      <div>
        <img src="../../assets/img/o_abnormal.png" alt>
      </div>
      <div>暂无订单，请先扫一扫</div>
      <router-link :to="{name:'scan'}" class="buttonScan">扫一扫</router-link>
    </div>

    <div v-transfer-dom>
      <alert v-model="alertShow">设备异常，请更换设备使用</alert>
    </div>
  </div>
</template>

<script>
import buttoms from "../buttoms/buttoms.vue";
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";
import {
  XCircle,
  XButton,
  Picker,
  Loading,
  XNumber,
  Alert,
  AlertModule,
  Toast,
  TransferDomDirective as TransferDom
} from "vux";
let loud1 = 0,
  loud2 = 0,
  power = 0;
let typeMsg2 = [],
  typeMsg3 = [];
for (var i = 1; i <= 5; i++) {
  typeMsg2.push({
    name: "动感音乐" + i,
    value: "type" + i
  });
  typeMsg3.push({
    name: "儿童故事" + i,
    value: "type" + i
  });
}

export default {
  name: "controlor",
  directives: {
    TransferDom
  },
  components: {
    XCircle,
    XButton,
    buttoms,
    Picker,
    XNumber,
    Loading,
    Alert,
    AlertModule,
    Toast
  },
  data() {
    return {
      load: false,
      abnormal: false, //异常状态
      toast: false,
      closeIcon: false,
      toastText: "",
      typeMsg2: [
        [
          //动感音乐模式选择
          { name: "冥想", value: 1 },
          { name: "激情", value: 2 },
          { name: "亲子", value: 3 },
          { name: "助眠", value: 4 },
          { name: "动感", value: 5 },
          { name: "按摩", value: 6 }
        ]
      ],
      typeData2: ["1"],
      typeMsg3: [
        [
          //儿童故事模式选择
          { name: "唐诗宋词", value: 7 },
          { name: "绘本故事", value: 8 },
          { name: "国学讲堂", value: 9 },
          { name: "经典寓言", value: 10 },
          { name: "诗歌童谣", value: 11 },
          { name: "科普百科", value: 12 }
        ]
      ],
      typeData3: ["7"],
      roundValue: 0,
      loud1: 0, //音量大小
      power: 0, //力度大小
      loud2: 0, //儿童故事音量大小
      loud1_1: 0, //音量大小
      power_1: 0, //力度大小
      loud2_1: 0, //儿童故事音量大小
      percent: 50, //倒计时剩余百分比
      time: 0, //倒计时
      status: false, //设备开关状态
      play: false, //音乐开关控制
      musicPlay: true, //动感音乐开关控制
      type1Name: "", //情趣震动模式名称
      show: false, //遮罩层控制
      type1: false, //情趣震动选项控制
      type2: false, //体感音乐选项控制
      type3: false, //儿童故事选项控制
      type4: false, //智能唤醒闹钟显示
      alertShow: false, //alert控制器
      GoOn: true, //返回状态
      interval: "",
      btn: [
        {
          status: false,
          name: "情趣震动",
          className: "unclick",
          pickImg: require("../../assets/img/o_p1.png"),
          unImg: require("../../assets/img/o_n1.png")
        },
        {
          status: false,
          name: "体感音乐",
          className: "unclick",
          pickImg: require("../../assets/img/o_p2.png"),
          unImg: require("../../assets/img/o_n2.png")
        },
        {
          status: false,
          name: "儿童故事",
          className: "unclick",
          pickImg: require("../../assets/img/o_p3.png"),
          unImg: require("../../assets/img/o_n3.png")
        },
        {
          status: false,
          name: "智能唤醒",
          className: "unclick",
          pickImg: require("../../assets/img/o_n4.png"),
          unImg: require("../../assets/img/o_n4.png")
        }
      ],
      btn1: [
        { status: true, name: "慢速柔情", className: "click", type: 14 },
        { status: false, name: "中速温情", className: "unclick", type: 15 },
        { status: false, name: "快速高潮", className: "unclick", type: 16 },
        { status: false, name: "停止", className: "unclick", type: 62 }
      ],
      exModel: 14, //激情模式
      exType: 1, //激情模式
      deviceMsg: {}, //设备信息
      musicName: "",
      funcStatus: false // 床垫是否支持更改模式（音量大小等）
    };
  },
  created() {
    const _this = this;
    let now = Date.parse(new Date()) / 1000;
    clearInterval(_this.interval);
    _this.deviceMsg.device_number = _this.$route.query.device_number
      ? _this.$route.query.device_number
      : getUrlParam("deviceNum")
      ? getUrlParam("deviceNum")
      : localStorage.getItem("deviceNum");
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == "undefined" ||
      now - localStorage.getItem("tokenTime") > 84600 * 3
    ) {
      if (getUrlParam("code") == "") {
        location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/controlor.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
      } else {
        Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
          res => {
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
            localStorage.setItem("userid", res.data.data.user_id);
            _this.getControl();
          }
        );
      }
    } else {
      _this.getControl();
    }
  },
  mounted() {
    const _this = this;
    clearInterval(_this.interval);
  },
  methods: {
    getControl() {
      const _this = this;
      Http.post("api/api/Index/api", {
        api_name: "controlIndex",
        token: localStorage.getItem("token")
      }).then(res => {
        if (res.data.code == 1) {
          _this.deviceMsg = res.data.data;
          _this.deviceMsg.use_status != 2 //状态开关
            ? (_this.status = true)
            : (_this.status = false);
          _this.deviceMsg.play == 1 //播放状态开关
            ? (_this.play = false)
            : (_this.play = true);
          if (res.data.data.surplus_time >= 0) {
            _this.time = res.data.data.surplus_time;
          } else {
            _this.time = 0;
          }

          _this.funcStatus = res.data.data.bed_use_func == 0 ? false : true;

          _this.countTime(_this.time); //初始化时间

          if (localStorage.getItem("payStatus")) {
            localStorage.removeItem("payStatus");
            _this.changeModel(62);
          }

          _this.openFunction(1); //冥想音乐开启

          clearInterval(_this.interval);
          if (_this.status) {
            console.log(_this.time);
            //设备开启则倒计时
            _this.interval = setInterval(() => {
              //设置定时器倒计时
              if (_this.time > 0) {
                _this.time--;
                _this.countTime(_this.time);
              }
            }, 1000);
          }
        } else if (res.data.code == 2) {
          //跳转扫一扫
          _this.abnormal = true;
        }
        console.log(JSON.stringify(_this.deviceMsg));
      });
    },

    // 停止/启动动作
    open() {
      const _this = this;
      if (_this.status) {
        //若播放，则停止计时
        console.log(_this.status, 1);
        clearInterval(_this.interval);
      } else {
        //否则开始计时
        console.log(_this.status, 2);
        _this.interval = setInterval(() => {
          //设置定时器倒计时
          if (_this.time > 0) {
            _this.time--;
            _this.countTime(_this.time);
          }
        }, 1000);
      }
      if (_this.funcStatus) {
        _this.changeModel(66);
      }
    },

    // 播放/暂停音乐()
    Play() {
      if (this.funcStatus) {
        this.changeModel(38);
      }
    },
    player() {
      if (this.funcStatus) {
        this.changeModel(38);
      }
    },

    // 体感音乐音量修改
    change1(val) {
      const _this = this;
      if (_this.funcStatus) {
        if (_this.GoOn) {
          console.log(val, _this.loud1_1);
          if (_this.loud1_1 == 0) {
            _this.loud1_1++;
            _this.changeModel(36);
          } else {
            if (val < _this.loud1_1) {
              _this.loud1_1--;
              _this.changeModel(37); //音量减
            } else {
              _this.loud1_1++;
              _this.changeModel(36);
            }
          }
        }
      }
    },
    // 体感音乐力度修改
    change2(val) {
      const _this = this;
      if (_this.funcStatus) {
        if (_this.GoOn) {
          console.log(val, _this.power);
          if (_this.power_1 == 0) {
            _this.power_1++;
            _this.changeModel(36);
          } else {
            if (val < _this.power_1) {
              _this.power_1--;
              _this.changeModel(35); //振动减
            } else {
              _this.power_1++;
              _this.changeModel(34); //振动加
            }
          }
        }
      }
    },

    // 儿童故事音量修改
    change3(val) {
      const _this = this;
      if (_this.funcStatus) {
        if (_this.GoOn) {
          console.log(val, _this.loud2_1);
          if (_this.loud2_1 == 0) {
            _this.loud2_1++;
            _this.changeModel(36);
          } else {
            if (val < _this.loud2_1) {
              _this.loud2_1--;
              _this.changeModel(37); //音量减
            } else {
              _this.loud2_1++;
              _this.changeModel(36);
            }
          }
        }
      }
    },

    // 模式选择时间
    clickBtn(index) {
      const _this = this;

      // _this.btn[index].status = !_this.btn[index].status;

      if (_this.btn[index].className == "click") {
        // _this.btn[index].className = "unclick";
        switch (index) {
          case 0:
            _this.type1 = false;
            _this.closeIcon = false;
            _this.type1Name = "";
            break;
          case 1:
            _this.type2 = false;
            _this.closeIcon = false;
            break;
          case 2:
            _this.type3 = false;
            _this.closeIcon = false;
            break;
        }
      } else {
        // _this.btn[index].className = "click";
        switch (index) {
          case 0:
            _this.type1 = true;
            _this.show = true;
            _this.closeIcon = true;
            _this.type1Name = _this.btn1[index].name;
            break;
          case 1:
            _this.type2 = true;
            _this.show = true;
            _this.closeIcon = true;
            _this.openFunction(1); //默认打开
            break;
          case 2:
            _this.type3 = true;
            _this.show = true;
            _this.closeIcon = true;
            _this.openFunction(7); //默认打开
            break;
        }
      }

      // if (_this.btn[index].status) {
      //   for (let i = 0; i < _this.btn.length; i++) {
      //     _this.btn[i].status = false;
      //     _this.btn[i].className = "unclick";
      //   }
      //   _this.btn[index].status = !_this.btn[index].status;
      //   _this.btn[index].className = "click";
      // }
      //  else {
      //   _this.btn[index].status = !_this.btn[index].status;
      //   _this.btn[index].className = "unclick";
      //   _this.changeModel(0);
      // }
    },

    // 情趣控制按钮事件
    changeEx(index) {
      const _this = this;

      _this.type1Name = _this.btn1[index].name;
      if (!_this.btn1[index].status) {
        for (let i = 0; i < _this.btn1.length; i++) {
          _this.btn1[i].status = false;
          _this.btn1[i].className = "unclick";
        }
        _this.btn1[index].status = !_this.btn1[index].status;
        _this.exModel = _this.btn1[index].type;
        if (index == 3) {
          _this.btn1[index].className = "click1";
          _this.exType = 0;
        } else {
          _this.btn1[index].className = "click";
          _this.exType = 1;
        }
      }
    },
    clickBtn1() {
      const _this = this;
      if (_this.exType == 0) {
        if (_this.funcStatus) {
          _this.changeModel(_this.exModel); //情趣模式停止
          // console.log(_this.exModel)
          // _this.openFunction(1); //冥想音乐开启
        }
      } else {
        _this.openFunction(_this.exModel); //更换情趣模式
      }
      _this.type1 = false;
      _this.show = false;
      _this.closeIcon = false;
    },

    // 关闭
    close() {
      this.show = false;
      this.type1 = false;
      this.type2 = false;
      this.type3 = false;
      this.closeIcon = false;
    },

    // 更换歌曲
    changeSong(value) {
      // console.log(value);
      const _this = this;
      _this.openFunction(value[0], function() {});
    },

    openStatus() {
      const _this = this;

      Http.post("api/api/Index/api", {
        api_name: "getStandardList",
        device_number: _this.deviceNum,
        token: localStorage.getItem("token"),
        code: getUrlParam("code"),
        type: _this.$route.query.type
      }).then(res => {
        for (let i = 0; i < res.data.data.length; i++) {
          _this.packageList.push({
            id: res.data.data[i].hotelt_id,
            status: (i = 0 ? true : false),
            name:
              res.data.data[i].duration / 60 +
              "分钟 " +
              res.data.data[i].money +
              "元"
          });
        }
      });
    },

    // 改变模式
    changeModel(type) {
      console.log(type);
      const _this = this;
      _this.load = true;
      if (_this.GoOn) {
        _this.GoOn = false; //按钮不可触发
        Http.post("api/Mattress/api", {
          api_name: "pattern",
          macno: _this.deviceMsg.device_number,
          token: localStorage.getItem("token"),
          type: type
        }).then(res => {
          _this.load = false;
          _this.GoOn = true; //按钮可触发
          _this.toast = true;
          _this.toastText = res.data.msg;
          if (res.data.code == 1) {
            if (type == 38) {
              //使用状态中方可暂停启动音乐
              _this.play = !_this.play;
            } else if (type == 66) {
              _this.status = !_this.status;
            } else if (type == 62) {
              _this.openFunction(1); //冥想音乐开启
            } else {
              _this.play = false;
            }
          }
        });
      }
    },

    // 开启功能
    openFunction(type) {
      const _this = this;
      // clearInterval(_this.interval);
      console.log(_this.interval);
      _this.musicName = "";
      if (_this.GoOn) {
        _this.load = true;
        _this.GoOn = false; //按钮不可触发
        Http.post("api/Mattress/api", {
          api_name: "start_facility",
          macno: _this.deviceMsg.device_number,
          token: localStorage.getItem("token"),
          time:
            _this.deviceMsg.end_time -
            _this.deviceMsg.start_time -
            parseInt(
              (_this.deviceMsg.end_time - _this.deviceMsg.start_time) /
                (24 * 60 * 60)
            ) *
              24 *
              60 *
              60, //计算剩余时间秒数
          type: type
        }).then(res => {
          _this.load = false;
          _this.GoOn = true; //按钮可触发
          _this.toast = true;
          _this.toastText = res.data.msg;
          if (res.data.code == 1) {
            _this.loud1 = 0;
            _this.loud2 = 0;
            _this.power = 0;
            _this.status = true;
            if (type == 38) {
              //使用状态中方可暂停启动音乐
              _this.play = !_this.play;
            } else if (type == 14 || type == 15 || type == 16) {
              // _this.openFunction(2); //激情音乐开启
            } else {
              _this.play = false;
            }
            //设备开启则倒计时
            console.log("socket");
            _this.socket(
              "connectinfo_hzchuangd_music_" + localStorage.getItem("userid"),
              function(res) {
                let data = JSON.parse(res.data);
                console.log(data);
                _this.musicName = data.music_title;
              }
            );
            if (!_this.interval) {
              _this.interval = setInterval(() => {
                //设置定时器倒计时
                if (_this.time > 0) {
                  _this.time--;
                  _this.countTime(_this.time);
                }
              }, 1000);
            }
          }
        });
      }
    },

    addMoreTime() {
      const _this = this;

      clearInterval(_this.interval);
      _this.$router.push({
        name: "addPackage",
        query: { device_number: _this.deviceMsg.device_number, type: 2 }
      });
    },

    countTime(total) {
      const _this = this;

      let day = parseInt(total / (24 * 60 * 60)); //计算整数天数
      let afterDay = total - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
      let hour = parseInt(afterDay / (60 * 60)); //计算整数小时数

      let afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
      let min = parseInt(afterHour / 60); //计算整数分
      let second = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数

      min = min < 10 ? "0" + min : min;
      second = second < 10 ? "0" + second : second;

      _this.deviceMsg.surplus_time = hour + ":" + min + ":" + second;
      // console.log(hour + ":" + min + ":" + second);
      if (hour <= 0 && min <= 0 && second <= 0) {
        _this.deviceMsg.surplus_time = "00:00:00";
        _this.$router.push("/scan");
      }
    },

    socket(data, cb) {
      if ("WebSocket" in window) {
        // var ws = new WebSocket("ws://120.77.72.190:9999");
        var ws = new WebSocket("ws://120.77.248.106:9999");
        ws.onopen = function() {
          ws.send(data);
        };
        ws.onmessage = function(res) {
          cb({ code: 1, data: res.data });
        };
        ws.onclose = function(close) {
          // alert(JSON.stringify(close));
          console.log(JSON.stringify(close));
          cb({ code: 3, msg: "连接失败", data: close });
        };
        ws.error = function(err) {
          // alert(JSON.stringify(err));
          console.log(JSON.stringify(err));
          cb({ code: 4, msg: "连接失败", data: err });
        };
      } else {
        console.log(JSON.stringify(err));
        cb({ code: 2, msg: "当前浏览器不支持WebSocket!" });
      }
    }
  }
};
</script>

<style scoped>
.controlor {
  text-align: center;
  padding: 10px 0;
  background: #ffffff;
}
.controlor > div {
  margin-left: auto;
  margin-right: auto;
}
.circleDiv {
  width: 170px;
  height: 170px;
  background: #4ad2ff;
  border-radius: 50%;
  margin: auto;
  color: #fff;
  text-align: center;
  flex-wrap: wrap;
}
.circleDiv div {
  width: 100%;
}
.font10 {
  font-size: 0.2rem;
}
.font30 {
  font-weight: bold;
}
.bigImg img {
  width: 22px;
  height: 30px;
}
.player,
.more {
  border-radius: 30px;
  color: #fff;
  padding: 10px;
  width: 85%;
  margin: 20px auto;
  background: #46d1ff;
  box-shadow: 0px 5px 10px #bdefff;
}
.more {
  background: #00f0ff;
  box-shadow: 0px 5px 10px #abfaff;
}
.player img {
  width: 18px;
  height: 21px;
  margin-right: 20px;
}
.functionBtn {
  padding: 15px;
  flex-wrap: wrap;
}
.functionBtn .btn,
.type1 .btn {
  width: 45%;
  height: 70px;
  text-align: center;
  margin: 10px 0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.click {
  background: #46d1ff;
  color: #ffffff;
}
.click1 {
  background: #ff5850;
  color: #ffffff;
}
.unclick {
  background: #ffffff;
  color: #46d1ff;
}
.btnImg img {
  height: 30px;
  margin-right: 10px;
}
.mgb60 {
  margin-bottom: 60px;
  text-align: center;
}
.type1,
.type2,
.type3,
.type4,
.abnormal {
  position: fixed;
  top: 20%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  z-index: 9;
}
.type2,
.type3 {
  top: 15%;
  background: #ffffff;
  width: 70%;
  margin: 0 10%;
  border-radius: 10px;
  padding: 5%;
}
.type1 .btn {
  width: 40%;
}
.type2 .picker2,
.type3 .picker3 {
  width: 100%;
  margin: auto;
  box-shadow: 0px 5px 10px #eeeeee;
}
.abnormal img {
  width: 50%;
}
.type4 img {
  width: 30%;
}
.type4 div,
.abnormal div {
  width: 100%;
  text-align: center;
  font-size: 24px;
  color: #ffffff;
  padding: 10px;
}
.abnormal div {
  color: #aaa;
  font-size: 18px;
}
.type4 .button,
.abnormal .buttonScan {
  width: 90%;
  margin: auto;
  text-align: center;
  font-size: 20px;
  background: #46d1ff;
  border-radius: 30px;
  padding: 10px 0;
  color: #ffffff;
}
.playControl {
  padding: 10%;
  width: 80%;
}
.playControl .iconLast,
.playControl .iconNext {
  width: 15%;
}
.playControl .iconPlay1 {
  width: 55px;
  height: 55px;
  border-radius: 50%;
}
.playControl .iconPlay1 img {
  width: 55px;
  height: 55px;
}
.rangBox {
  width: 100%;
}
.rangTitle {
  width: 20%;
  line-height: 41px;
}
.rangButton {
  width: 80%;
}
.rangButton div {
  width: 30px;
  height: 28px;
  text-align: center;
  line-height: 24px;
  border: 1px solid #e1e1e1;
  margin-top: 5px;
  color: #46d1ff;
  font-size: x-large;
  font-weight: bold;
}
.rangButton div.no {
  color: #e1e1e1;
}
.vux-range-input-box {
  padding: 20px;
  width: 80%;
  margin: 0 10px !important;
}
.range-quantity {
  color: #46d1ff;
}
.weui-cell:before {
  border: none;
}
.weui-cell .vux-number-input {
  display: none !important;
}
.weui-cell .vux-number-selector-sub {
  margin-left: 50px;
}
.confirmBtn {
  background: #46d1ff;
  color: #ffffff;
}
.musicName1,
.musicName2 {
  width: 100%;
  text-align: center;
  padding: 10px 0;
}
.iconClose {
  position: absolute;
  top: 20px;
  right: 50px;
}
</style>

