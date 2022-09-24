/**
 * 获取路由需要的权限
 * @param permissions
 * @param route
 * @returns {Permission}
 */
const getRoutePermission = (permissions, route) => permissions.find(item => item.id === route.meta.authority.permission)
/**
 * 获取路由需要的角色
 * @param roles 持有的角色
 * @param route
 * @returns {Array[Role]}
 */
const getRouteRole = (roles, route) => {
  const requiredRoles = route.meta.authority.role
  // 判断当前路由获取到需要的角色或多个角色
  // 如果当前路由没有设置需要的角色，则返回空数组
  // 如果当前路由设置了需要的角色或者多个角色，在持有的角色item中过滤出和其需要的角色相一致的角色，然后返回此数组
  // 意思就是在你持有的角色中筛选出和需要的角色一样的角色，没有返回空数组
  return requiredRoles ? roles.filter(item => requiredRoles.findIndex(required => required === item.id) !== -1) : []
}
/**
 * 判断是否已为方法注入权限认证
 * @param method
 * @returns {boolean}
 */
const hasInjected = (method) => method.toString().indexOf('//--auth-inject') !== -1

/**
 * 操作权限校验
 * @param authConfig
 * @param permission
 * @param role
 * @param permissions
 * @param roles
 * @returns {boolean}
 */
const auth = function(authConfig, permission, role, permissions, roles) {
  // authConfig的模板 deleteRecord: {
  //                  check: 'delete',
  //                  type: 'role'
  //                 }

  const {check, type} = authConfig
  // 检测到有check属性配置，并且此属性类型是一个函数时
  if (check && typeof check === 'function') {
    return check.apply(this, [permission, role, permissions, roles])
  }
  // 检测到类型属性为‘permission’字符串时
  if (type === 'permission') {
    return checkFromPermission(check, permission)
  } else if (type === 'role') {  // 检测到type属性为'role'字符串时
    // 将需要的操作权限字符和持有的角色传进，开始检测是否有权限
    return checkFromRoles(check, roles)

  } else {
    return checkFromPermission(check, permission) || checkFromRoles(check, roles)
  }
}

/**
 * 检查权限是否有操作权限
 * @param check 需要检查的操作权限
 * @param permission 权限
 * @returns {boolean}
 */
const checkFromPermission = function(check, permission) {
  return permission && permission.operation && permission.operation.indexOf(check) !== -1
}

/**
 * 检查 roles 是否有操作权限
 * @param check 需要检查的操作权限
 * @param roles 角色数组
 * @returns {boolean}
 */
const checkFromRoles = function(check, roles) {
  // 如果未持有任何角色，则直接返回没有权限
  if (!roles) {
    return false
  }
  for (let role of roles) {
    // 拿到其operation数组
    const {operation} = role
    if (operation && operation.indexOf(check) !== -1) {
      return true
    }
  }
  return false
}

const checkInject = function (el, binding,vnode) {
  const type = binding.arg
  const check = binding.value
  const instance = vnode.context
  const $auth = instance.$auth
  if (!$auth || !$auth(check, type)) {
    addDisabled(el)
  } else {
    removeDisabled(el)
  }
}

const addDisabled = function (el) {
  if (el.tagName === 'BUTTON') {
    el.disabled = true
  } else {
    el.classList.add('disabled')
  }
  el.setAttribute('title', '无此权限')
}

const removeDisabled = function (el) {
  el.disabled = false
  el.classList.remove('disabled')
  el.removeAttribute('title')
}

const AuthorityPlugin = {
  install(Vue) {
    Vue.directive('auth', {
      bind(el, binding,vnode) {
        setTimeout(() => checkInject(el, binding, vnode), 10)
      },
      componentUpdated(el, binding,vnode) {
        setTimeout(() => checkInject(el, binding, vnode), 10)
      },
      unbind(el) {
        removeDisabled(el)
      }
    })
    Vue.mixin({
      beforeCreate() {
        if (this.$options.authorize) {
          const authorize = this.$options.authorize
          Object.keys(authorize).forEach(key => {
            if (this.$options.methods[key]) {
              const method = this.$options.methods[key]
              if (!hasInjected(method)) {
                let authConfig = authorize[key]
                authConfig = (typeof authConfig === 'string') ? {check: authConfig} : authConfig
                const {check, type, onFailure} = authConfig
                this.$options.methods[key] = function () {
                  //--auth-inject
                  if (this.$auth(check, type)) {
                    return method.apply(this, arguments)
                  } else {
                    if (onFailure && typeof onFailure === 'function') {
                      this[`$${check}Failure`] = onFailure
                      return this[`$${check}Failure`](check)
                    } else {
                      this.$message.error(`对不起，您没有操作权限：${check}`)
                    }
                    return 0
                  }
                }
              }
            }
          })
        }
      },
      methods: {
        /**
         * 操作权限校验
         * @param check 需要校验的操作名
         * @param type 校验类型，通过 permission 校验，还是通过 role 校验。
         * 如未设置，则自动识别，如匹配到当前路由 permission 则 type = permission，否则 type = role
         * @returns {boolean} 是否校验通过
         */
        $auth(check, type) {
          const permissions = this.$store.getters['account/permissions']
          const roles = this.$store.getters['account/roles']
          const permission = getRoutePermission(permissions, this.$route)
          const role = getRouteRole(roles, this.$route)
          return auth.apply(this, [{check, type}, permission, role, permissions, roles])
        }
      }
    })
  }
}

export default AuthorityPlugin
