<template>
<div style="padding: 15px" v-html="agreement">
    
</div>
</template>

<script>
import Http from "../httpClient/httpClient";
export default {
  name: "agreement",
  data() {
    return {
      agreement: ""
    };
  },
  methods: {
    
  },
  beforeMount() {
    var that = this;
    Http.post("api/public/chongzhi_protocol", {}).then(res => {
      console.log(res);
      that.agreement = res.data.data;
    });
  }
};
</script>

<style>

</style>
