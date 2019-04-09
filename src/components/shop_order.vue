<template>
<div>
	<p>fdsafsa</p>

	 <group title="chained columns">
       <popup-picker :title="title" :data="list" :columns="3" v-model="value" show-name></popup-picker>
    </group>
</div>
</template> 
<script>

import {  PopupPicker, Group } from 'vux'


 
export default {
  components: {
    PopupPicker,
    Group
  },
  data () {
    return {
      title: '省市区',
	  list: citySelect,
      value: [],

    }
  },

}
</script>

<style>
</style>