<style lang="less">
@import './index.less';
</style>
<template>
    <div>
        <Card dis-hover title="系统列表及负责人">
            <div class="clearfix" style="margin-bottom: 20px;">
                <Input clearable style="width: 200px" type="text" v-model="xtmc" placeholder="系统名称"></Input>
                <Select placeholder="负责人" filterable clearable style="width: 200px;margin-left: 10px" v-model="xm">
                    <Option :value="item.userName" v-for="item in userList">{{ item.nickName }}</Option>
                </Select>
                <Select placeholder="设计部门" clearable style="width: 200px;margin-left: 10px" v-model="sjbm">
                    <Option :value="item" v-for="item in sjbmList">{{ item }}</Option>
                </Select>
                <Button type="primary" style="margin-left: 10px" @click="search">查询</Button>
                <span class="btn-line"></span>
                <Button type="primary" @click="add">新增</Button>
            </div>
            <div style="overflow-x: auto;">
                <table class="xt-table" style="min-width: 1400px;">
                    <thead>
                        <tr>
                            <th width="160">所属平台</th>
                            <th>系统名称</th>
                            <th width="300">网址</th>
                            <th width="140">GA代码ID</th>
                            <th width="120">开发部门</th>
                            <th width="100">设计部门</th>
                            <th width="160">前端人员</th>
                            <th width="160">设计人员</th>
                            <th :width="type===1 ? 100 : 60">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(row, rowIndex) in data">
                            <tr v-for="(col, index) in row.list">
                                <td :rowspan="row.list.length" v-if="index === 0">{{ col.pt }}</td>
                                <td v-html="linght(col.xtmc)"></td>
                                <td>
                                    <div v-for="wz in col.wz.split('、')">
                                        <a :href="wz" target="_blank">{{ wz }}</a>
                                    </div>
                                </td>
                                <td>{{ col.ga }}</td>
                                <td>
                                    <Tag v-for="item in col.kfbm">{{ item }}</Tag>
                                </td>
                                <td>
                                    <Tag v-for="item in col.sjbm">{{ item }}</Tag>
                                </td>
                                <td>
                                    <Tag v-for="item in col.qd">{{ getName(item) }}</Tag>
                                </td>
                                <td>
                                    <Tag v-for="item in col.sj">{{ getName(item) }}</Tag>
                                </td>
                                <td>
                                    <span class="action-btn" @click="edit(rowIndex, index)">编辑</span>
                                    <span v-if="type===1" class="action-btn" @click="remove(col.id)">删除</span>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </Card>
        <Modal :title="markIndex === -1 ? '新增' : '修改'" v-model="modal" width="1000">
            <Form :label-width="100">
                <FormItem label="所属平台">
                    <Select filterable clearable style="width: 300px" v-model="addForm.pt">
                        <Option :value="item.id" :key="item.id" v-for="item in tags">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="系统名称：">
                    <Input v-model.trim="addForm.xtmc"></Input>
                </FormItem>
                <FormItem label="网址：">
                    <Input v-model.trim="addForm.wz" placeholder="多个网址用、分隔"></Input>
                </FormItem>
                <FormItem label="GA代码ID：">
                    <Input v-model.trim="addForm.ga"></Input>
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
            </Form>
            <div slot="footer">
                <Button type="text" @click="modal = false">取消</Button>
                <Button type="primary" @click="save">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getTagListFzxt, getAllUserData, addFzxt, editFzxt, delFzxt, listFzxt } from '@/api/index';
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
                ga: '',
                kfbm: [],
                sjbm: [],
                qd: [],
                sj: [],
            },
            data: [],
        };
    },
    created() {
        getTagListFzxt().then((res) => {
            this.tags = res.data;
            this.getUserList();
        });
    },
    methods: {
        search() {
            this.getlistFzxt();
        },
        linght(val){
            val = val + "";
            this.keyword.forEach(item => {
                if (val.indexOf(item) !== -1 && item !== "") {
                    val = val.replace(new RegExp(item,'g'),'<font color="#f75353">' + item + "</font>");
                }
            });
            return val;
        },
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
            this.addForm.ga = '';
            this.addForm.kfbm = [];
            this.addForm.sjbm = [];
            this.addForm.qd = [];
            this.addForm.sj = [];
            this.modal = true;
        },
        save() {
            if (this.addForm.xtmc=='') {
                this.$Message.error('系统名称不可为空');
                return;
            }
            if (this.addForm.id == '') {
                addFzxt(this.addForm).then((res) => {
                    this.modal = false;
                    this.getlistFzxt();
                });
            } else {
                editFzxt(this.addForm).then((res) => {
                    this.modal = false;
                    this.getlistFzxt();
                });
            }
        },
        getlistFzxt() {
            listFzxt({
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
            this.addForm.ga = this.data[rowIndex].list[index].ga;
            this.addForm.kfbm = this.data[rowIndex].list[index].kfbm;
            this.addForm.sjbm = this.data[rowIndex].list[index].sjbm;
            this.addForm.qd = this.data[rowIndex].list[index].qd;
            this.addForm.sj = this.data[rowIndex].list[index].sj;
            this.modal = true;
        },
        remove(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    delFzxt({
                        id: id,
                    }).then((res) => {
                        if (res.code === 1) {
                            this.$Message.success('删除成功');
                            this.getlistFzxt();
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
                    this.getlistFzxt();
                }
            });
        },
    },
    mounted() {
        this.type = JSON.parse(localStorage.getItem('userInfo')).type;
    },
};
</script>
