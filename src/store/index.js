import Vue from 'vue';
import Vuex from 'vuex';

// 安装插件
Vue.use(Vuex)

// 创建对象
const store = new Vuex.Store({
  state: {
    user: {
      id: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).id,
      code: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).code,
      name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      gender: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).gender,
      email: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).email,
      phone: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).phone,
      idcard: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).idcard,
      role: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).role,
      registryDate: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).registryDate,
      userFace: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).userFace,
    },
  },
  mutations: { //定义方法  同步
    login(state, user){
      user.userFace = '/static/img/face.jpg';
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    logout(){
      window.localStorage.removeItem('user');
    },
  },
  actions: { // 异步

  },
  getters: { // 类似组件里的computed（计算属性）

  },
  modules: {

  }

})

// 导出
export default store
