import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";
Vue.use(store);
import "./assets/css/all.css"; //全局css
require('./assets/js/jquery-1.11.0'); //全局引入jquery

import axios from "axios";
import Mint from 'mint-ui'; //mint ui 组件
import 'mint-ui/lib/style.css'; // mint ui css
Vue.use(Mint);

//vue-awesome-swiper插件的引入----------start 因为mintui swiper滑动插件 需要默认写高度 影响图片等比例缩放计算
require('swiper/dist/css/swiper.css');
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)
//vue-awesome-swiper插件的引入------------end

Vue.prototype.$http=axios; //因为不是插件 这样写让后面使用
Vue.prototype.baseUrl="http://127.0.0.1:3301";

//处理全局过滤器
import * as custom from './filter';
//获取对象的所有属性
Object.keys(custom).forEach(key => {
    //console.log(key) //过滤器函数名字
    //console.log(custom[key])
    //Vue.filter(key, custom[key])
});
for(var x in custom){
    Vue.filter(x,custom[x])
}

//全局指令
import * as direct from './directive';
Object.keys(direct).forEach(key => {
    //console.log(key)
    //console.log(direct[key])
    Vue.directive(key,direct[key])
});

//公共方法
import * as utils from "./utils";
Vue.use(utils);

//单一事件
Vue.prototype.busEvent=new Vue();

//Aai
import Api from "./api";
Vue.prototype.api=Api;

axios.interceptors.request.use(function(config) {
    console.log('请求拦截');
    if (localStorage.getItem("user")) {
        config.headers['token'] = JSON.parse(localStorage.getItem("user")).token;
    }
    return config
}, function(error) {
    console.log('请求错误拦截');
    return error
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(res => {
    console.log('响应拦截');
    if(res.status==200){
        // 响应成功
        console.log(res);
        if(res.data.code==400){
            //router.push('/login')
            console.log('登录失效')
        }
    }else{

    }
    return res;
}, (error) => {
    console.log('响应错误拦截');
    return error;
});


var token=null;
if(window.localStorage.getItem("userInfoObj")){
    token=JSON.parse(window.localStorage.getItem("userInfoObj")).token
}
Vue.prototype.token=token;

var glob=new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});
Vue.prototype.glob=glob;
