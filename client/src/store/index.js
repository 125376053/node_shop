import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

var state = {
    hideTop:true,
    hideFooter:true,
    userInfor:null
};

const mutations = {
    changeHideTop(state) { //处理状态(数据)变化
        state.hideTop=false;
    },
    changeHideTop2(state) { //处理状态(数据)变化
        state.hideTop=true;
    },
    changeFooter:(state)=>{
        console.log(state)
        state.hideFooter=false;
        //console.log(state.hideFooter)
    },
    changeFooter2:(state)=>{
        state.hideFooter=true;
    },
    userInfoObj:(state,data)=>{
        state.userInfor=data;
        //console.log(state.userInfor)
    }
};

const actions = {
    changeHideTop:({commit}) => {
        commit('changeHideTop')
    },
    changeHideTop2:({commit}) => {
        commit('changeHideTop2')
    },
    changeFooter:({commit})=>{
        commit('changeFooter')
    },
    changeFooter2:({commit})=>{
        commit('changeFooter2')
    },
    userInfoObj:({commit},content)=>{
        window.localStorage.setItem("userInfoObj",JSON.stringify(content))
        commit("userInfoObj",content)
    }
};

const getters = {
    hideTop(state) {
        return state.hideTop;
    },
    hideFooter(state) {
        return state.hideFooter;
    },
    userInfor(state){
        return state.userInfor
    }
};


//需要导出Store对象
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
});
