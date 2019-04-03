<template>
    <div class="content-warp">
        <h2 class="info-title">系统列表管理</h2>
        <Divider />
        <div class="mar-b10 text-r">
            <Button type="primary" @click="add">新增</Button>
        </div>
        <Table :columns="columns1" :data="systemList">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
                <Button type="error" size="small" @click="remove(index)">删除</Button>
            </template>
        </Table>
        <Modal
            v-model="modal"
            title="新增/编辑系统"
            @on-ok="ok"
            @on-cancel="cancel">
            <Form :model="formItem" :label-width="80">
                <FormItem label="系统名称">
                    <Input v-model="formItem.name" placeholder="请输入系统名称"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<style lang="scss">
.mar-b10 {
    margin-bottom: 10px;
}
.text-r {
    text-align: right;
}
</style>

<script>
export default {
    data () {
        return {
            modal: false,
            formItem: {
                name: ''
            },
            systemList: [],
            columns1: [
                {
                    title: '系统名称',
                    key: 'name'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ]
        }
    },
    methods: {
        add () {
            this.formItem.name = ''
            this.modal = true
        },
        edit (index) {
            this.formItem.name = this.data[index].name
            this.modal = true
        },
        remove (index) {
            this.data.splice(index, 1)
        },
        ok () {
            this.$http.setSystem(this.formItem).then((res)=>{ //新增
                this.systemList.push(res.data)
                this.$Message.success('添加成功')
            }).catch();
        },
        cancel () {

        }
    },
    mounted () {
        this.$http.getSystemList().then((res)=>{
            this.systemList = res.data;
        }).catch();
    }
}
</script>
