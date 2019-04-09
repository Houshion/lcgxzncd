<template>
  <div>
    <div class="flex">
        <div class="jce left">
            <div>睡眠时长</div>
            <div>
                {{time}}
            </div>
            <div>{{time_len}}</div>
        </div>
        <div class="jce right">
            <div>睡眠质量</div>
            <div style="font-weight:bold;font-size:24px;">{{quality}}</div>
        </div>
    </div>
    <div class="sleepAdvice">
        <div style="padding:10px 0">睡眠质量建议</div>
        <div style="text-indent:2em">{{advice}}</div>
    </div>
  </div>
</template>

<script>
import { Picker } from "vux";

export default {
  name: "sleep",
  components: {
    Picker
  },
  methods: {
    change(value) {
      console.log("new Value", value);
    }
  },
  data() {
    return {
      time: 7,
      time_len: "12:00-19:35",
      quality: "一般",
      advice: "asldionblakjdfkljbal;ksjdbvlkajblkjbsdlkjbaflksjbdlkvjbalskdbjf"
    };
  },
  created: function() {
    const _this = this;

    Http.post("api/User/api", {
      api_name: "sleepInfo",
      id: _this.$route.query.idx,
      token: localStorage.getItem("token")
    }).then(res => {
      _this.time = res.data.data.time;
      _this.time_len = res.data.data.time_len;
      _this.quality = res.data.data.sleep;
      _this.advise = res.data.data.advise;
    });
  }
};
</script>
<style scoped>
.jce {
  justify-content: space-around;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-items: center;
  width: 50%;
  height: 150px;
}
.jce.left {
  background: #00c0ff;
}
.jce.right {
  background: #5ddce1;
}
.jce div {
  width: 100%;
  color: #ffffff;
}
.jce div span {
  font-size: 18px;
}
.sleepAdvice {
  overflow-wrap: break-word;
  padding: 20px;
}
</style>