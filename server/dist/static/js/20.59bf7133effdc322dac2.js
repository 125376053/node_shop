webpackJsonp([20],{"9zog":function(t,s,e){"use strict";var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"loginBg"},[e("div",{staticClass:"loginWrap"},[e("h1",{staticClass:"login_title"},[t._v("用户登录")]),t._v(" "),e("div",{staticClass:"login_input"},[e("p",{staticClass:"username"},[e("img",{attrs:{src:"static/images/user_icon.png",alt:""}}),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],attrs:{type:"text",placeholder:"用户名"},domProps:{value:t.username},on:{input:function(s){s.target.composing||(t.username=s.target.value)}}})]),t._v(" "),e("p",{staticClass:"password"},[e("img",{attrs:{src:"static/images/pass_icon.png",alt:""}}),t._v(" "),"checkbox"===t.type?e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{placeholder:"密码",type:"checkbox"},domProps:{checked:Array.isArray(t.password)?t._i(t.password,null)>-1:t.password},on:{change:function(s){var e=t.password,a=s.target,o=!!a.checked;if(Array.isArray(e)){var n=t._i(e,null);a.checked?n<0&&(t.password=e.concat([null])):n>-1&&(t.password=e.slice(0,n).concat(e.slice(n+1)))}else t.password=o}}}):"radio"===t.type?e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{placeholder:"密码",type:"radio"},domProps:{checked:t._q(t.password,null)},on:{change:function(s){t.password=null}}}):e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{placeholder:"密码",type:t.type},domProps:{value:t.password},on:{input:function(s){s.target.composing||(t.password=s.target.value)}}}),t._v(" "),e("i",{staticClass:"biyan",class:{zhengyan:t.yFlag},on:{click:t.yanJing}})]),t._v(" "),e("router-link",{staticClass:"resetPass",attrs:{to:{path:"/resetPass"}}},[t._v("\n                忘记密码?\n            ")])],1),t._v(" "),e("a",{staticClass:"loginBtn",on:{click:t.check}},[t._v("登录")])])])},o=[],n={render:a,staticRenderFns:o};s.a=n},HQZh:function(t,s,e){s=t.exports=e("lcwS")(!1),s.push([t.i,"",""])},HxWs:function(t,s,e){t.exports={default:e("Q17y"),__esModule:!0}},Luci:function(t,s,e){"use strict";function a(t){e("hzFH")}Object.defineProperty(s,"__esModule",{value:!0});var o=e("pytf"),n=e("9zog"),r=e("/4AN"),i=a,c=r(o.a,n.a,!1,i,null,null);s.default=c.exports},Ocr3:function(t,s){s.f=Object.getOwnPropertySymbols},Q17y:function(t,s,e){var a=e("zKeE"),o=a.JSON||(a.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},T4f3:function(t,s,e){"use strict";s.__esModule=!0;var a=e("gc0D"),o=function(t){return t&&t.__esModule?t:{default:t}}(a);s.default=o.default||function(t){for(var s=1;s<arguments.length;s++){var e=arguments[s];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t}},YD0x:function(t,s,e){var a=e("vSO4");a(a.S+a.F,"Object",{assign:e("uj5A")})},gc0D:function(t,s,e){t.exports={default:e("vcHl"),__esModule:!0}},hzFH:function(t,s,e){var a=e("HQZh");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);e("X/Wc")("2c7d9b2e",a,!0,{})},pytf:function(t,s,e){"use strict";var a=e("HxWs"),o=e.n(a),n=e("T4f3"),r=e.n(n),i=e("aKwh");s.a={mounted:function(){""!==this.getCookie("shoujihao1")&&(this.username=this.getCookie("shoujihao1")),this.$http.get("/api/a").then(function(t){console.log(t)})},data:function(){return{yFlag:!1,type:"password",username:"",password:""}},computed:r()({},Object(i.c)(["user"])),methods:{yanJing:function(){this.yFlag=!this.yFlag,this.type=this.yFlag?"text":"password"},check:function(){this.setCookie("shoujihao1",this.username||"",7);var t=/^1[34578]\d{9}$/,s=/^[0-9a-zA-Z]{6,20}$/g;return""==this.username?(this.$toast("用户名不能为空"),!1):""!=this.username||t.test(this.username)?""==this.password?(this.$toast("密码不能为空"),!1):s.test(this.password)?void this.checkUser():(this.$toast("密码由6-12位数字，大小写字母组成"),!1):(this.$toast("请输入正确的手机号码"),!1)},checkUser:function(){var t=this;this.$indicator.open("加载中..."),this.$http.post("/api/users/login",{username:this.username,password:this.password}).then(function(s){if(t.$indicator.close(),s.data.code){var e={userInfo:s.data.user.userInfo,token:s.data.user.token};window.localStorage.setItem("user",o()(e)),t.$store.dispatch("user",e),t.$toast(s.data.msg),setTimeout(function(){t.$router.push({path:"/"})},2e3)}else t.$toast(s.data.msg)}).catch(function(s){console.log(s),t.$toast("登录失败"),t.$indicator.close()})}}}},uj5A:function(t,s,e){"use strict";var a=e("knrM"),o=e("Ocr3"),n=e("z7R8"),r=e("mbLO"),i=e("E5Ce"),c=Object.assign;t.exports=!c||e("wLcK")(function(){var t={},s={},e=Symbol(),a="abcdefghijklmnopqrst";return t[e]=7,a.split("").forEach(function(t){s[t]=t}),7!=c({},t)[e]||Object.keys(c({},s)).join("")!=a})?function(t,s){for(var e=r(t),c=arguments.length,u=1,l=o.f,p=n.f;c>u;)for(var d,h=i(arguments[u++]),f=l?a(h).concat(l(h)):a(h),g=f.length,v=0;g>v;)p.call(h,d=f[v++])&&(e[d]=h[d]);return e}:c},vcHl:function(t,s,e){e("YD0x"),t.exports=e("zKeE").Object.assign},z7R8:function(t,s){s.f={}.propertyIsEnumerable}});