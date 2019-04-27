<style lang="less" scoped>
  @import "./work-time.less";
</style>
<template>
    <Card>
        <DatePicker :value="curYear" @on-change="changeYear" format="yyyy年" type="year" placeholder="年份" style="width: 140px;margin-bottom:15px;"></DatePicker>
        <Tabs type="card" :value="curMonth" @on-click="changeMonth">
            <template v-for="item in 12">
                <TabPane :label="item+ '月'" :name="item.toString()" :key="item"></TabPane>
            </template>
        </Tabs>
        <Select placeholder="选择员工" v-model="people" style="width:150px;margin-bottom: 20px;">
            <Option v-for="item in peopleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select placeholder="选择系统" v-model="people" style="width:150px;margin-bottom: 20px;margin-left: 10px;">
            <Option v-for="item in peopleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" style="margin-left:10px;display:inline-block;margin-bottom: 20px;">查询</Button>
        <Table border :columns="columns" :data="tempList" stripe ref="table">
            <template slot-scope="{ row }" slot="systemName">
                <strong>{{ row.systemName }}</strong>
            </template>
            <template slot-scope="{ row, index }" :slot="day" v-for="day in curMonthDays">
                <span :key="'day2-'+day">{{ !row[day] ? '-' : row[day] }}</span>
            </template>
        </Table>
        <!-- <div style="margin-top: 20px;">
            <Button type="primary" @click="exportData()">导出数据</Button>
        </div> -->
    </Card>
</template>
<script>
import {
  getTimeList,
  getSystemList
} from "@/api/index";
import Cookies from "js-cookie";
export default {
    data () {
        return {
            people: '',
            peopleList: [],
            curYear: (new Date).getFullYear()+'',
            columns: [],
            workList: [],
            curMonth: (new Date().getMonth()+1).toString(), //当前月
            curMonthDays: 0
        }
    },
    computed: {
        tempList () {
            let newList = []
            for (let i = 0; i<this.workList.length;i++) {
                let item = {
                    'systemName': this.workList[i].systemName,
                    'systemId': this.workList[i].systemId
                }
                for (let j = 0;j<this.workList[i].timeList.length;j++) {
                    item = Object.assign(item, { [this.workList[i].timeList[j].day] : this.workList[i].timeList[j].duration});
                }
                newList.push(item)
            }
            return newList;
        }
    },
    methods: {
        exportData () {
            this.$refs.table.exportCsv({
                filename: this.curYear+'年'+this.curMonth+'月工时统计'+'（'+JSON.parse(Cookies.get("userInfo")).nickName+'）'
            });
        },
        changeMonth (name) {
            this.curMonth = name;
            this.changeDate();
            this.initList();
        },
        changeYear(a,b) {
            this.curYear = a;
            this.changeDate();
            this.initList();
        },
        readerTable(num) {
            this.curMonthDays = num;
            this.columns = [];
            this.exportColumns = [];
            this.columns.push({
                title: '系统/时间(h)',
                width: 150,
                fixed: 'left',
                slot: 'systemName'
            })
            this.exportColumns.push({
                title: '系统/时间(h)',
                width: 150,
                fixed: 'left',
                slot: 'systemName'
            })
            for(let i = 1; i<=num; i++) {
                this.columns.push({
                    title: i,
                    slot: i,
                    width: 70,
                    sortable: true,
                    align: 'center'
                })
                this.exportColumns.push({
                    title: i,
                    slot: i,
                    width: 70,
                    sortable: true,
                    align: 'center'
                })
            }
        },
        changeDate() {
            let date = new Date(this.curYear + '-' + this.curMonth),
                year = date.getFullYear(),
                month = date.getMonth()+1,
                d = new Date(year, month, 0),
                num = d.getDate();
            this.readerTable(num);
        },
        mGetDate () { //获取当前月天数，造日历
            let date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth()+1,
                d = new Date(year, month, 0),
                num = d.getDate();
            this.readerTable(num);
        },
        initList () { //请求当前年月数据
            let postData = {
                year: parseInt(this.curYear),
                month: parseInt(this.curMonth),
                userId: JSON.parse(Cookies.get("userInfo")).userId
            }
            getTimeList(postData).then((res)=>{
                if(res.code===1) {
                    this.workList = res.data;
                    this.$Message.success("查询成功");
                } else {
                    this.$Message.error("查询失败");
                }
            });
        }
    },
    mounted () {
        this.mGetDate();
        this.initList();
    }
}
</script>
