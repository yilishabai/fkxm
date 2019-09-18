
import https from './https.js'
var BASE_HEAD = '/card/'

//登陆
export function userLogin(username,password){
    var Url = BASE_HEAD + `login/${username}/${password}`;
    return https.fetchGet(Url ).then(res => {
        return res.data;
    });
}

//获取可选择的年月
export function getYear(username){
    var Url = BASE_HEAD + `getYearAndMonth/${username}`;
    return https.fetchGet(Url ).then(res => {
        return res.data;
    });
}
//查询当日消费信息
export function getToday(username){
    var Url = BASE_HEAD + `today/${username}`;
    return https.fetchGet(Url ).then(res => {
        return res.data;
    });
}
//查询历史消费信息
export function getHistory(username,year,month){
    var Url = BASE_HEAD + `getHistoryRecord/${username}/${year}/${month}`;
    return https.fetchGet(Url ).then(res => {
        return res.data;
    });
}
//查询个人信息
export function getMine(username){
    var Url = BASE_HEAD + `getUserInfo/${username}`;
    return https.fetchGet(Url ).then(res => {
        return res.data;
    });
}