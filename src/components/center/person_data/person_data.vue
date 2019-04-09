<template>
    <div class="z_all">
        <label class="z_bjtx ptb30 flex_sb mb20">
          <span class="pl30 font16 col6">编辑头像</span>
          <img :src="avatar" class="z_tx">
          <!--<input type="file"  id="photo" name="photo" value="" hidden="" @change='onUpload'/>-->
          <input  name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="update" hidden/>
        </label>
        <label class="bw ptb20 pl30 db" style="width: calc(100% - 0.3rem)">昵称<input type="text" placeholder="请输入用户名" class="pl20" v-model="input1" ></label>
      <button class="bgc1 db colw font16 m_atuo mt80 w90 border-r6 ptb20" @click="confirm">保存</button>
      <toast v-model="show8" type="text" :text="toasttext"></toast>


    </div>
</template>

<script>
  import axios from 'axios'
  import Http from '../../../httpClient/httpClient';
  import { Toast} from 'vux'
    export default {
      name: "person_data",
      components: {Toast},
      data() {
        return {
          input1: '',
          photo: null,
          avatar: null,
          toasttext: "",
          show8: false
        }
      },
      beforeMount() {
        Http.post('api/User/api', {api_name: 'userInfo', token: localStorage.getItem('token')}).then((res) => {
          console.log(res);
          this.avatar = res.data.data.head_img;
          this.input1 = res.data.data.nickname;
        })
      },
      methods: {
       /* onUpload(e) {
          var _this = this;
          var formData = new FormData();
          console.log(e.target.files[0].name)
          formData.append('file', e.target.files[0],e.target.files[0].name);
          this.photo = e.target.files[0];
          console.log(this.photo)
          var reader = new FileReader();
          reader.readAsDataURL(this.photo);
          reader.onloadend = function (evt) {
            //console.log(evt.target)
            _this.avatar = evt.target.result;

          };*/

        update (e) {   // 上传照片
          var self = this
          let file = e.target.files[0]
          /* eslint-disable no-undef */
          let param = new FormData()  // 创建form对象
          param.append('image', file, file.name)  // 通过append向form对象添加数据
          param.append('api_name', 'wx_saveUser')
          param.append('token', localStorage.getItem("token"))
          console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = function(evt) {
            //console.log(evt.target)
            self.avatar = evt.target.result;

          };
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          };

          // 添加请求头
          axios.post('http://www.zjgxkl.com/api/User/api', param, config)
            .then(response => {
              console.log(response.data)
            })
        },


//			 var files = e.target.files ||     e.dataTransfer.files;
//	   if (!files.length)return;
//	   this.photo = files[0];
//	   console.log(this.photo)
//         },
        confirm() {
          Http.post('api/User/api',{api_name:'wx_saveUser',token:localStorage.getItem('token'),nickname:this.input1}).then((res)=>{
            console.log(res);
            this.show8 = true;
            this.toasttext = res.data.msg;

          })
        }
      }
    }

</script>

<style scoped>
  .z_all{
    height:100%;
  }
  .z_bjtx{
    background:url("../../../assets/img/z_arror.png")no-repeat 97% center #fff;
    background-size:0.15rem 0.18rem;
  }
.z_tx{
  width:0.7rem;
  height:0.7rem;
  margin-right:0.5rem;
}
.z_all label {
     width: auto;
     margin-bottom: 10px;
     height: auto;
}
  .z_all label span {
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
