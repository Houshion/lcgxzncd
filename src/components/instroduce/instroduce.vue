<template>
  <div>
    <p class="plr20 p mt30 lh40" v-html="data">
    </p>
  </div>
</template>

<script>
  import Http from "../../httpClient/httpClient";
    export default {
        name: "instroduce",
      data(){
        return{
          data:""
        }
      },
      beforeMount(){
        Http.post('api/public/_abstract',{}).then((res)=>{
          console.log(res);
          this.data = res.data.data
        })
      }
    }
</script>

<style scoped>
  .p{
    text-align: justify;
  }
</style>
