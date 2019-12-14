import axios from 'axios'
import qs from 'qs'
import Vue from "vue";
const vue = new Vue();
import {MessageBox} from "mint-ui";

axios.interceptors.request.use(config => {
    vue.$indicator.open('加载中');
    return config
}, error => {
    return Promise.reject(error)
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.resolve(error.response)
});

function checkStatus(response) {
    vue.$indicator.close();
    if (response.status === 200 || response.status === 304) {
        return response
    }
    return {
        data: {
            code: -404,
            message: response.statusText,
            data: response.statusText,
        }
    }
}

function checkCode(res) {
    //这里应该弹出错误提示
    if (res.status!==200) {
        MessageBox.alert(res.statusText)
    }
    /*if (res.data.code!==200) {
        vue.$toast(res.data.message)
    }*/
    return res;
}

export default {
    post(url, data) {
        return axios({
            method: 'post',
            url,
            data: qs.stringify(data),
            timeout: 30000,
            headers: {
                //'X-Requested-With': 'XMLHttpRequest',
                //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then(checkStatus).then(checkCode)
    },
    get(url, params) {
        return axios({
            method: 'get',
            url,
            params,
            timeout: 30000,
            headers: {
                //'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(checkStatus).then(checkCode)
    }
}
