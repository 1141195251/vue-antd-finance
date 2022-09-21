import {USERLIST, REGISTER, DELETEBYADMINID, UPDATEBYADMINID, GETROLESBYADMINID, USERSUPERLIST, ADMINROLERELATIONLIST} from '@/services/api'
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

export async function adminRoleRelationList({pageNum, pageSize, }){
    return request(ADMINROLERELATIONLIST, METHOD.GET, {
        pageNum,
        pageSize
    })
}
export default {
    dataSource,
    superDataSource,
    register,
    deleteById,
    updateById,
    getRolesByAdminId,
    adminRoleRelationList
}
