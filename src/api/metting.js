import { get, post } from './request'
// 返回所有用户
const MeetingManager = {
    getAllMeeting: (params) => get(`Meeting/MeetingInfo`,params),
    setMeeting: (params) => post(`Meeting/set`, params),
    updateMeeting: (params) => post(`Meeting/update`, params),
    deleteMeeting: (id) => get(`Meeting/delete?id=${id}`),

}
export { MeetingManager }
