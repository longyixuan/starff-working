<style lang="less">
@import './tasklist.less';
</style>

<template>
    <Card title="任务清单管理 - 新增">
        <Form :label-width="80">
            <FormItem label="名称">
                <Input v-model="name" placeholder="请输入任务清单名称"></Input>
            </FormItem>
            <FormItem label="任务">
                <div class="rwqd-list" v-for="rw,index in content" :key="'rw-'+index">
                    <Input v-model="rw.lmmc" placeholder="请输入栏目名称" style="margin-bottom: 10px;"></Input>
                    <Input v-model="rw.ymsm" placeholder="请输入页面说明" style="margin-bottom: 10px;"></Input>
                    <CheckboxGroup v-model="rw.khd" style="margin-bottom: 10px;">
                        <Checkbox :label="khd" v-for="khd in khdList">{{khd}}</Checkbox>
                    </CheckboxGroup>
                    <RadioGroup v-model="rw.zt" style="margin-bottom: 10px;">
                        <Radio :label="item.key" :key="item.key" v-for="item in ztList">{{item.value}}</Radio>
                    </RadioGroup>
                    <Input v-model="rw.sjsm" placeholder="请输入预计设计时间" style="margin-bottom: 10px;"></Input>
                    <Input v-model="rw.kfsm" placeholder="请输入预计开发时间" style="margin-bottom: 10px;"></Input>
                    <Button type="error" @click="delContent(index)">删除</Button>
                </div>
                <Button type="dashed" @click="addContent">添加</Button>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="add">提交</Button>
            </FormItem>
        </Form>
    </Card>
</template>
<script>
import { addTasklist, getTaskConfigList } from '@/api/index';
export default {
    name: 'taskZt',
    data() {
        return {
            modal: false,
            ztList: [],
            name: '',
            id: '',
            khdList: ['PC', '移动'],
            content: [
                {
                    zt: '',
                    lmmc: '',
                    ymsm: '',
                    sjsm: '',
                    kfsm: '',
                    khd: []
                }
            ],
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '名称',
                    key: 'name',
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 140,
                    align: 'center'
                },
            ],
        };
    },
    methods: {
        add() {
            addTasklist({
                name: this.name,
                content: this.order
            }).then((res) => {
                if (res.code === 1) {
                    this.$Message.success('添加成功');
                } else {
                    this.$Message.error(res.msg);
                }
                this.init();
            });
        },
        addContent() {
            this.content.push({
                zt: '',
                lmmc: '',
                ymsm: '',
                sjsm: '',
                kfsm: '',
                khd: []
            });
        },
        delContent(index) {
            this.content.splice(index,1);
        },
        init() {
            getTaskConfigList().then((res) => {
                this.ztList = res.data;
            });
        },
    },
    mounted() {
        this.init();
    },
};
</script>