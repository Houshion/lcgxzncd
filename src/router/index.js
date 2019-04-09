import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Instroduce from '@/components/instroduce/instroduce'
import Person from '@/components/person/person'
import Center from '@/components/center/center'
import Person_data from '@/components/center/person_data/person_data'
import Bean from '@/components/center/my_bean'
import Bed from '@/components/center/use_bed'
import Beddetails from '@/components/center/bedDetails'
import Sleepqua from '@/components/center/person_data/sleepqua'
import Addr from '@/components/center/addr'
import wallet from '@/components/wallet'
import walletDetail from '@/components/walletDetail'
import couponList from '@/components/couponList'
import rechargeDetail from '@/components/recharge_detail'
import recharge from '@/components/recharge'
import changeAddr from '@/components/center/changeAddr'
import nonpayment from '@/components/center/non-payment'
import accPaid from '@/components/center/accPaid'
import recevied from '@/components/center/recevied'
import confirmOrder from '@/components/center/confirmOrder'
import weshop from '@/components/center/weshop'
import shopSearch from '@/components/center/shopSearch'
import customService from '@/components/center/customService'
import shopOrder from '@/components/center/shopOrder'
import car from '@/components/car'
import orderDetail from '@/components/center/orderDetail'
import tabulation from '@/components/center/tabulation'
import partner from '@/components/center/partner'
import qrCode from '@/components/center/qrCode'
import cashier from '@/components/center/cashier'
import one from '@/components/one'
import index from '@/components/index/index'
import pay from '@/components/pay/pay'
import indexDetail from '@/components/index/indexDetail'
import controlor from '@/components/controlor/controlor'
import awaken from '@/components/awaken/awaken'
import addAwaken from '@/components/awaken/addAwaken'
import scan from '@/components/controlor/scan'
import addPackage from '@/components/addPackage/addPackage'
import sleep from '@/components/controlor/sleepQuality'
import agreement from '@/components/agreement'
import share from '@/components/share/share'
import afterScan from '@/components/controlor/afterScan'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/instroduce',
      name: 'instroduce',
      component: Instroduce,
      meta: {
        title: '赖床介绍'
      }
    },
    {
      path: '/person',
      name: 'person',
      component: Person,
      meta: {
        title: '用户指南'
      }
    },
    {
      path: '/center',
      name: 'center',
      component: Center,
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/person_data',
      name: 'person_data',
      component: Person_data,
      meta: {
        title: '个人信息'
      }
    },
    {
      path: '/my_bean',
      name: 'my_bean',
      component: Bean,
      meta: {
        title: '我的赖豆'
      }
    },
    {
      path: '/use_bed',
      name: 'use_bed',
      component: Bed,
      meta: {
        title: '用床记录'
      }
    },
    {
      path: '/bedDetails',
      name: 'bedDetails',
      component: Beddetails,
      meta: {
        title: '用床详情'
      }
    },
    {
      path: '/sleepqua',
      name: 'sleepqua',
      component: Sleepqua,
      meta: {
        title: '睡眠质量'
      }
    },
    {
      path: '/addr',
      name: 'addr',
      component: Addr,
      meta: {
        title: '地址管理'
      }

    },
    {
      path: '/wallet',
      name: 'wallet',
      component: wallet,
      meta: {
        title: '我的钱包'
      }
    },
    {
      path: '/walletDetail',
      name: 'walletDetail',
      component: walletDetail,
      meta: {
        title: '明细'
      }
    },
    {
      path: '/couponList',
      name: 'couponList',
      component: couponList,
      meta: {
        title: '优惠券'
      }
    },
    {
      path: '/recharge_detail',
      name: 'recharge_detail',
      component: rechargeDetail,
      meta: {
        title: '明细详情'
      }
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: recharge,
      meta: {
        title: '充值'
      }
    },
    {
      path: '/changeAddr',
      name: 'changeAddr',
      component: changeAddr,
      meta: {
        title: '编辑收货地址'
      }
    },
    {
      path: '/shopOrder',
      name: 'shopOrder',
      component: shopOrder,
      meta: {
        title: '商场订单'
      }
    },
    {
      path: '/nonpayment',
      name: 'nonpayment',
      component: nonpayment,
      meta: {
        title: '详情'
      }
    },
    {
      path: '/recevied',
      name: 'recevied',
      component: recevied,
      meta: {
        title: '详情'
      }
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      component: confirmOrder,
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/weshop',
      name: 'weshop',
      component: weshop,
      meta: {
        title: '微商城'
      }
    },
    {
      path: '/shopSearch',
      name: 'shopSearch',
      component: shopSearch,
      meta: {
        title: '搜索'
      }
    },
    {
      path: '/customService',
      name: 'customService',
      component: customService,
      meta: {
        title: '联系客服'
      }
    },
    {
      path: '/car',
      name: 'car',
      component: car,
      meta: {
        title: '购物车'
      }
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail,
      meta: {
        title: '分类1'
      }
    },
    {
      path: '/tabulation',
      name: 'tabulation',
      component: tabulation,
      meta: {
        title: '分类1'
      }
    },
    {
      path: '/partner',
      name: 'partner',
      component: partner,
      meta: {
        title: '招募合伙人'
      }
    },
    {
      path: '/qrCode',
      name: 'qrCode',
      component: qrCode,
      meta: {
        title: '推荐分享'
      }
    },
    {
      path: '/cashier',
      name: 'cashier',
      component: cashier,
      meta: {
        title: '收银台'
      }
    },
    {
      path: '/one',
      name: 'one',
      component: one,
      meta: {
        title: '购物车'
      }
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      meta: {
        title: '赖床'
      }
    },
    {
      path: '/indexDetail',
      name: 'indexDetail',
      component: indexDetail,
      meta: {
        title: '酒店详情'
      }
    },
    {
      path: '/controlor',
      name: 'controlor',
      component: controlor,
      meta: {
        title: '遥控'
      }
    },
    {
      path: '/awaken',
      name: 'awaken',
      component: awaken,
      meta: {
        title: '智能唤醒'
      }
    },
    {
      path: '/addAwaken',
      name: 'addAwaken',
      component: addAwaken,
      meta: {
        title: '设置智能唤醒'
      }
    },
    {
      path: '/scan',
      name: 'scan',
      component: scan,
      meta: {
        title: '扫一扫'
      }
    },
    {
      path: '/addPackage',
      name: 'addPackage',
      component: addPackage,
      meta: {
        title: '选择套餐'
      }
    },
    {
      path: '/pay',
      name: 'pay',
      component: pay,
      meta: {
        title: '确认订单'
      }
    },
    {
      path: '/sleep',
      name: 'sleep',
      component: sleep,
      meta: {
        title: '睡眠质量'
      }
    },
    {
      path: '/accPaid',
      name: 'accPaid',
      component: accPaid,
      meta: {
        title: '详情'
      }
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: agreement,
      meta: {
        title: '充值协议'
      }
    },
    {
      path: '/share',
      name: 'share',
      component: share,
      meta: {
        title: '分享'
      }
    },
    {
      path: '/afterScan',
      name: 'afterScan',
      component: afterScan,
      meta: {
        title: '扫码'
      }
    }
  ]
})
