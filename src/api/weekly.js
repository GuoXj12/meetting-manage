import { get, post } from './request'
// 返回所有用户
const WeeklyManager = {
    setModel: (insertDate) => get(`Weekly/setModel?insertDate=${insertDate}`),
    getWeeklyBasic: (params) => get(`Weekly/WeeklyInfo`,params),
    getWeeklyDetail: (params) => get(`Weekly/WeeklyInfoDetail`,params),
    getOption: (params) => get(`Weekly/getOption`,params),
    saveMeeting: (formDate) => post(`Weekly/saveMeeting`, formDate),

    getAllMeeting: (params) => get(`Meeting/MeetingInfo`,params),
    updateMeeting: (params) => post(`Meeting/update`, params),
    deleteMeeting: (id) => get(`Meeting/delete?id=${id}`),
}
export { WeeklyManager }
