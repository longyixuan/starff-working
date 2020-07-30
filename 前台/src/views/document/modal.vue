<style lang="less">
@import "./summary.less";
</style>
<template>
    <Card title="各系统模块管理">
        <Tabs value="canvas" :animated="false">
            <TabPane label="全部" name="canvas">
                <Table border :columns="columns1" :data="sysList">
                    <template slot-scope="{ row, index }" slot="modal">
                        <Tag color="blue" v-for="item in row.modal">{{item}}</Tag>
                    </template>
                </Table>
            </TabPane>
            <TabPane label="查询" name="table">
                <Alert show-icon type="warning">删除模块时请确认该模块未被使用。</Alert>
                <Form ref="formInline" inline>
                    <FormItem>
                        <Select placeholder="选择系统" v-model="systemId" clearable filterable @on-change="onChange">
                            <template v-for="item in sysList">
                                <Option :value="item.id" :key="item.id">{{item.title}}</Option>)
                            </template>
                        </Select>
                    </FormItem>
                </Form>
                <Table border :columns="columns" :data="modalList">
                    <template slot-scope="{ row, index }" slot="action">
                        <!-- <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index,row.sysId)">修改</Button> -->
                        <Button type="error" size="small" style="margin-right: 5px" @click="del(index,row.sysId)">删除</Button>
                    </template>
                </Table>
                <Modal v-model="modal" title="修改模块">
                    <Input v-model="value" placeholder="输入模块名称"/>
                    <template slot="footer">
                        <Button @click="modal=false">取消</Button>
                        <Button type="primary" @click="editModalName">修改模块</Button>
                    </template>
                </Modal>
            </TabPane>
        </Tabs>
        
    </Card>
</template>
<script>
import {
    addModal,
    getSystemList,
    getDocumentDetails
} from "@/api/index";
export default {
    data() {
        return{
            sysList: [],
            modal: false,
            systemId: '',
            value: '',
            modalList: [],
            columns1: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '系统名称',
                    key: 'title',
                    width: 300
                },
                {
                    title: '模块',
                    slot: 'modal'
                },
            ],
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '名称',
                    key: 'name',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 80,
                    align: 'center'
                }
            ]
        }
    },
    methods: {
        onChange(val) {
            this.modalList = [];
            let list =  _.find(this.sysList,['id',val]).modal;
            for(let i = 0; i < list.length; i++) {
                this.modalList.push({
                    sysId: val,
                    name: list[i]
                });
            }
        },
        addModal(postData) {
            addModal(postData).then(res => {
                if (res.code === 1) {
                    this.$Message.success('删除成功');
                    this.modal = false;
                }
            })
        },
        editModalName() {
            var modalList = [];
            for(let i = 0; i < this.modalList.length; i++) {
                modalList.push(this.modalList[i].name);
            }
            let postData = {
                systemId: this.id,
                modalList: Array.from(new Set(modalList))
            }
            this.addModal(postData);
        },
        init() {
            getSystemList().then(res => {
                this.sysList = res.data;
            })
        },
        edit(index,id) {
            this.value = this.modalList[index].name;
            this.id = id;
            this.modal = true;
        },
        confirm(tip,callback) {
            this.$Modal.confirm({
                title: "提示",
                content: tip,
                onOk: () => {
                    callback();
                }
            });
        },
        del(index,id) {
            this.confirm('请确认该模块未被使用，删除之后关联数据将被删除',() => {
                this.modalList.splice(index,1);
                let modalList = [];
                for(let i = 0; i < this.modalList.length; i++) {
                    modalList.push(this.modalList[i].name);
                }
                let postData = {
                    systemId: id,
                    modalList: Array.from(new Set(modalList))
                }
                this.addModal(postData)
            })
        }
    },
    mounted() {
        this.init();
        this.getData();
    }
}
</script>