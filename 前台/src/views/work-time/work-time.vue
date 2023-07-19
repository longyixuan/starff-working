<style lang="less">
  @import "./work-time.less";
</style>
<template>
    <Card dis-hover>
        <DatePicker :value="curYear" @on-change="changeYear" format="yyyy年" type="year" placeholder="年份" style="width: 140px;margin-bottom:15px;"></DatePicker>
        <Tabs type="card" :value="curMonth" @on-click="changeMonth">
            <template v-for="item in 12">
                <TabPane style="min-height: auto;" :label="item+ '月'" :name="item.toString()" :key="item"></TabPane>
            </template>
        </Tabs>
        <Table border :columns="columns" :data="tempList" stripe ref="table" :loading="loading">
            <template slot-scope="{ row }" slot="systemName">
                <strong>{{ row.systemName }}</strong>
            </template>
            <template slot-scope="{ row, index }" :slot="day" v-for="day in curMonthDays">
                <Input :key="'day-'+day" :placeholder="day.toString()" type="text" number v-model="row[day]" v-if="editIndex === index"/>
                <span :key="'day2-'+day" v-else>{{ !row[day] ? '-' : row[day] }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <div v-if="editIndex === index">
                    <span class="action-btn" @click="handleSave(row, index)">保存</span>
                </div>
                <div v-else>
                    <span class="action-btn" @click="handleEdit(row, index)">编辑</span>
                </div>
            </template>
        </Table>
    </Card>
</template>
<script>
import {
  getTimeList,
  postTime
} from "@/api/index";
export default {
    data () {
        return {
            curYear: (new Date).getFullYear()+'',
            columns: [],
            exportColumns: [],
            editIndex: -1,  // 当前聚焦的输入框的行数
            workList: [],
            loading: false,
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
        handleEdit (row, index) { //编辑
            this.editIndex = index;
        },
        handleSave (row, index) { //保存
            let postData = [];
            for (let i = 1; i<=this.curMonthDays; i++) {
                if (typeof(row[i])!=='undefined') {
                    if (row[i] == '') {
                        row[i] = 0;
                    }
                    postData.push({
                        systemId: row.systemId,
                        systemName: row.systemName,
                        userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                        userName: JSON.parse(localStorage.getItem('userInfo')).userName,
                        year: parseInt(this.curYear),
                        month: parseInt(this.curMonth),
                        day: i,
                        time: row[i]
                    })
                }
            }
            this.editIndex = -1;
            postTime({
                systemId: row.systemId,
                systemName: row.systemName,
                userId: JSON.parse(localStorage.getItem('userInfo')).userId,
                userName: JSON.parse(localStorage.getItem('userInfo')).userName,
                year: parseInt(this.curYear),
                month: parseInt(this.curMonth),
                data: JSON.stringify(postData)
            }).then((res)=>{
                if (res.code===1) {
                    this.$Message.success("保存成功");
                } else {
                    this.$Message.err("保存失败");
                }
            });
        },
        remove (index) {
            this.data.splice(index, 1);
        },
        changeMonth (name) {
            this.curMonth = name;
            this.changeDate();
            this.initList();
        },
        changeYear(a,b) {
            this.curYear = a.slice(0,4);
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
                sortable: true,
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
                    width: 55,
                    sortable: true,
                    align: 'center'
                })
                this.exportColumns.push({
                    title: i,
                    slot: i,
                    width: 50,
                    sortable: true,
                    align: 'center'
                })
            }
            this.columns.push({
                title: '操作',
                width: 60,
                align: 'center',
                fixed: 'right',
                slot: 'action'
            })
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
                userId: JSON.parse(localStorage.getItem('userInfo')).userId
            }
            this.loading = true;
            getTimeList(postData).then((res)=>{
                this.loading = false;
                if(res.code===1) {
                    this.workList = res.data;
                    this.$Message.success("查询成功");
                } else {
                    this.$Message.error("查询失败");
                }
            });
        },
        edit (index) {
        }
    },
    mounted () {
        this.mGetDate();
        this.initList();
    }
}
</script>
