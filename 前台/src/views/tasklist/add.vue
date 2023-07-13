<style lang="less">
@import './tasklist.less';
</style>

<template>
    <Card title="任务清单管理 - 编辑">
        <Form :label-width="80">
            <FormItem label="名称">
                <Input v-model.trim="name" placeholder="请输入任务清单名称" clearable></Input>
            </FormItem>
            <FormItem label="任务">
                <div style="margin-bottom: 10px">
                    <Button type="primary" @click="addLM">增加栏目</Button>
                    <span style="color: #999; margin-left: 10px">序号相同的自动合并单元格，最多可合并2行。</span>
                </div>
                <Table :columns="columns" :data="list" border :disabled-hover="true" :span-method="spanMethod">
                    <template slot-scope="{ row }" slot="dsj">
                        <template v-if="row.zt == 'dsj'">
                            <Tooltip content="待设计">
                                <Icon type="md-flag" color="#808695" size="16"/>
                            </Tooltip>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="sjz">
                        <template v-if="row.zt == 'sjz'">
                           <Tooltip content="设计中">
                                <Icon type="md-flag" color="#808695" size="16"/>
                            </Tooltip>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="dkf">
                        <template v-if="row.zt == 'dkf'">
                           <Tooltip content="待开发">
                                <Icon type="md-flag" color="#808695" size="16"/>
                            </Tooltip>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="kfz">
                        <template v-if="row.zt == 'kfz'">
                           <Tooltip content="开发中">
                                <Icon type="md-flag" color="#808695" size="16"/>
                            </Tooltip>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="dcs">
                        <template v-if="row.zt == 'dcs'">
                           <Tooltip content="待测试">
                                <Icon type="md-flag" color="#808695" size="16"/>
                            </Tooltip>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="csz">
                        <template v-if="row.zt == 'csz'">
                           <Tooltip content="测试中">
                                <Icon type="md-flag" color="#808695" size="16"/>
                            </Tooltip>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="dfb">
                        <template v-if="row.zt == 'dfb'">
                           <Tooltip content="待发布">
                                <Icon type="md-flag" color="#808695" size="16"/>
                            </Tooltip>
                        </template>
                    </template>
                    <template slot-scope="{ row }" slot="yfb">
                        <template v-if="row.zt == 'yfb'">
                            <Icon type="md-checkmark" color="#19be6b" size="20"/>
                        </template>
                    </template>
                    <template slot-scope="{ row,index }" slot="action">
                        <Button type="primary" size="small" @click="edit(index)">修改</Button>
                        <Button type="error" size="small" @click="del(index)" style="margin-left: 5px;">删除</Button>
                    </template>
                </Table>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="add" style="margin-left: 10px;">保存</Button>
                <Button type="default" to="/tasklist/list" style="margin-left: 10px;">返回</Button>
            </FormItem>
        </Form>
        <Modal v-model="modal" title="新增/修改" width="1000">
            <Form :label-width="140">
                <FormItem label="序号">
                    <InputNumber v-model.trim="postData.index" type="number" :min="1"></InputNumber>
                </FormItem>
                <FormItem label="栏目">
                    <Input v-model.trim="postData.lmmc" clearable></Input>
                </FormItem>
                <FormItem label="页面说明">
                    <Input v-model.trim="postData.ymsm" clearable></Input>
                </FormItem>
                <FormItem label="客户端">
                    <RadioGroup v-model="postData.khd">
                        <Radio label="pc">PC</Radio>
                        <Radio label="wap">移动</Radio>
                        <!-- <Radio label="app">APP</Radio>
                        <Radio label="mp">小程序</Radio> -->
                    </RadioGroup>
                </FormItem>
                <FormItem label="状态">
                    <RadioGroup v-model="postData.zt">
                        <Radio :label="zt.key" :key="zt.key" v-for="zt in ztList">{{zt.value}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="预计设计时间">
                    <Input v-model.trim="postData.sjsj" clearable></Input>
                </FormItem>
                <FormItem label="预计开发时间">
                    <Input v-model.trim="postData.kfsj" clearable></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="modal=false">取消</Button>
                <Button type="primary" @click="onOk">确定</Button>
            </div>
        </Modal>
    </Card>
</template>
<script>
import { addTasklist, editTasklist, getTaskConfigList, getTaskDetail } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            modal: false,
            editIndex: -1,
            ztList: [],
            name: '',
            id: '',
            postData: {
                index: 1,
                lmmc: '',
                ymsm: '',
                khd: 'pc',
                zt: 'dsj',
                kfsj: '',
                kfsj: '',
            },
            columns: [
                {
                    key: 'index',
                    title: '序号',
                    width: 80,
                    align: 'center',
                },
                {
                    title: '栏目',
                    key: 'lmmc',
                },
                {
                    title: '页面/说明',
                    key: 'ymsm',
                },
                {
                    title: '客户端',
                    key: 'khd',
                    width: 80,
                },
                {
                    title: '待设计',
                    slot: 'dsj',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '预计设计时间',
                    key: 'sjsj',
                },
                {
                    title: '设计中',
                    slot: 'sjz',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '待开发',
                    slot: 'dkf',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '预计开发时间',
                    key: 'kfsj',
                },
                {
                    title: '开发中',
                    slot: 'kfz',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '待测试',
                    slot: 'dcs',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '测试中',
                    slot: 'csz',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '待发布',
                    slot: 'dfb',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '已发布',
                    slot: 'yfb',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 130,
                    align: 'center',
                },
            ],
            list: []
        };
    },
    computed: {},
    methods: {
        sortList() {
            this.list =  _.sortBy(this.list, ['index', 'khd'], ['asc', 'desc']);
        },
        spanMethod({ row, column, rowIndex }) {
            if (column.key == 'lmmc' || column.key == 'ymsm' || column.key == 'index') { // 前3列需要合并单元格
                if (rowIndex != (this.list.length-1) && row.lmmc == this.list[rowIndex+1].lmmc) { // 第一行
                    return { rowspan: 2, colspan: 1 }
                }
                if (rowIndex !== 0 && row.lmmc == this.list[rowIndex-1].lmmc) {
                    return { rowspan: 0, colspan: 0 }
                }
            }
        },
        del(index) {
            this.list.splice(index,1);
            this.sortList();
        },
        add() {
            if (this.name === '') {
                this.$Message.error('任务清单名称');
                return;
            }
            if (this.id === '') {
                addTasklist({
                    name: this.name,
                    list: JSON.stringify(this.list),
                }).then((res) => {
                    if (res.code === 1) {
                        this.$Message.success('任务清单已添加');
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            } else {
                editTasklist({
                    id: this.id,
                    name: this.name,
                    list: JSON.stringify(this.list),
                }).then((res) => {
                    if (res.code === 1) {
                        this.$Message.success('任务清单已更新');
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },
        init() {
            getTaskConfigList().then((res) => {
                this.ztList = res.data;
            });
            if (this.id !='') {
                getTaskDetail({ id: this.id }).then((res) => {
                    if (res.code === 1) {
                        this.name = res.data.name;
                        this.list = res.data.list;
                        this.id = res.data.id;
                        this.sortList();
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },
        onOk() {
            if (this.editIndex === -1) {
                this.list.push(this.postData);
            } else {
                this.$set(this.list[this.editIndex], 'index', this.postData.index);
                this.$set(this.list[this.editIndex], 'lmmc', this.postData.lmmc);
                this.$set(this.list[this.editIndex], 'ymsm', this.postData.ymsm);
                this.$set(this.list[this.editIndex], 'zt', this.postData.zt);
                this.$set(this.list[this.editIndex], 'kfsj', this.postData.kfsj);
                this.$set(this.list[this.editIndex], 'sjsj', this.postData.sjsj);
            }
            this.sortList();
            console.table(this.list);
            this.modal = false;
        },
        edit(index) {
            this.postData = {
                index: this.list[index].index,
                lmmc: this.list[index].lmmc,
                ymsm: this.list[index].ymsm,
                khd: this.list[index].khd,
                zt: this.list[index].zt,
                sjsj: this.list[index].sjsj,
                kfsj: this.list[index].kfsj,
            }
            this.editIndex = index;
            this.modal = true;
        },
        addLM() {
            this.editIndex = -1;
            this.postData = {
                index: 1,
                lmmc: '',
                ymsm: '',
                khd: 'pc',
                zt: 'dsj',
                kfsj: '',
                kfsj: '',
            };
            this.modal = true;
        }
    },
    mounted() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
        }
        this.init();
    },
};
</script>
