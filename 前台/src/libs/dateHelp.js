Date.prototype.Format = function (fmt) {
  //需要JS格式化时间，后期做的时候方便使用
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

// 通过年获取 本年周数  year 年
function getWeekNum(year) {
  const firstDay = new Date(parseInt(year), 0, 1).getDay(), // 设置该年1.1星期
    endDay = new Date(parseInt(year), 11, 31).getDay(); // 设置该年12.31星期

  //该年最大周次.1.1.在周一到周四,则为该年第一周,否则为上年最后一周.
  const flag =
    firstDay >= 1 &&
    firstDay <= 4 &&
    (endDay == 0 || endDay == 4 || endDay == 5 || endDay == 6);
  // 1.1.和12.31.都在本年,则该年有53周,否则52周
  const maxWeek = flag ? 53 : 52;
  return maxWeek;
}
//通过年份、周数获取日期范围   year 年   weeks 周  getWeekRange(2019,12))--> 2019-03-18~2019-03-24
function getWeekRange(year, weekNum) {
  const yearStart = new Date(parseInt(year), 0, 1), //设置该年1.1.
    firstDay = yearStart.getDay(); // 星期
  // 对1.1.所在周的前后几天特殊处理.
  const other = firstDay >= 0 && firstDay <= 4 ? firstDay - 1 : firstDay - 8;

  //时间调整,得出要计算周的起/始时间.
  // 考虑距离当年1.1.的总天数
  let days = (parseInt(weekNum, 10) - 1) * 7 - other;
  // 一天时间的毫秒数
  let oneDay = 24 * 60 * 60 * 1000;

  // 当前周 第一天 离1/1/70的毫秒数.
  let dateInMs = oneDay * days + yearStart.getTime();
  //日期调整(设置1/1/70至今的毫秒数)
  const weekStart = new Date(dateInMs);

  //当前所选周最后一天处理,同上.
  let dateInMsE = oneDay * 6 + dateInMs;
  const weekEnd = new Date(dateInMsE);

  //月和日的处理,一位变两位,如:1->01.
  let month = weekStart.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = weekStart.getDate();
  day = day < 10 ? "0" + day : day;

  let monthE = weekEnd.getMonth() + 1;
  monthE = monthE < 10 ? "0" + monthE : monthE;
  let dayE = weekEnd.getDate();
  dayE = dayE < 10 ? "0" + dayE : dayE;
  return {
    month: weekStart.getFullYear() + "年" + month+"月",
    start: weekStart.getFullYear() + "-" + month + "-" + day,
    end: weekEnd.getFullYear() + "-" + monthE + "-" + dayE
  }
//   return (weekStart.getFullYear() + "-" + month + "-" + day) + "~" + (weekEnd.getFullYear() + "-" + monthE + "-" + dayE)
}
// 根据具体日期，获取当天所在周的周数
function getYearWeek(dateString) {
  var da = dateString; //日期格式2015-12-30
  //当前日期
  var date1 = new Date(
    da.substring(0, 4),
    parseInt(da.substring(5, 7)) - 1,
    da.substring(8, 10)
  );
  //1月1号
  var date2 = new Date(da.substring(0, 4), 0, 1);
  //获取1月1号星期（以周一为第一天，0周一~6周日）
  var dateWeekNum = date2.getDay() - 1;
  if (dateWeekNum < 0) {
    dateWeekNum = 6;
  }
  if (dateWeekNum < 4) {
    //前移日期
    date2.setDate(date2.getDate() - dateWeekNum);
  } else {
    //后移日期
    date2.setDate(date2.getDate() + 7 - dateWeekNum);
  }
  var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
  if (d < 0) {
    var date3 = date1.getFullYear() - 1 + "-12-31";
    return getYearWeek(date3);
  } else {
    //得到年数周数
    var year = date1.getFullYear();
    var week = Math.ceil((d + 1) / 7);
    return week;
  }
}

// 获取每年 所有周的范围
function getAllWeekRange(year) {
  let weekNum = getWeekNum(year);
  let weeks = [];
  for (let index = 0; index <= weekNum; index++) {
    let range = {
        range: getWeekRange(year, index),
        weekIndex: index+1
    };
    weeks.push(range);
  }
  return weeks;
}

module.exports = {
  getYearWeek: getYearWeek,
  getWeekRange: getWeekRange,
  getWeekNum: getWeekNum,
  getAllWeekRange: getAllWeekRange,
};
