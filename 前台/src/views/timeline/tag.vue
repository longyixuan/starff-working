<style lang="less">
@import "./time-line.less";
</style>
<template>
    <Card title="标签">
        <div style="margin-bottom: 10px;text-align: right;">
            <Button type="primary" @click="modal=true">添加</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click=updateTag(row,index)>编辑</Button>
                <Button type="error" size="small" @click=deleteTag(row.id,index)>删除</Button>
            </template>
        </Table>
        <Modal title="编辑标签" v-model="modal" @on-ok="add">
            <Input placeholder="输入标签名称" v-model="tag"></Input>
        </Modal>
    </Card>
    
</template>
<script>
import {
    addTag,
    editTag,
    getTagList,
    delTag
} from "@/api/index";
export default {
  name: "timeline",
  data() {
      return {
        modal: false,
        data: [],
        tag: '',
        id: '',
        columns: [
            {
                title: '标签名称',
                key: 'name'
            },
            {
                title: '操作',
                slot: 'action',
                width: 140,
                align: 'center'
            }
        ]
      }
  },
  methods: {
      add() {
          if (this.id) {
              editTag({
                id: this.id,
                name: this.tag
            }).then(res=> {
                this.$Message.success('修改成功');
                this.init();
            })
          } else {
            addTag({
              id: this.id,
              name: this.tag
            }).then(res=> {
                this.$Message.success('添加成功');
                this.init();
            })
          }
      },
      updateTag(row) {
          this.id = row.id;
          this.tag = row.name;
          this.modal = true;
      },
      deleteTag(id,index) {
        delTag({
            id: id
        }).then(res=> {
            this.data.splice(index,1);
            this.$Message.success('删除成功');
        })
      },
      init() {
        getTagList().then(res => {
            this.data = res.data;
        })
      }
  },
  mounted() {
      this.init();
  }
}
</script>