import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import AdminHome from '@/views/admin/Home'
import UserHome from "@/views/user/Home"
import UserList from "@/views/user/UserList"
import BookList from "@/views/book/BookList"
import BookItemList from "@/views/book/BookItemList"
import BorrowList from "@/views/borrow/BorrowList"
import BookAnalysis from "@/views/book/BookAnalysis"
import BookshelfPreview from "@/views/bookshelf/BookshelfPreview"
import BookshelfList from "@/views/bookshelf/BookshelfList"
import BookshelfMeasure from "@/views/bookshelf/BookshelfMeasure"
import UserProfile from "@/views/user/UserProfile"
import Welcome from "@/views/admin/Welcome"
import UserWelcome from "@/views/user/Welcome"
import Error404 from "@/views/error/404"
import Error401 from "@/views/error/401"
import BookshelfView from "@/views/user/BookshelfView"

// 使用路由插件
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/admin/home',
      name: '管理员首页',
      component: AdminHome,
      meta: {requireAuth: true,},
      children: [
        {name: '主页', path: '', component: Welcome, meta: {requireAuth: true,}},
        {name: '个人中心', path: '/user/profile', component: UserProfile, meta: {requireAuth: true,}},
        {name: '用户列表', path: '/user/list', component: UserList, meta: {requireAuth: true,}},
        {name: '图书列表', path: '/book/list', component: BookList, meta: {requireAuth: true,}},
        {name: '复本列表', path: '/bookitem/list', component: BookItemList, meta: {requireAuth: true,}},
        {name: '借阅列表', path: '/borrow/list', component: BorrowList, meta: {requireAuth: true,}},
        {name: '统计分析', path: '/book/analysis', component: BookAnalysis, meta: {requireAuth: true,}},
        {name: '书架列表', path: '/bookshelf/list', component: BookshelfList, meta: {requireAuth: true,}},
        {
          name: '书架预览',
          path: '/bookshelf/preview',
          component: BookshelfPreview,
          meta: {
            keepAlive: false,
            requireAuth: true,
          }
        },
        {name: '书架测算', path: '/bookshelf/measure', component: BookshelfMeasure, meta: {requireAuth: true,}},
      ]
    },
    {
      path: '/user/home',
      name: '读者首页',
      component: UserHome,
      children: [
        {name: '主页', path: '', component: UserWelcome},
        {name: '个人中心', path: '/user/profile2', component: UserProfile},
        {
          name: '书架视图',
          path: '/bookshelf/view',
          component: BookshelfView,
          meta: {
            keepAlive: false,
          }
        },
      ]
    },
    {
      path: '/401',
      component: Error401,
      name: '错误401',
    },
    {
      path:'*',
      component: Error404,
      name:'错误404',
    }
  ]
})
