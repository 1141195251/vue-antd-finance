//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL

const roleUrls = {
  ADDROLE: `${BASE_URL}/service-admin/role/create`,
  UPDATEROLE: `${BASE_URL}/service-admin/role/update`,
  DELETEROLEBYID: `${BASE_URL}/service-admin/role/delete`,
  UPDATEROLEANDOPR: `${BASE_URL}/service-admin/role/updateRoleAndOpr`,
  GETROLELIST: `${BASE_URL}/service-admin/role/listAll`,
  GETMENUBYROLEID: `${BASE_URL}/service-admin/role/listMenu`,
  ALLOCATEMENU: `${BASE_URL}/service-admin/role/allocMenu`
}
const menuUrls = {
  ADDMENU: `${BASE_URL}/service-admin/menu/create`,
  MENUTREELIST: `${BASE_URL}/service-admin/menu/treeList`,
  GETMENUNAME: `${BASE_URL}/service-admin/menu/getMenuName`,
  UPDATEMENU: `${BASE_URL}/service-admin/menu/update`,
  DELETEMENUBYID: `${BASE_URL}/service-admin/menu/delete`,

}
module.exports = {
  LOGIN: `${BASE_URL}/service-admin/admin/login`,
  INFO: `${BASE_URL}/service-admin/admin/info`,
  USERLIST: `${BASE_URL}/service-admin/admin/list`,
  USERSUPERLIST: `${BASE_URL}/service-admin/admin/superList`,
  REGISTER: `${BASE_URL}/service-admin/admin/register`,
  DELETEBYADMINID: `${BASE_URL}/service-admin/admin/delete`,
  UPDATEBYADMINID: `${BASE_URL}/service-admin/admin/update`,
  GETROLESBYADMINID: `${BASE_URL}/service-admin/admin/role`,
  ADMINROLERELATIONLIST: `${BASE_URL}/service-admin/admin/adminRoleRelation/getList`,
  GETALLROLES: `${BASE_URL}/service-admin/role/listRoleAndOperationPage`,
  GETRANSFERVO: `${BASE_URL}/service-admin/admin/role/transfer`,
  UPDATEROLESBYUSERNAME: `${BASE_URL}/service-admin/admin/role/updateByUsername`,
  UPDATEROLE: roleUrls.UPDATEROLE,
  DELETEROLEBYID: roleUrls.DELETEROLEBYID,
  ADDROLE: roleUrls.ADDROLE,
  MENUTREELIST: menuUrls.MENUTREELIST,
  GETMENUNAME: menuUrls.GETMENUNAME,
  DELETEMENUBYID: menuUrls.DELETEMENUBYID,
  UPDATEMENU: menuUrls.UPDATEMENU,
  ADDMENU: menuUrls.ADDMENU,
  UPDATEROLEANDOPR: roleUrls.UPDATEROLEANDOPR,
  GETROLELIST: roleUrls.GETROLELIST,
  GETMENUBYROLEID: roleUrls.GETMENUBYROLEID,
  ALLOCATEMENU: roleUrls.ALLOCATEMENU
}
