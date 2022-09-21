// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  root: {
    path: '/',
    name: '首页',
    redirect: '/login',
    component: view.tabs
  },
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  auth: {
    name: '权限',
    component: view.blank
  },
  demo: {
    name: '演示页',
    renderMenu: false,
    component: () => import('@/pages/demo')
  },
  user: {
    name: '用户',
    component: view.page
  },
  role: {
    name: '角色',
    component: () => import('@/pages/auth')
  },
  menu: {
    name: '菜单',
    component: () => import('@/pages/demo')
  },
  resource: {
    name: '资源',
    component: () => import('@/pages/demo')
  },
  userdetails: {
    name: '用户详情',
    component: () => import('@/pages/components/table')
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  }
}
export default routerMap
