/*
 * @Author: yinxl 
 * @Date: 2019-04-29 09:14:22 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-08-13 15:01:46
 */
Date.prototype.format = function () {
        let s = '';
        let mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
        let day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
        s += this.getFullYear() + '-'; // 获取年份。
        s += mouth + "-"; // 获取月份。
        s += day; // 获取日。
        return (s); // 返回日期。
};

export const getAll = (begin, end) => {
    let arr = [];
    let ab = begin.split("-");
    let ae = end.split("-");
    let db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    let de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    let unixDb = db.getTime() - 24 * 60 * 60 * 1000;
    let unixDe = de.getTime() - 24 * 60 * 60 * 1000;
    for (let k = unixDb; k <= unixDe;) {
        k = k + 24 * 60 * 60 * 1000;
        arr.push((new Date(parseInt(k))).format());
    }
    return arr;	
}

/**
* 获取本周、本季度、本月、上月的开始日期、结束日期
*/
var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

//格式化日期：yyyy-MM-dd 
function formatDate(date) { 
var myyear = date.getFullYear(); 
var mymonth = date.getMonth()+1; 
var myweekday = date.getDate(); 

if(mymonth < 10){ 
mymonth = "0" + mymonth; 
} 
if(myweekday < 10){ 
myweekday = "0" + myweekday; 
} 
return (myyear+"-"+mymonth + "-" + myweekday); 
} 

//获得某月的天数 
function getMonthDays(myMonth){ 
var monthStartDate = new Date(nowYear, myMonth, 1); 
var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
return days; 
} 

//获得本季度的开始月份 
function getQuarterStartMonth(){ 
var quarterStartMonth = 0; 
if(nowMonth<3){ 
quarterStartMonth = 0; 
} 
if(2<nowMonth && nowMonth<6){ 
quarterStartMonth = 3; 
} 
if(5<nowMonth && nowMonth<9){ 
quarterStartMonth = 6; 
} 
if(nowMonth>8){ 
quarterStartMonth = 9; 
} 
return quarterStartMonth; 
} 

//获得本周的开始日期 
export function getWeekStartDate() {
var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1); 
return formatDate(weekStartDate); 
} 

//获得本周的结束日期 
export function getWeekEndDate() { 
var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek) + 1); 
return formatDate(weekEndDate); 
} 

//获得本月的开始日期 
export function getMonthStartDate(){ 
var monthStartDate = new Date(nowYear, nowMonth, 1); 
return formatDate(monthStartDate); 
} 

//获得本月的结束日期 
export function getMonthEndDate(){ 
var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth)); 
return formatDate(monthEndDate); 
}

//获得上月开始时间
export function getLastMonthStartDate(){
var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
return formatDate(lastMonthStartDate); 
}

//获得上月结束时间
export function getLastMonthEndDate(){
var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
return formatDate(lastMonthEndDate); 
}

//获得本季度的开始日期 
function getQuarterStartDate(){ 

var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1); 
return formatDate(quarterStartDate); 
} 

//或的本季度的结束日期 
function getQuarterEndDate(){ 
var quarterEndMonth = getQuarterStartMonth() + 2; 
var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)); 
return formatDate(quarterStartDate); 
}