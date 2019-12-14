import Vue from 'vue'
import Router from 'vue-router'

import Index from "../pages/Index.vue";
import My from "../pages/my.vue";

import myZhichu from "../pages/myZhichu.vue";
import myJifen from "../pages/myJifen.vue";
import myYouHuiQuan from "../pages/myYouHuiQuan.vue";
import myFapiao from "../pages/myFapiao.vue";
import myApplyFapiao from "../pages/myApplyFapiao.vue";
import myShouceng from "../pages/myShouceng.vue";
import myYijian from "../pages/myYijian.vue";
import myAbout from "../pages/myAbout.vue";

import Cart from "../pages/cart.vue";
import Order from "../pages/Order.vue";
import orderDetail from "../pages/orderDetail.vue";
import orderApplyReGoods from "../pages/orderApplyReGoods.vue";
import orderReGoodsDetail from "../pages/orderReGoodsDetail.vue";

import orderEnter from "../pages/orderEnter.vue";

import homeTimeOver from "../pages/homeTimeOver.vue";
import homePre from "../pages/homePre.vue";
import homeDiscount from "../pages/homeDiscount.vue";
import allGoods from "../pages/allGoods.vue";
import goodsDetail from "../pages/goodsDetail.vue";
import homeSearch from "../pages/homeSearch.vue";
import login from "../pages/login.vue";
import regist from "../pages/regist.vue";
import resetPass from "../pages/resetPass.vue";

Vue.use(Router)

const router = new Router({
    mode: 'history',//神奇的作用 可以把url中文字符自动编译 如果是hash模式 就显示乱码
    routes: [
        {
            path: '/',
            name: '主页',
            component: Index
        },
        {
            path: '/cart',
            name: '购物车',
            component: Cart
        },
        {
            path: '/order',
            name: '订单',
            component: Order,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/orderDetail',
            name: '订单详情',
            component: orderDetail,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/orderApplyReGoods',
            name: '订单申请退货',
            component: orderApplyReGoods,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/orderReGoodsDetail',
            name: '退货详情',
            component: orderReGoodsDetail,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },


        {
            path: '/orderEnter',
            name: '订单确认',
            component: orderEnter,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/my',
            name: '我的',
            component: My
        },

        {
            path: '/myZhichu',
            name: '我的支出',
            component: myZhichu,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/myJifen',
            name: '我的积分',
            component: myJifen,
            beforeEnter: (to, from, next) => {
                //不要把token存到vue全局下面 实时更新没法实现
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/myYouHuiQuan',
            name: '我的优惠券',
            component: myYouHuiQuan,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/myFapiao',
            name: '我的发票',
            component: myFapiao,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/myApplyFapiao',
            name: '申请发票',
            component: myApplyFapiao,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/myShouceng',
            name: '我的收藏',
            component: myShouceng,
            beforeEnter: (to, from, next) => {
                if(window.localStorage.getItem('userInfoObj')){
                    next()
                }else{
                    next('/login')
                }
            }
        },

        {
            path: '/myYijian',
            name: '我的意见',
            component: myYijian
        },

        {
            path: '/myAbout',
            name: '关于我们',
            component: myAbout
        },

        {
            path: '/homeTimeOver',
            name: '限时秒杀',
            component: homeTimeOver
        },
        {
            path: '/homePre',
            name: '限量特惠',
            component: homePre
        },
        {
            path: '/homeDiscount',
            name: "超低折扣",
            component: homeDiscount
        },

        {
            path: '/allGoods',
            name: "所有商品列表",
            component: allGoods
        },

        {
            path: '/homeSearch',//query传参数不需要我们在路由配置里面指定query配置
            name: "商品搜索",
            component: homeSearch
        },

        {
            path: '/goodsDetail/:rels_id/',
            name: "商品详情",
            component: goodsDetail
        },

        {
            path: '/login',
            name: "登录",
            component:login
        },

        {
            path: '/regist',
            name: "注册",
            component:regist
        },

        {
            path: '/resetPass',
            name: "重置密码",
            component:resetPass
        },

        {
            path: '*',
            redirect: '/'
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
    }
});

/*router.beforeEach((to, from, next) => {
    to.matched.some(record=>{
        if(record.path.indexOf('my')>0 && record.path!=="/my"){
            if(window.localStorage.getItem('userInfoObj')==""){
                next({
                    path:'/login'
                })
            }else{
                next()
            }
        }else{
            next()
        }
    })
});*/

export default router;
