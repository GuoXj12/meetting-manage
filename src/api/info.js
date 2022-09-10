import { get } from './request'
// 返回所有用户
const infoManager = {
    getTotalData: (params) => get(`Info/getTotalData`,params),
    getTypeData: (params) => get(`Info/getTypeData`,params),


}
export { infoManager }
