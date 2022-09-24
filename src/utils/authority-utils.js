/**
 * 判断是否有路由的权限
 * @param authority 路由权限配置
 * @param permissions 用户权限集合
 * @returns {boolean|*}
 */
function hasPermission(authority, permissions) {
  let required = '*'
  if (typeof authority === 'string') {
    required = authority
  } else if (typeof authority === 'object') {
    required = authority.permission
  }
  // 路由没有配置，required的值没有变化，直接返回true
  // 路由有authority配置，required等于配置的权限字符
  // 然后再判断用户的权限集合(permissions)
  // 如果用户的权限集合为空并且路由权限配置也为空，返回true
  // 如果用户的权限集合为空并且路由权限配置不为空，返回false
  // 如果用户的权限集合不为空并且路由权限配置为空，返回true
  // 如果用户的权限集合不为空并且路由权限配置也不为空，就进行遍历判断
  // 用户权限集合依次遍历单个用户权限，与路由配置的权限和用户权限id进行比对，存在则返回true
  return required === '*' || (permissions && permissions.findIndex(item => item === required || item.id === required) !== -1)
}

/**
 * 判断是否有路由需要的角色
 * @param authority 路由权限配置
 * @param roles 用户角色集合
 */
function hasRole(authority, roles) {
  let required = undefined
  if (typeof authority === 'object') {
    required = authority.role
  }
  // 路由权限配置为*时，返回true，不用判断角色逻辑
  return authority === '*' || hasAnyRole(required, roles)
}

/**
 * 判断是否有需要的任意一个角色
 * @param required {String | Array[String]} 需要的角色，可以是单个角色或者一个角色数组
 * @param roles 拥有的角色
 * @returns {boolean}
 */
function hasAnyRole(required, roles) {
  // 如果required为空，即此路由不需要权限
  console.log('hasAnyRole is executing', required, roles)
  if (!required) {
    return false
    // 多个角色处理
  } else if(Array.isArray(required)) {
    return roles.findIndex(role => {
      // 遍历角色数组，直接在需要的角色数组上每次遍历的角色和已有的角色的id进行判断
      // 没有的话返回-1
      return required.findIndex(item => item === role || item === role.id) !== -1
    }) !== -1
  } else {
    return roles.findIndex(role => role === required || role.id === required) !== -1
  }
}

/**
 * 路由权限校验
 * @param route 路由
 * @param permissions 用户权限集合
 * @param roles 用户角色集合
 * @returns {boolean}
 */
function hasAuthority(route, permissions, roles) {
  const authorities = [...route.meta.pAuthorities, route.meta.authority]
  for (let authority of authorities) {
    if (!hasPermission(authority, permissions) && !hasRole(authority, roles)) {
      return false
    }
  }
  return true
}

/**
 * 根据权限配置过滤菜单数据
 * @param menuData
 * @param permissions
 * @param roles
 */
function filterMenu(menuData, permissions, roles) {
  return menuData.filter(menu => {
    if (menu.meta && menu.meta.invisible === undefined) {
      if (!hasAuthority(menu, permissions, roles)) {
        return false
      }
    }
    if (menu.children && menu.children.length > 0) {
      menu.children = filterMenu(menu.children, permissions, roles)
    }
    return true
  })
}

export {filterMenu, hasAuthority}
