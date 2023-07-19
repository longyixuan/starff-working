<style lang="less">
@import './list.less';
</style>

<template>
    <div>
        <Card dis-hover title="aws发布时间线" style="min-height: 400px">
            <div style="margin-bottom: 20px" class="clearfix">
                <DatePicker v-model="year" style="width: 120px; margin-right: 10px" type="year" placeholder="请选择年份"></DatePicker>
                <Select clearable filterable style="width: 400px; margin-right: 10px" multiple v-model="system" placeholder="请选择系统">
                    <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                </Select>
                <Input v-model="keyword" style="width: 200px; margin-right: 10px" clearable placeholder="请输入关键字" autocomplete="off" />
                <Button type="primary" style="margin-right: 10px" @click="seach">查询</Button>
                <div style="float: right">
                    <Button type="primary" @click="modal = true;markIndex=-1">新增</Button>
                </div>
            </div>
            <Table border :columns="columns" :data="data" ref="table">
                <template slot-scope="{ row }" slot="detail">
                    <a :href="row.link" target="_blank" rel="noopener noreferrer">查看</a>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="update(row.id,index)">编辑</Button>
                    <Button type="error" size="small" @click="remove(row.id,index)">删除</Button>
                </template>
            </Table>
        </Card>
        <Modal :title="markIndex===-1?'新增':'修改'" v-model="modal" width="1000">
            <Form :label-width="100">
                <FormItem label="系统：">
                    <Select filterable clearable style="width: 300px" v-model="addForm.system">
                        <Option :value="item.id" :key="item.id" v-for="item in sysList">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="同步时间：">
                    <DatePicker v-model="addForm.time" type="date" placeholder="选择时间" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="aws链接：">
                    <Input v-model="addForm.link"></Input>
                </FormItem>
                <FormItem label="备注：">
                    <Input type="textarea" :rows="4" v-model="addForm.des"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="modal = false">取消</Button>
                <Button type="primary" :disabled="addForm.system=='' || addForm.time=='' || addForm.aws=='' || addForm.des==''" @click="save">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getSystemList, addAws, listAws, updateAws, deleteAws } from '@/api/index';
import moment from 'moment';
export default {
    name: 'aws',
    data() {
        return {
            modal: false,
            year: new Date(),
            system: [],
            sysList: [],
            keyword: '',
            data: [],
            time: '',
            jira: '',
            description: '',
            markIndex: -1,
            addForm: {
                id: '',
                system: '',
                time: '',
                link: '',
                des: ''
            },
            columns: [
                {
                    title: '时间',
                    key: 'time',
                    width: 120,
                    align: 'center',
                },
                {
                    title: '系统',
                    key: 'systemName',
                    width: 200,
                },
                {
                    title: '备注',
                    key: 'description',
                    render(h, params) {
                        return h(
                            'div',
                            {
                                class: 'pre-div',
                            },
                            params.row.des
                        );
                    },
                },
                {
                    title: '详情',
                    slot: 'detail',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '姓名',
                    key: 'userName',
                    width: 120,
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 140,
                    align: 'center',
                },
            ],
        };
    },
    methods: {
        init() {
            getSystemList().then((res) => {
                this.sysList = res.data;
            });
        },
        addAws(data) {
            addAws(data).then(res=>{
                if (res.code === 1) {
                    this.modal = false;
                    this.getList();
                    this.$Message.success('新增成功');
                }
            });
        },
        updateAws(data) {
            updateAws(data).then(res=>{
                if (res.code === 1) {
                    this.modal = false;
                    this.getList();
                    this.$Message.success('修改成功');
                }
            });
        },
        getList() {
            let params = {
                year: moment(this.year).format('YYYY'),
                userType: JSON.parse(localStorage.getItem('userInfo')).type,
                userName: JSON.parse(localStorage.getItem('userInfo')).nickName,
                system: this.system,
                keyword: this.keyword
            }
            listAws(params).then(res=> {
                if (res.code === 1) {
                    this.data = _.sortBy(res.data, function(item) {
                        return (new Date(item.time)).getTime();
                    }).reverse();
                }
            });
        },
        seach() {
            this.getList();
        },
        update(id, index) {
            this.markIndex = index;
            this.addForm.id = id;
            this.addForm.link = this.data[index].link;
            this.addForm.des = this.data[index].des;
            this.addForm.system = this.data[index].systemId;
            this.addForm.time = this.data[index].time;
            this.modal = true;
        },
        remove(id,index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除吗？',
                onOk: () => {
                    deleteAws({id: id}).then(res=>{
                        this.data.splice(index,1);
                        this.$Message.success('删除成功');
                    });
                }
            });
        },
        save() {
            var postData = {
                id: this.addForm.id,
                link: this.addForm.link,
                des: this.addForm.des,
                systemId: this.addForm.system,
                systemName: _.find(this.sysList,['id',this.addForm.system]).title,
                userName: JSON.parse(localStorage.getItem('userInfo')).nickName,
                time: moment(this.addForm.time).format('YYYY-MM-DD')
            }
            if (this.addForm.id == '') {
                this.addAws(postData);
            } else {
                this.updateAws(postData);
            }
        }
    },
    mounted() {
        this.init();
        this.getList();
    },
};
</script>
