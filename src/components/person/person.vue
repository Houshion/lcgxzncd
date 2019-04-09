<template>
  <p class="plr20 ps mt30 lh40" v-html="data">
  </p>
</template>

<script>
  import Http from "../../httpClient/httpClient";
    export default {
        name: "person",
      data(){
          return{
            data:""
          }
      },
      beforeMount(){
        Http.post('api/public/user_explain',{}).then((res)=>{
          console.log(res);
          this.data = res.data.data
        })
      }
    }
</script>

<style scoped>
  .ps{
    text-align: justify;
  }

</style>
