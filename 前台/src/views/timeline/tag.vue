<style lang="less">
@import "./time-line.less";
</style>
<template>
    <Card dis-hover title="标签">
        <div style="margin-bottom: 10px;text-align: right;">
            <Button type="primary" @click="modal=true">添加</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <span class="action-btn" @click="updateTag(row,index)">编辑</span>
                <span class="action-btn" @click="deleteTag(row.id,index)">删除</span>
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
                width: 80,
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
        this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
                delTag({
                    id: id
                }).then(res=> {
                    if (res.code === 1) {
                        this.data.splice(index,1);
                        this.$Message.success('删除成功');
                    } else {
                        this.$Message.success(res.msg);
                    }
                })
            }
        });
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