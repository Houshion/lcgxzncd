<template>
    <div class="bw plr30" style="height:100%;">
      <div style="overflow: hidden;" class="pt30">
        <p class="z_sousuokuang ptb30"><input type="text" placeholder="搜索商品" class="z_inputs" @keyup="onkeyup($event)" value="1" v-model="empty"></p>
        <p class="col9 pt30" v-show="his">历史搜索</p>
      <div v-show="hide">
        <p class="font16 z_history ptb30" v-for="i in arr" @click="gd(i.title)" :key="i">{{i.title}}</p>
      </div>

        <div v-show="show">
          <p class="flex_a ptb30 z_history"  v-for="item in items" @click="greet(item.id,item.name)" :key="item">
            <img v-bind:src="item.img" class="z_chanpintitle">
            <span class="flex flex_column pl30">
                <em class="font16 mb20">{{item.name}}</em>
                <em class="font18 mt10" style="color:#ff5850;">¥{{item.price}}</em>
            </span>
          </p>
        </div>
        <p v-show="no" style="text-align: center;padding-top:0.2rem;">暂无结果</p>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import Http from'../../httpClient/httpClient'
    export default {
        name: "shop-search",
      methods:{
          onkeyup:function(e){
            var that = this;
            console.log(this.empty)
            if(e.keyCode=="13" && this.empty!=""){
                this.hide=false;
                this.his = false;
              Http.post('api/Home/home/api',{api_name:'searchList',token:localStorage.getItem('token'),title:this.empty}).then((res)=>{
                console.log(res);
                that.items = res.data.data;
                if(res.data.code==1){
                  that.show=true;
                  if(that.items.length==0){
                    that.no = true;
                    that.show = false;
                  }
                }
              })
            }
          },
        greet:function(id,ti){
          this.$router.push({name:'orderDetail',query:{id:id,ti:ti}})

        },
        gd(titles){
            this.empty = titles;
        }
      },
      data(){
          return{
            hide:true,
            his:true,
            show:false,
            empty:"",
            items:[],
            arr:[],
            no:false,
          }
      },
      beforeMount(){
        Http.post('api/Home/home/api',{api_name:'searchRecord',token:localStorage.getItem('token')}).then((res)=>{
          console.log(res);
          this.arr = res.data.data
        })
      },
    }
</script>

<style scoped>
.z_sousuokuang{
    background: url("../../assets/img/z_sousuokuang.png") no-repeat 5% center #eeeeee;
    background-size:0.28rem 0.28rem;
    border-radius: 0.1rem;
}
  .z_inputs{
     padding-left:0.8rem;
    width:96%;
  }
  .z_history{
    border-bottom:1px solid #eee;
  }
  .z_chanpintitle{
      width:1.64rem;
    height:1.64rem;
  }
</style>
