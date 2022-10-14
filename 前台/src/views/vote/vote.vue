<style lang="less">
@import "./vote.less";
</style>
<template>
    <Card title="投票选项">
        <div style="margin-bottom: 10px;text-align: right;">
            <Button type="primary" @click="modal=true">添加</Button>
        </div>
        <Table border :data="data" :columns="columns">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="updateTag(row,index)">编辑</Button>
                <Button type="error" size="small" @click="deleteTag(row.id,index)">删除</Button>
            </template>
        </Table>
        <Modal title="设置选项" width="800" v-model="modal" @on-ok="add">
            <Form :label-width="80">
                <FormItem label="名称：">
                    <Input v-model="tag"></Input>
                </FormItem>
                <FormItem label="描述：">
                    <Input type="textarea" v-model="des" :rows="4"></Input>
                </FormItem>
            </Form>
        </Modal>
    </Card>
</template>
<script>
import {
    addVote,
    editVote,
    getVoteList,
    delVote
} from "@/api/index";
export default {
  name: "timeline",
  data() {
      return {
        modal: false,
        data: [],
        tag: '',
        des: '',
        id: '',
        columns: [
            {
                title: '选项名称',
                key: 'voteName',
                width: 200
            },
            {
                title: '选项描述',
                key: 'voteDes'
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
              editVote({
                id: this.id,
                voteName: this.tag,
                voteDes: this.des
            }).then(res=> {
                this.$Message.success('修改成功');
                this.init();
            })
          } else {
            addVote({
              id: this.id,
              voteName: this.tag,
              voteDes: this.des
            }).then(res=> {
                this.$Message.success('添加成功');
                this.init();
            })
          }
      },
      updateTag(row) {
          this.id = row.id;
          this.tag = row.voteName;
          this.des = row.voteDes;
          this.modal = true;
      },
      deleteTag(id,index) {
        this.$Modal.confirm({
            title: '提示',
            content: '确定要删除吗？',
            onOk: () => {
                delVote({
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
        getVoteList().then(res => {
            this.data = res.data;
        })
      }
  },
  mounted() {
      this.init();
  }
}
</script>