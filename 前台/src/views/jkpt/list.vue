<style lang="less">
@import './index.less';
</style>
<template>
    <div>
        <Card dis-hover title="监控平台列表及负责人">
            <div class="clearfix" style="margin-bottom: 20px;">
                <Button type="primary" @click="add">新增</Button>
            </div>
            <Tabs v-model="tabName" v-if="data.length>0" :animated="false" type="card">
                <a href="http://172.16.2.131:3000/" slot="extra" target="_blank" rel="noopener noreferrer">监控平台管理</a>
                <TabPane :label="tab.pt" :name="tab.pt" v-for="tab,tabIndex in data" :key="tab.pt">
                    <Table border :columns="columns" :data="data[tabIndex].list">
                        <template slot-scope="{ row }" slot="wz">
                            <a :href="row.wz" target="_blank" rel="noopener noreferrer">{{row.wz}}</a>
                        </template>
                        <template slot-scope="{ row }" slot="kfbm">
                            <Tag v-for="item in row.kfbm">{{ item }}</Tag>
                        </template>
                        <template slot-scope="{ row }" slot="sjbm">
                            <Tag v-for="item in row.sjbm">{{ item }}</Tag>
                        </template>
                        <template slot-scope="{ row }" slot="qdsj">
                            <Tag v-for="item in row.qd" class="qd">{{ getName(item) }}</Tag>
                            <Tag v-for="item in row.sj" class="sj">{{ getName(item) }}</Tag>
                        </template>
                        <template slot-scope="{ row }" slot="bz">
                            <div v-html="row.bz" style="white-space: pre-line;"></div>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <span class="action-btn" @click="edit(tabIndex, index)">编辑</span>
                            <span v-if="type===1" class="action-btn" @click="remove(row.id)">删除</span>
                        </template>
                    </Table>
                </TabPane>
            </Tabs>
        </Card>
        <Modal :title="markIndex === -1 ? '新增' : '修改'" v-model="modal" width="1000">
            <Form :label-width="100">
                <FormItem label="所属楼层">
                    <RadioGroup v-model="addForm.pt">
                        <Radio :label="item.id" :key="item.id" v-for="item in tags">{{ item.name }}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="屏幕名称：">
                    <Input v-model.trim="addForm.xtmc"></Input>
                </FormItem>
                <FormItem label="网址：">
                    <Input v-model.trim="addForm.wz"></Input>
                </FormItem>
                <FormItem label="展示顺序：">
                    <Input v-model.trim="addForm.order"></Input>
                </FormItem>
                <FormItem label="开发部门：">
                    <Checkbox-Group v-model="addForm.kfbm">
                        <Checkbox :label="item" v-for="(item, index) in kfbmList" :key="'kfbm-' + index">{{ item }}</Checkbox>
                    </Checkbox-Group>
                </FormItem>
                <FormItem label="设计部门：">
                    <Checkbox-Group v-model="addForm.sjbm">
                        <Checkbox :label="item" v-for="(item, index) in sjbmList" :key="'sjbm-' + index">{{ item }}</Checkbox>
                    </Checkbox-Group>
                </FormItem>
                <FormItem label="前端人员：">
                    <Checkbox-Group v-model="addForm.qd">
                        <Checkbox :label="item.userName" v-for="item in qdList" :key="item.userName">{{ item.nickName }}</Checkbox>
                    </Checkbox-Group>
                </FormItem>
                <FormItem label="设计人员：">
                    <Checkbox-Group v-model="addForm.sj">
                        <Checkbox :label="item.userName" v-for="item in sjList" :key="item.userName">{{ item.nickName }}</Checkbox>
                    </Checkbox-Group>
                </FormItem>
                <FormItem label="备注：">
                    <Input v-model.trim="addForm.bz" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="modal = false">取消</Button>
                <Button type="primary" @click="save">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getTagListJkpt, getAllUserData, addJkpt, editJkpt, delJkpt, listJkpt } from '@/api/index';
