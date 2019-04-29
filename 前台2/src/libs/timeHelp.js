/*
 * @Author: yinxl 
 * @Date: 2019-04-29 09:14:22 
 * @Last Modified by: yinxl
 * @Last Modified time: 2019-04-29 09:18:56
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