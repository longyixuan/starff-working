<style lang="less">
@import "./design.less";
</style>
<template>
    <Card title="录入">
        <Table class="num-table" border :data="data" :columns="columns" stripe>
            <template slot-scope="{ row }" slot="action">
                <Button v-if="row.isEdit" type="warning" size="small" @click="save(row)">保存</Button>
                <Button v-else type="primary" size="small" @click="edit(row)">编辑</Button>
            </template>
        </Table>
    </Card>
</template>
<script>
import {
    listDesignTag,
    addDesign,
    detailDesign,
    allDesign
} from '@/api/index';
import moment from "moment";
export default {
    name: 'design',
    data() {
        return {
            monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            tagList: [],
            data: [],
            year: moment().format('YYYY'),
            isEdit: false,
            columns: [
                {
                    title: '月份',
                    key: 'month',
                    align: 'center',
                    fixed: 'left',
                    width: 70
                }
            ]
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
            let ids = {};
            let _this = this;
            this.tagList.forEach( element => {
                ids['tagNum_'+element.id] = 0;
                ids['tagDes_'+element.id] = '';
                this.columns.push({
                    title: element.name,
                    align: 'center',
                    children: [
                        {
                            title: '数量',
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
                        },
                        {
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
                        }
                    ]
                });
            });
            this.columns.push({
                title: '操作',
                slot: 'action',
                width: 70,
                align: 'center',
                fixed: 'right'
            })
            this.createData(ids);
        },
        createData(ids) {
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
            let year = this.year;
            let userId = JSON.parse(localStorage.getItem('userInfo')).userId;
            _.forIn(item, function(value, key) {
                if (key.indexOf('tagNum_')!==-1) {
                    postData.push({
                        year: year,
                        month: month,
                        userId: userId,
                        tagId: key.split('_')[1],
                        tagNum: value,
                        tagDes: item['tagDes_'+key.split('_')[1]]
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
                year: this.year,
                userId: JSON.parse(localStorage.getItem('userInfo')).userId,
            }).then(res => {
                if (res.code===1 && res.data.length>0) {
                    res.data.forEach( ele => {
                        let _index = _.findIndex(this.data, ['month', ele.month]);
                        ele.content.forEach( ele2 => {
                            this.data[_index]['tagNum_'+ele2.tagId] = ele2.tagNum;
                            this.data[_index]['tagDes_'+ele2.tagId] = ele2.tagDes;
                        });
                    });
                }
            });
            allDesign({year: this.year}).then(res => {});
        }
    },
    mounted() {
        this.getList();
    }
}
</script>