# shop

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


vuex
//0 组件内通过mapState获取初始状态
//1 组件内派发一个动作到actions mapActions
//2 actions commit mutations
//3 mutations change state
//4 仓库内通过 Getters返回改变的状态
//5 组件内通过 mapGetters 获取 改变的状态  这个状态权限大于mapState
