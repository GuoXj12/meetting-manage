import { get, post } from './request'
// 返回所有用户
const WorkRecordManager = {
    getAllWork: (params) => get(`Work/WorkInfo`,params),
    setWork: (params) => post(`Work/set`, params),
    updateWork: (params) => post(`Work/update`, params),
    deleteWork: (id) => get(`Work/delete?id=${id}`),
}
export { WorkRecordManager }
