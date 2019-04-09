
<template>
    <div>
      <div class="bw">
        <textarea v-model="value" placeholder="请留下您的意见和建议吧..." rows="8" cols="30" class="pl20 pt20"></textarea>

      </div>
<div class="vue-uploader">
        <div class="file-list">
            <section v-for="(file, index) of files" class="file-item draggable-item">
                <img :src="file.src" alt="" ondragstart="return false;">
              <!--  <p class="file-name">{{file.name}}</p>-->
                <span class="file-remove" @click="remove(index)">+</span>
            </section>
            <section v-if="status == 'ready'" class="file-item">
                <div @click="add" class="add">
                    <span>+</span>
                </div>
            </section>
        </div>

        <section v-if="files.length != 0" class="upload-func">
            <div class="progress-bar">
                <section v-if="uploading" :width="(percent * 100) + '%'">{{(percent * 100) + '%'}}</section>
            </div>
            <div class="operation-box">
                <button v-if="status == 'ready'" >上传</button>
                <button v-if="status == 'finished'" @click="finished">完成</button>
            </div>
        </section>
        <input type="file" accept="image/*" @change="fileChanged($event)" ref="file" multiple="multiple">
    </div>
    <button class="bgc1 db colw font16 m_atuo mt80 w90 border-r6 ptb20" @click="submit">提交</button>

      <toast v-model="show8" type="text" :text="toasttext"></toast>
      <div v-transfer-dom>
        <loading :show="show2" text="加载中"></loading>
      </div>
    </div>
</template>

<script>
import Http from "../../httpClient/httpClient";
import getUrlParam from "../dlc/getUrl.js";
import axios from "axios";
import { Toast, Loading, TransferDomDirective as TransferDom } from "vux";
import { setTimeout } from 'timers';
export default {
  name: "custom-service",
  directives: {
    TransferDom
  },
  components: { Toast, Loading },
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      status: "ready",
      files: [],
      point: {},
      uploading: false,
      percent: 0,
      images: [],
      show8: false,
      show2: false
    };
  },
  created() {
    const _this = this;
    let now = Date.parse(new Date()) / 1000;
    if (
      !localStorage.getItem("token") ||
      localStorage.getItem("token") == "undefined" ||
      now - localStorage.getItem("tokenTime") > 84600 * 3
    ) {
      if (getUrlParam("code") == "") {
        location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx744d7da2444764d5&redirect_uri=http://www.zjgxkl.com/h5/dist/customService.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
      } else {
        this.show2 = true;
        Http.get("api/public/wx_oauth", { code: getUrlParam("code") }).then(
          res => {
            console.log(res);
            this.show2 = false;
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("tokenTime", Date.parse(new Date()) / 1000);
          }
        );
      }
    }
  },
  methods: {
    add() {
      this.$refs.file.click();
    },
    submit() {
      var that = this;
    //   if (that.files.length === 0) {
    //     console.warn("no file!");
    //     return;
    //   }
      const formData = new FormData();
      that.files.forEach(item => {
        formData.append("image[]", item.file);
      });
      console.log(that.images)
      that.show2 = true;
      Http.post("api/user1/index/Notescontact", {
        imgs: (that.images.length > 0) ? that.images.join(",") : that.images,
        content: that.value,
        token: localStorage.getItem("token")
      }).then(res => {
        that.show2 = false;
        console.log(res);
        that.show8 = true;
        that.toasttext = res.data.msg;
        // setTimeout(() => {
        //     WeixinJSBridge.call('closeWindow');
        // }, 2000);
      });
    },
    finished() {
      this.files = [];
      this.status = "ready";
    },
    remove(index) {
      this.files.splice(index, 1);
    },
    fileChanged(e) {
      const list = this.$refs.file.files;

      for (let i = 0; i < list.length; i++) {
        if (!this.isContain(list[i])) {
          const item = {
            name: list[i].name,
            size: list[i].size,
            file: list[i]
          };
          this.html5Reader(list[i], item);
          this.files.push(item);
        }
      }
      this.$refs.file.value = "";

      if (this.files.length === 0) {
        console.warn("no file!");
        return;
      }
      const formData1 = new FormData();
      this.files.forEach(item => {
        formData1.append("image[]", item.file);
      });
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      axios
        .post(
          "http://www.zjgxkl.com/api/public/upload_img",
          formData1,
          config
        )
        .then(response => {
          console.log(response.data);
          this.images.push(response.data.data.url);
          console.log(this.images);
        });
    },
    // 将图片文件转成BASE64格式
    html5Reader(file, item) {
      const reader = new FileReader();
      reader.onload = e => {
        this.$set(item, "src", e.target.result);
      };
      reader.readAsDataURL(file);
    },
    isContain(file) {
      return this.files.find(
        item => item.name === file.name && item.size === file.size
      );
    },
    uploadProgress(evt) {
      const component = this;
      if (evt.lengthComputable) {
        const percentComplete = Math.round(evt.loaded * 100 / evt.total);
        component.percent = percentComplete / 100;
      } else {
        console.warn("upload progress unable to compute");
      }
    }
  }
};
</script>

<style scoped>
.addimg {
  width: 1.38rem;
  height: 1.38rem;
}
.vue-uploader {
  background: #fff;
}
.vue-uploader .file-list {
  padding: 10px 0px;
}
.vue-uploader .file-list:after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
  line-height: 0;
  height: 0;
  font-size: 0;
}
.vue-uploader .file-list .file-item {
  float: left;
  position: relative;
  width: 100px;
  text-align: center;
}
.vue-uploader .file-list .file-item img {
  width: 80px;
  height: 80px;
  border: 1px solid #ececec;
}
.vue-uploader .file-list .file-item .file-remove {
  position: absolute;
  right: 12px;
  display: none;
  top: 4px;
  width: 14px;
  height: 14px;
  color: white;
  cursor: pointer;
  line-height: 12px;
  border-radius: 100%;
  transform: rotate(45deg);
  background: rgba(0, 0, 0, 0.5);
}
.vue-uploader .file-list .file-item:hover .file-remove {
  display: inline;
}
.vue-uploader .file-list .file-item .file-name {
  margin: 0;
  height: 40px;
  word-break: break-all;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.vue-uploader .add {
  width: 80px;
  height: 80px;
  margin-left: 10px;
  float: left;
  text-align: center;
  line-height: 80px;
  border: 1px dashed #ececec;
  font-size: 30px;
  cursor: pointer;
}
.vue-uploader .upload-func {
  display: flex;
  padding: 10px;
  margin: 0px;
  background: #f8f8f8;
  border-top: 1px solid #ececec;
  display: none;
}
.vue-uploader .upload-func .progress-bar {
  flex-grow: 1;
}
.vue-uploader .upload-func .progress-bar section {
  margin-top: 5px;
  background: #00b4aa;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  transition: all 0.5s ease;
}
.vue-uploader .upload-func .operation-box {
  flex-grow: 0;
  padding-left: 10px;
}
.vue-uploader .upload-func .operation-box button {
  padding: 4px 12px;
  color: #fff;
  background: #007acc;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}
.vue-uploader > input[type="file"] {
  display: none;
}
</style>
