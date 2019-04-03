<template>
    <div>
        <Tabs :value="curMonth" @on-click="changeMonth">
            <template v-for="item in 12">
                <TabPane :label="item+ '月'" :name="item.toString()" :key="item" @on-click="changeMonth"></TabPane>
            </template>
        </Tabs>
        <Table border :columns="columns" :data="tempList" stripe ref="table">
            <template slot-scope="{ row }" slot="systemName">
                <strong>{{ row.systemName }}</strong>
            </template>
            <template slot-scope="{ row, index }" :slot="day" v-for="day in curMonthDays">
                <Input type="text" number v-model="row[day]" v-if="editIndex === index"/>
                <span v-else>{{ !row[day] ? '-' : row[day] }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <div v-if="editIndex === index">
                    <Button @click="handleSave(row, index)" type="primary" ghost size="small">保存</Button>
                </div>
                <div v-else>
                    <Button @click="handleEdit(row, index)" type="primary" size="small">编辑</Button>
                </div>
            </template>
        </Table>
        <div style="margin-top: 20px;">
            <Button type="primary" @click="exportData(1)">导出原始数据</Button>
            <Button type="primary" style="margin-left: 20px;" @click="exportData(2)">导出排序数据</Button>
        </div>
    </div>
</template>
<style lang="scss">
.ivu-table-cell {
    padding: 0 8px !important;
}
</style>
<script>
export default {
    data () {
        return {
            curYear: (new Date).getFullYear()+'',
            columns: [],
            editIndex: -1,  // 当前聚焦的输入框的行数
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
        handleEdit (row, index) { //编辑
            this.editIndex = index;
        },
        handleSave (row, index) { //保存
            let postData = [];
            for (let i = 1; i<=this.curMonthDays; i++) {
                if (!!row[i]) {
                    postData.push({
                        systemId: row.systemId,
                        systemName: row.systemName,
                        userId: this.$store.state.mine.user.userId,
                        userName: this.$store.state.mine.user.userName,
                        year: this.curYear,
                        month: this.curMonth,
                        day: i,
                        time: row[i]
                    })
                }
            }
            this.editIndex = -1;
            this.$http.setWorktime({
                systemId: row.systemId,
                systemName: row.systemName,
                userId: this.$store.state.mine.user.userId,
                userName: this.$store.state.mine.user.userName,
                year: this.curYear,
                month: this.curMonth,
                data: postData
            }).then((res)=>{
                // console.log(res)
            }).catch();
            
        },
        exportData (type) {
            if (type === 1) {
                this.$refs.table.exportCsv({
                    filename: '原始数据'
                });
            } else {
                this.$refs.table.exportCsv({
                    filename: '排序数据',
                    original: false
                });
            }
        },
        remove (index) {
            this.data.splice(index, 1);
        },
        changeMonth (name) {
            // 请求月份
        },
        mGetDate () { //获取当前月天数，造日历
            let date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth()+1,
                d = new Date(year, month, 0),
                num = d.getDate();
            this.curMonthDays = num;
            this.columns = [];
            this.columns.push({
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
            }
            this.columns.push({
                title: '操作',
                width: 58,
                fixed: 'right',
                slot: 'action'
            })
        },
        initList () { //请求当前年月数据
            let postData = {
                year: this.curYear,
                month: this.curMonth,
                userId: this.$store.state.mine.user.userId
            }
            this.$http.getWorktime(postData).then((res)=>{
                this.workList = res.data;
            }).catch();
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