export default {
    name: 'timeline',
    data() {
        return {
            type: 0,
            modal: false,
            markIndex: -1,
            tags: [],
            sjList: [], //设计
            qdList: [], //前端
            userList: [],
            keyword: ['已关停'],
            xtmc: '',
            xm: '',
            sjbm: '',
            kfbmList: ['综合部', '招生信息部', '就业信息部', '学籍学历部', '设计部', '系统运维部', '易志科'],
            sjbmList: ['设计一部', '设计二部'],
            addForm: {
                id: '',
                pt: '',
                xtmc: '',
                wz: '',
                bz: '',
                kfbm: [],
                sjbm: [],
                qd: [],
                sj: [],
                order: 0
            },
            tabName: '',
            columns: [
                {
                    title: '展示顺序',
                    width: 80,
                    key: 'order',
                    align: 'center'
                },
                {
                    title: '屏幕名称',
                    key: 'xtmc',
                    width: 140
                },
                {
                    title: '网址',
                    slot: 'wz',
                    width: 216
                },
                {
                    title: '开发部门',
                    slot: 'kfbm',
                    width: 100
                },
                {
                    title: '设计部门',
                    slot: 'sjbm',
                    width: 100
                },
                {
                    title: '前端及设计',
                    slot: 'qdsj',
                    width: 140
                },
                {
                    title: '备注',
                    slot: 'bz'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 90
                }
            ],
            data: [],
        };
    },
    created() {
        getTagListJkpt().then((res) => {
            this.tags = res.data;
            this.getUserList();
        });
    },
    methods: {
        getName(userName) {
            let name = '';
            if (userName != '') {
                name = _.find(this.userList, ['userName', userName]).nickName;
            }
            return name;
        },
        add() {
            this.markIndex = -1;
            this.addForm.id = '';
            this.addForm.pt = '';
            this.addForm.xtmc = '';
            this.addForm.wz = '';
            this.addForm.bz = '';
            this.addForm.kfbm = [];
            this.addForm.sjbm = [];
            this.addForm.qd = [];
            this.addForm.sj = [];
            this.addForm.order = 0;
            this.modal = true;
        },
        save() {
            if (this.addForm.xtmc=='') {
                this.$Message.error('屏幕名称不可为空');
                return;
            }
            if (this.addForm.id == '') {
                addJkpt(this.addForm).then((res) => {
                    this.modal = false;
                    this.getlistJkpt();
                });
            } else {
                editJkpt(this.addForm).then((res) => {
                    this.modal = false;
                    this.getlistJkpt();
                });
            }
        },
        getlistJkpt() {
            listJkpt({
                xtmc: this.xtmc,
                xm: this.xm,
                sjbm: this.sjbm
            }).then((res) => {
                this.data = res.data;
            });
        },
        edit(rowIndex, index) {
            this.markIndex = index;
            this.addForm.id = this.data[rowIndex].list[index].id;
            this.addForm.pt = this.data[rowIndex].list[index].ptId;
            this.addForm.xtmc = this.data[rowIndex].list[index].xtmc;
            this.addForm.wz = this.data[rowIndex].list[index].wz;
            this.addForm.bz = this.data[rowIndex].list[index].bz;
            this.addForm.kfbm = this.data[rowIndex].list[index].kfbm;
            this.addForm.sjbm = this.data[rowIndex].list[index].sjbm;
            this.addForm.qd = this.data[rowIndex].list[index].qd;
            this.addForm.sj = this.data[rowIndex].list[index].sj;
            this.addForm.order = this.data[rowIndex].list[index].order;
            this.modal = true;
        },
        remove(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delJkpt({
                        id: id,
                    }).then((res) => {
                        if (res.code === 1) {
                            this.$Message.success('删除成功');
                            this.getlistJkpt();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                },
            });
        },
        getUserList() {
            getAllUserData().then((res) => {
                if (res.code === 1) {
                    this.userList = _.filter(res.data, function (o) {
                        return o.type ===0;
                    });
                    this.sjList = _.filter(res.data, function (o) {
                        return o.defaultRole == 'sj'
                    });
                    this.qdList = _.filter(res.data, function (o) {
                        return o.defaultRole == 'qd'
                    });
                    this.getlistJkpt();
                }
            });
        },
    },
    mounted() {
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
    },
};
</script>
