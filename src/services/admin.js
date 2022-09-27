import {
    USERLIST, REGISTER, DELETEBYADMINID, UPDATEBYADMINID,
    GETROLESBYADMINID, USERSUPERLIST, ADMINROLERELATIONLIST,
    GETALLROLES, GETRANSFERVO, UPDATEROLESBYUSERNAME, UPDATEROLE,
    DELETEROLEBYID, ADDROLE, MENUTREELIST, GETMENUNAME, DELETEMENUBYID,
    UPDATEMENU, ADDMENU, UPDATEROLEANDOPR, GETROLELIST, GETMENUBYROLEID, ALLOCATEMENU
} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 获取用户列表
 * @param pageNum 表示第几页
 * @param pageSize 条数
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function dataSource({page, pageSize, ...conditions}) {
    return request(USERLIST, METHOD.POST, {
        pageNum: page,
        pageSize,
        ...conditions
    })
}

export async function superDataSource({page, pageSize, ...conditions}) {
    return request(USERSUPERLIST, METHOD.POST, {
        pageNum: page,
        pageSize,
        ...conditions
    })
}

export async function register(params) {
    return request(REGISTER, METHOD.POST, params)
}

export async function deleteById(params) {
    return request(DELETEBYADMINID + `/${params}`, METHOD.GET)
}

export async function updateById(adminId, {email, nickName, note, status}) {
    return request(UPDATEBYADMINID + `/${adminId}`, METHOD.POST, {
        nickName,
        email,
        note,
        status
    })
}

export async function getRolesByAdminId(adminId){
    return request(GETROLESBYADMINID + `/${adminId}`, METHOD.GET)
}

export async function adminRoleRelationList({pageNum, pageSize}){
    return request(ADMINROLERELATIONLIST, METHOD.GET, {
        pageNum,
        pageSize
    })
}

export async function getAllRoles({pageNum, pageSize, ...conditions}){
    return request(GETALLROLES, METHOD.POST, {
        pageNum,
        pageSize,
        ...conditions
    })
}

export async function getRoleTransfer(adminName){
    return request(GETRANSFERVO + `/${adminName}`, METHOD.GET)
}

export async function updateRolesByUsername(username, roleIds){
    return request(UPDATEROLESBYUSERNAME, METHOD.POST, {
        username,
        roleIds
    })
}

export async function updateRoleById(id, {...conditions}){
    return request(UPDATEROLE + `/${id}`, METHOD.POST, {
        ...conditions
    })
}

export async function updateRoleAndOpr(id, {...conditions}){
    return request(UPDATEROLEANDOPR + `/${id}`, METHOD.POST, {
        ...conditions
    })
}

export async function deleteRoleById(id){
    return request(DELETEROLEBYID + `/${id}`, METHOD.GET)
}

export async function addRole({...role}){
    return request(ADDROLE, METHOD.POST, {
        ...role
    })
}

export async function getMenuTreeList(){
    return request(MENUTREELIST, METHOD.GET)
}

export async function getMenuName(){
    return request(GETMENUNAME, METHOD.GET)
}

export async function deleteMenuById(id) {
    return request(DELETEMENUBYID + `/${id}`, METHOD.GET)
}

export async function updateMenuById({...params}) {
    return request(UPDATEMENU + `/${params.id}`, METHOD.POST, {
        ...params
    })
}

export async function addMenu({...params}) {
    return request(ADDMENU, METHOD.POST, {
        ...params
    })
}

export async function getRoleList() {
    return request(GETROLELIST, METHOD.GET)
}

export async function getMenuByRoleId(roleId) {
    return request(GETMENUBYROLEID + `/${roleId}`, METHOD.GET)
}

export async function allocateMenu(roleId, menuIds) {
    return request(ALLOCATEMENU, METHOD.POST, {
        roleId,
        menuIds
    })
}
export default {
    dataSource,
    superDataSource,
    register,
    deleteById,
    updateById,
    getRolesByAdminId,
    adminRoleRelationList,
    getAllRoles,
    getRoleTransfer,
    updateRolesByUsername,
    updateRoleById,
    deleteRoleById,
    addRole,
    getMenuTreeList,
    getMenuName,
    deleteMenuById,
    updateMenuById,
    addMenu,
    updateRoleAndOpr,
    getRoleList,
    getMenuByRoleId,
    allocateMenu
}
