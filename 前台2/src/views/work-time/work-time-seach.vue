<style lang="less" scoped>
  @import "./work-time.less";
</style>
<template>
    <Card>
        <Date-picker type="daterange" class="margin-bottom20" confirm placeholder="选择日期"></Date-picker>
        <Select clearable multiple placeholder="选择员工" v-model="people" class="margin-bottom20">
            <Option v-for="item in peopleList" :value="item.userId" :key="item.userId">{{ item.nickName }}</Option>
        </Select>
        <Select clearable multiple placeholder="选择系统" v-model="system" class="margin-bottom20">
            <Option v-for="item in systemList" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Button type="primary" @click="seach" class="margin-bottom20">查询</Button>
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
  getSystemList,
  getAllUserData
} from "@/api/index";
import Cookies from "js-cookie";
export default {
    data () {
        return {
            people: '',
            peopleList: [],
            system: '',
            systemList: [],
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
        seach() {
            let postData = {
                year: parseInt(this.curYear),
                month: parseInt(this.curMonth),
                userId: this.people
            }
            this.getTimeList(postData);
        },
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
            this.getTimeList(postData);
        },
        getTimeList(postData) {
            getTimeList(postData).then((res)=>{
                if(res.code===1) {
                    this.workList = res.data;
                    this.$Message.success("查询成功");
                } else {
                    this.$Message.error("查询失败");
                }
            });
        },
        getUserList() {
            getAllUserData().then(res => {
                if (res.code === 1) {
                    this.peopleList = res.data;
                }
            });
        },
        getSystemList() {
            getSystemList().then(res => {
                if (res.code === 1) {
                    this.systemList = res.data;
                }
            });
        }
    },
    mounted () {
        this.mGetDate();
        this.initList();
        this.getUserList();
        this.getSystemList();
    }
}
</script>
