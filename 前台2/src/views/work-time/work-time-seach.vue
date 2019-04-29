<style lang="less" scoped>
  @import "./work-time.less";
</style>
<template>
    <Card>
        <Date-picker @on-change="handelChange" style="width: 100%;" type="daterange" class="margin-bottom20" confirm placeholder="选择日期"></Date-picker>
        <Select clearable multiple placeholder="选择员工" v-model="people" class="margin-bottom20">
            <Option v-for="item in peopleList" :value="item.userId" :key="item.userId">{{ item.nickName }}</Option>
        </Select>
        <Select clearable multiple placeholder="选择系统" v-model="system" class="margin-bottom20">
            <Option v-for="item in systemList" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Button type="primary" @click="seach" class="margin-bottom20">查询</Button>
        <Table v-if="columns.length>0" border :columns="columns" :data="workList" stripe ref="table">
            <template slot-scope="{ row }" slot="systemName">
                <strong>{{ row.systemName }}</strong>
            </template>
        </Table>
        <!-- <div style="margin-top: 20px;">
            <Button type="primary" @click="exportData()">导出数据</Button>
        </div> -->
    </Card>
</template>
<script>
import {
  getCountTime,
  getSystemList,
  getAllUserData
} from "@/api/index";
import { getAll } from "@/libs/timeHelp";
import Cookies from "js-cookie";
export default {
    data () {
        return {
            startTime: '',
            endTime: '',
            people: [],
            peopleList: [],
            system: [],
            systemList: [],
            workList: [],
        }
    },
    computed: {
        columns() {
            if (this.startTime!==''&&this.endTime!=='') {
                let column = [];
                let dataList = getAll(this.startTime, this.endTime);
                column.push({
                    title: '系统/时间(h)',
                    minWidth: 150,
                    fixed: 'left',
                    slot: 'systemName'
                })
                for(let i = 1; i<dataList.length; i++) {
                    column.push({
                        title: dataList[i],
                        key: dataList[i],
                        width: 116,
                        sortable: true,
                        align: 'center'
                    })
                }
                return column;
            } else {
                return [];
            }
        }
    },
    methods: {
        handelChange (date) {
            this.startTime = date[0];
            this.endTime = date[1];
        },
        seach() {
            let postData = {
                startTime: this.startTime,
                endTime: this.endTime,
                people: this.people,
                system: this.system
            }
            this.getTimeList(postData);
        },
        getTimeList(data) {
            getCountTime(data).then( res => {
                if (res.code === 1) {
                    this.workList = res.data
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
        this.getUserList();
        this.getSystemList();
    }
}
</script>
