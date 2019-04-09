<template>
    <div class="addrall">
      <div class="flex1" style="overflow-y: scroll;">
        <div class="bw ptb20 plr30 bdb mb20" v-for="(item,i) in arry">
          <div class="bdb pb20">
            <p class="mb10">收货人：{{item.contacts}}  {{item.mobile}}</p>
            <p class="moren">{{item.ress}} </p>
          </div>
          <div class="flex_sb pt30 ">
            <label class="flex">
              <input type="radio" hidden   name="change" :value="item.id" v-model="checked" @change="addmo"/>
              <i class="mr20 z_i"></i>
              <span class="moren">默认地址</span>
            </label>
            <p class="flex">
              <span class="flex mr20" @click="write(2,item.id)"><img src="../../assets/img/z_write.png" class="z_write mr20"><em class="moren">编辑</em></span>
              <span class="flex"><img src="../../assets/img/z_rab.png" class="z_rab mr20"><em class="moren" :data-num="item.id" :data-id="i" @click="dEl($event)">删除</em></span>
            </p>
          </div>
        </div>
      </div>
      <button class="z_add colw font19" @click="add">添加地址</button>

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

      <div v-transfer-dom>
        <loading :show="show2" text="加载中"></loading>
      </div>

      <toast v-model="show8" type="text" :text="toasttext" width="20em"></toast>
    </div>
</template>

<script>
  import { Confirm ,TransferDomDirective as TransferDom,Loading,Toast} from 'vux'
  import Http from'../../httpClient/httpClient'
    export default {
        name: "addr",
      directives: {
        TransferDom
      },
      components: {
        Confirm,
        Loading,
        Toast
      },
      data(){
          return {
            checked:"",
            show:false,
            arry:[],
            show2: false,
            show8: false
          }
      },
      methods:{
        //  删除地址
        dEl(e){
          let _this = this;
          this.$vux.confirm.show({
            title: '是否删除地址？',
            confirmText:'删除',
            // 组件除show外的属性
            onCancel () {
              console.log(this) // 非当前 vm
              console.log(_this) // 当前 vm
            },
            onConfirm (del) {
              console.log(e)
              Http.post('api/Address/api',{api_name:'delAddress',token:localStorage.getItem('token'),id:e.target.dataset.num}).then((res)=>{
                console.log(res);
                Http.post('api/Address/api',{api_name:'addressList',token:localStorage.getItem('token')}).then((res)=>{
                  console.log(res);
                  _this.show2 = false;
                  _this.arry = res.data.data;
                })
              })
            }
          })
        },
        //编辑地址
        write(num,idx){
          this.$router.push({name:'changeAddr',query:{id:num,idx:idx}})
        },
        //添加地址
        add(){
          this.$router.push({name:'changeAddr'})
        },
        //设置默认地址
        addmo(){
          var that = this;
          Http.post('api/Address/api',{api_name:'isDefault',token:localStorage.getItem('token'),id:this.checked}).then((res)=>{
            console.log(res);
            that.show8 = true;
            that.toasttext = res.data.msg;
            setTimeout(function(){
              that.$router.go(-1);
            },1500)
          });
        }
      },
      beforeMount(){
        this.show2 = true;
        var self = this;
        Http.post('api/Address/api',{api_name:'addressList',token:localStorage.getItem('token')}).then((res)=>{
          console.log(res);
          self.show2 = false;
          self.arry = res.data.data;
          for(var i=0;i<self.arry.length;i++){
            if(self.arry[i].is_status==1){
              self.checked = self.arry[i].id;
            }
          }

        })
      }
    }
</script>

<style scoped>
  .addrall{
    display: flex;
    flex-flow: column;
    height:100%;
  }
  .moren{
    font-size:0.24rem;
    color:#d0d0d0;
  }
  .z_i{
    background:url("../../assets/img/z_circle0.png")no-repeat left center;
    background-size:0.36rem 0.36rem;
    width:0.36rem;
    height:0.36rem;
    padding-right:0.3rem;
  }

  .addrall label {
    width: auto;
    margin-bottom: 0px;
    height: auto;
  }
  .addrall  label span {
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
  .addrall  input[type=radio]:checked+.z_i{
    background:url("../../assets/img/z_circle.png")no-repeat left center;
    background-size:0.36rem 0.36rem;
    width:0.36rem;
    height:0.36rem;
    padding-right:0.3rem;
  }
  .z_write{
    width:0.32rem;
    height:0.32rem;
  }
  .z_rab{
    width:0.32rem;
    height:0.32rem;
  }

  .z_add{
    height:1rem;
    width:100%;
    background:url("../../assets/img/z_add.png") no-repeat 35% center #00c0ff;
    background-size: 0.32rem 0.32rem;
  }

</style>
