import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import {getRequest} from './network/request'
import {postRequest} from './network/request'
import {postRequest2} from './network/request'
import {deleteRequest} from './network/request'
import {putRequest} from './network/request'
import './utils/filter_utils'
import './icons' // icon

Vue.config.productionTip = false

Vue.use(ElementUI)
// 在原型上添加网络请求对象
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.postRequest2 = postRequest2;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  //获取从vuex获取用户角色
  const role = localStorage.getItem('user' || '[]') == null ? '未登录'
   : JSON.parse(localStorage.getItem('user' || '[]')).role;
  //  console.log(role);
  if(to.meta.requireAuth){ //需要权限
    if(role == '未登录'){ //未登录
      next('/login');
    } else if (role == '读者') { //权限不足
      next('/401');
    } else { //管理员
      next();
    }
  } else { //不需要权限
    next();
  }

  // if(to.path == '/login' || to.path == ''){
  //   next();
  // } else {
  //   if (role == '未登录') {// 未登录
  //     next('/login');
  //   } else if (role == '管理员') {// 管理员 可进入全部页面
  //       next();
  //   } else { //读者
  //       if (to.meta.requireAuth) { //需要权限
  //         next('/401');
  //       } else {
  //         next();
  //       }
  //   }
  // }

})
