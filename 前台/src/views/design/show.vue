<style lang="less">
@import "./design.less";
</style>
<template>
    <Card dis-hover title="查看">
        <div style="margin-bottom: 20px;" class="clearfix">
            <DatePicker v-model="year" :clearable="false" type="year" style="width: 160px;margin-right:10px;"></DatePicker>
            <Select clearable @on-clear="clearDepartment" v-model="departmentId" placeholder="请选择部门" @on-change="getUserList" style="width:160px;margin-right: 10px;">
                <Option v-for="item in departmentList" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
            <Select clearable v-model="userId" style="width: 160px;margin-right:10px;" placeholder="请选择姓名">
                <Option :value="item.userId" :key="item.userId" v-for="item in userList">{{item.nickName}}</Option>
            </Select>
            <Button type="primary" style="margin-right: 8px;" @click="getList">查询</Button>
        </div>
        <Table class="num-table" border :data="data" :columns="columns" stripe></Table>
    </Card>
</template>
<script>
import {
    listDesignTag,
    detailDesign,
    getUserByDepartmentId,
    allDesign,
    initDepartment
} from '@/api/index';
import moment from "moment";
export default {
    name: 'design',
    data() {
        return {
            monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            tagList: [],
            data: [],
            userList: [],
            userId: '',
            year: new Date(),
            isEdit: false,
            columns: [],
            departmentId: '',
            departmentList: []
        }
    },
    methods: {
        clearDepartment() {
            this.userList = [];
            this.userId= '';
        },
        initDepartment() {
            initDepartment().then(res => {
                if (res.code === 1) {
                    this.departmentList = res.data;
                }
            });
        },
        getList() {
            listDesignTag().then( res => {
                this.tagList = res.data;
                this.$nextTick().then( ()=>{
                    this.createColumns();
                });
            });
        },
        getUserList(departmentId) {
            if (departmentId) {
                getUserByDepartmentId(departmentId, {
                    defaultRole: 'sj'
                }).then(res => {
                    if (res.code === 1) {
                        this.userList = res.data;
                    }
                });
            }
        },
        createColumns() {
            this.columns = [
                {
                    title: '月份',
                    key: 'month',
                    align: 'center',
                    fixed: 'left',
                    width: 90
                }
            ];
            let ids = {};
            this.tagList.forEach( element => {
                ids['tagNum_'+element.id] = 0;
                ids['tagDes_'+element.id] = '';
                let children = [];
                if (element.child.length===0) {
                    children.push({
                        title: element.unit,
                        key: 'tagNum_'+element.id,
                        align: 'right',
                        width: 80,
                        render: function(h, parmars) {
                            return h('span',{}, !parmars.row['tagNum_'+element.id]?'0':parmars.row['tagNum_'+element.id]);
                        }
                    });
                }
                element.child.forEach( ele => {
                    children.push({
                        title: ele.name,
                        key: 'tagNum_'+ele.id,
                        align: 'right',
                        width: 110,
                        render: function(h, parmars) {
                            return h('span',{}, !parmars.row['tagNum_'+ele.id]?'0':parmars.row['tagNum_'+ele.id]);
                        }
                    })
                    if (ele.hasDes) {
                        children.push({
                            title: '备注',
                            key: 'tagDes_'+ele.id,
                            width: 80,
                            align: 'center',
                            resizable: true,
                            render: function(h, parmars) {
                                if (!parmars.row['tagDes_'+ele.id]) {
                                    return h('span', {}, '-')
                                } else {
                                    return h('Tooltip',{
                                        class: 'my-tooltip',
                                        props: {
                                            maxWidth: 200,
                                            content: parmars.row['tagDes_'+ele.id],
                                        },
                                    }, [
                                        h('a', {}, '查看')
                                    ]);
                                }
                            }
                        })
                    }
                });
                if (element.hasDes) {
                    children.push({
                        title: '备注',
                        key: 'tagDes_'+element.id,
                        width: 80,
                        align: 'center',
                        render: function(h, parmars) {
                            if (!parmars.row['tagDes_'+element.id]) {
                                return h('span', {}, '-')
                            } else {
                                return h('Tooltip',{
                                    class: 'my-tooltip',
                                    props: {
                                        maxWidth: 200,
                                        content: parmars.row['tagDes_'+element.id],
                                    },
                                }, [
                                    h('a', {}, '查看')
                                ]);
                            }
                        }
                    })
                }
                this.columns.push({
                    title: element.name,
                    align: 'center',
                    children: children
                });
            });
            this.createData(ids);
        },
        createData(ids) {
            this.data = [];
            this.monthList.forEach( element => {
                let temp = {...ids, ...{'month': element, isEdit: false}};
                this.data.push(temp);
            });
            this.init();
        },
        init() {
            if (this.userId) {
                detailDesign({
                    year: moment(this.year).format('YYYY'),
                    userId: this.userId,
                    departmentId: this.departmentId
                }).then(res => {
                    this.$Message.success('查询成功');
                    if (res.code===1 && res.data.length>0) {
                        res.data.forEach( ele => {
                            let _index = _.findIndex(this.data, ['month', ele.month]);
                            ele.content.forEach( ele2 => {
                                this.data[_index]['tagNum_'+ele2.tagId] = ele2.tagNum;
                                this.data[_index]['tagDes_'+ele2.tagId] = ele2.tagDes;
                            });
                        });
                        this.initT(res.data2,res.data3);
                    }
                });
            } else {
                allDesign({
                    year: moment(this.year).format('YYYY'),
                    departmentId: this.departmentId
                }).then(res => {
                    this.$Message.success('查询成功');
                    if (res.code===1 && res.data.length>0) {
                        res.data.forEach( ele => {
                            let _index = _.findIndex(this.data, ['month', ele.month]);
                            let tempIds = [];
                            ele.content.forEach( ele2 => {
                                if (tempIds.indexOf(ele2.tagId)!==-1) {
                                    this.data[_index]['tagNum_'+ele2.tagId] += ele2.tagNum;
                                    this.data[_index]['tagDes_'+ele2.tagId] += ele2.tagDes?(this.data[_index]['tagDes_'+ele2.tagId]?'\n'+ele2.tagDes:ele2.tagDes):'';
                                } else {
                                    this.data[_index]['tagNum_'+ele2.tagId] = ele2.tagNum;
                                    this.data[_index]['tagDes_'+ele2.tagId] = ele2.tagDes?(ele2.tagDes):'';
                                    tempIds.push(ele2.tagId);
                                }
                            });
                        });
                        this.initT(res.data2,res.data3);
                    }
                });
            }
        },
        initT(data2,data3) {
            let temp = {
                month: '全年',
                noEdit: true
            };
            let temp2 = {
                month: '占全员比',
                noEdit: true
            };
            data2.forEach( ele => {
                temp['tagNum_'+ele.tagId] = ele.sum;
                temp['tagDes_'+ele.tagId] = '';
                let obj = _.find(data3, ['tagId', ele.tagId]);
                if (obj.sum!==0) {
                    temp2['tagNum_'+ele.tagId] = `${(ele.sum/obj.sum*100).toFixed(2)}%`;
                } else {
                    temp2['tagNum_'+ele.tagId] = '0';
                }
                temp2['tagDes_'+ele.tagId] = '';
            });
            this.data.push(temp);
            if (this.userId) {
                this.data.push(temp2);
            }
        }
    },
    mounted() {
        this.departmentId = JSON.parse(localStorage.getItem('userInfo')).departmentId;
        this.initDepartment();
        // this.getUserList();
        this.getList();
    }
}
</script>