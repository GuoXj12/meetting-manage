import { get, post } from './request'
// 返回所有用户
const WeeklyManager = {
    setModel: (params) => post(`Weekly/setModel`, params),
    getWeeklyBasic: (params) => get(`Weekly/WeeklyInfo`,params),
    getWeeklyDetail: (params) => get(`Weekly/WeeklyInfoDetail`,params),


    getAllMeeting: (params) => get(`Meeting/MeetingInfo`,params),
    updateMeeting: (params) => post(`Meeting/update`, params),
    deleteMeeting: (id) => get(`Meeting/delete?id=${id}`),
}
export { WeeklyManager }
