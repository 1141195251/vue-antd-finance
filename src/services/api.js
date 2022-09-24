//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL

const roleUrls = {
  ADDROLE: `${BASE_URL}/service-admin/role/create`,
  UPDATEROLE: `${BASE_URL}/service-admin/role/update`,
  DELETEROLEBYID: `${BASE_URL}/service-admin/role/delete`
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
  GETALLROLES: `${BASE_URL}/service-admin/role/listAllPage`,
  GETRANSFERVO: `${BASE_URL}/service-admin/admin/role/transfer`,
  UPDATEROLESBYUSERNAME: `${BASE_URL}/service-admin/admin/role/updateByUsername`,
  UPDATEROLE: roleUrls.UPDATEROLE,
  DELETEROLEBYID: roleUrls.DELETEROLEBYID,
  ADDROLE: roleUrls.ADDROLE
}
