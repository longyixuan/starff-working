<style lang="less">
@import "./design.less";
</style>
<template>
    <Card dis-hover title="录入">
        <div style="margin-bottom: 20px;" class="clearfix">
            <DatePicker @on-change="getList" v-model="year" :clearable="false" type="year" style="width: 160px"></DatePicker>
        </div>
        <Table class="num-table" border :data="data" :columns="columns" stripe>
            <template slot-scope="{ row }" slot="action">
                <template v-if="!row.noEdit">
                    <span v-if="row.isEdit" class="action-btn" @click="save(row)">保存</span>
                    <span v-else class="action-btn" @click="edit(row)">编辑</span>
                </template>
            </template>
        </Table>
    </Card>
</template>
<script>
import {
    listDesignTag,
    addDesign,
    detailDesign,
} from '@/api/index';
import moment from "moment";
export default {
    name: 'design',
    data() {
        return {
            monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            tagList: [],
            data: [],
            userId: JSON.parse(localStorage.getItem('userInfo')).userId,
            year: new Date(),
            isEdit: false,
            columns: []
        }
    },
    methods: {
        getList() {
            listDesignTag().then( res => {
                this.tagList = res.data;
                this.$nextTick().then( ()=>{
                    this.createColumns();
                });
            });
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
                            if (parmars.row.isEdit) {
                                return h('Input',{
                                    class: 'num-input',
                                    props: {
                                        value: parmars.row['tagNum_'+element.id]
                                    },
                                    on: {
                                        'input': function(value) {
                                            parmars.row['tagNum_'+element.id] = value;
                                        }
                                    }
                                });
                            } else {
                                return h('span',{}, parmars.row['tagNum_'+element.id]===0?'-':parmars.row['tagNum_'+element.id]);
                            }
                        }
                    });
                }
                element.child.forEach( ele => {
                    ids['tagNum_'+ele.id] = 0;
                    ids['tagDes_'+ele.id] = '';
                    children.push({
                        title: ele.name,
                        key: 'tagNum_'+ele.id,
                        align: 'right',
                        width: 110,
                        render: function(h, parmars) {
                            if (parmars.row.isEdit) {
                                return h('Input',{
                                    class: 'num-input',
                                    props: {
                                        value: parmars.row['tagNum_'+ele.id]
                                    },
                                    on: {
                                        'input': function(value) {
                                            parmars.row['tagNum_'+ele.id] = value;
                                        }
                                    }
                                });
                            } else {
                                return h('span',{}, (parmars.row['tagNum_'+ele.id]===0 || !parmars.row['tagNum_'+ele.id])?'-':parmars.row['tagNum_'+ele.id]);
                            }
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
                                if (parmars.row.isEdit) {
                                    return h('Input',{
                                        class: 'text-input',
                                        props: {
                                            value: parmars.row['tagDes_'+ele.id],
                                            type: 'textarea',
                                            rows: 4
                                        },
                                        on: {
                                            'input': function(value) {
                                                parmars.row['tagDes_'+ele.id] = value;
                                            }
                                        }
                                    });
                                } else {
                                    if (!parmars.row['tagDes_'+ele.id]) {
                                        return h('span', {}, '')
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
                            if (parmars.row.isEdit) {
                                return h('Input',{
                                    class: 'text-input',
                                    props: {
                                        value: parmars.row['tagDes_'+element.id],
                                        type: 'textarea',
                                        rows: 4
                                    },
                                    on: {
                                        'input': function(value) {
                                            parmars.row['tagDes_'+element.id] = value;
                                        }
                                    }
                                });
                            } else {
                                if (parmars.row['tagDes_'+element.id] == '') {
                                    return h('span', {}, '')
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
                        }
                    })
                }
                this.columns.push({
                    title: element.name,
                    align: 'center',
                    children: children
                });
            });
            if (this.userId) {
                this.columns.push({
                    title: '操作',
                    slot: 'action',
                    width: 60,
                    align: 'center',
                    fixed: 'right'
                })
            }
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
        edit(item) {
            item.isEdit = true;
        },
        save(item) {
            item.isEdit = false;
            let postData = [];
            let month = item.month;
            let year = moment(this.year).format('YYYY');
            let userId = this.userId;
            _.forIn(item, function(value, key) {
                if (key.indexOf('tagNum_')!==-1) {
                    postData.push({
                        year: year,
                        month: month,
                        userId: userId,
                        tagId: key.split('_')[1],
                        tagNum: value,
                        tagDes: item['tagDes_'+key.split('_')[1]]?item['tagDes_'+key.split('_')[1]]:''
                    });
                }
            });
            addDesign({ data: postData }).then( res => {
                if (res.code === 1) {
                    this.$Message.success('操作成功');
                }
            });
        },
        init() {
            detailDesign({
                year: moment(this.year).format('YYYY'),
                userId: this.userId,
            }).then(res => {
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
        },
        initT(data2,data3) {
            let temp = {
                month: '全年',
                noEdit: true
            };
            data2.forEach( ele => {
                temp['tagNum_'+ele.tagId] = ele.sum;
                temp['tagDes_'+ele.tagId] = '';
                let obj = _.find(data3, ['tagId', ele.tagId]);
            });
            this.data.push(temp);
        }
    },
    mounted() {
        this.getList();
    }
}
</script>