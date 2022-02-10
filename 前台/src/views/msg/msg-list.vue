<style lang="less">
    @import "./msg.less";
</style>
<template>
    <Card title="消息中心">
        <Tabs type="card" value="name1">
            <TabPane label="未读" name="name1">
                <Table border :columns="columns" :data="msgList">
                    <template slot-scope="{ row }" slot="action">
                        <a :href="'/summary/admindetails?id='+row.documentId+'&type='+row.type" @click="readMsg(row.id)">查看</a>
                    </template>
                </Table>
            </TabPane>
            <TabPane label="已读" name="name2">
                <Table border :columns="columns" :data="msgHistoryList">
                    <template slot-scope="{ row }" slot="action">
                        <a :href="'/summary/admindetails?id='+row.documentId+'&type='+row.type">查看</a>
                    </template>
                </Table>
            </TabPane>
        </Tabs>
    </Card>
</template>
<script>
import {
    replayList,
    replayUpdate
} from "@/api/index";
import moment from "moment";
export default {
    name: "msg",
    data() {
        return {
            columns: [
                {
                    title: '发送人',
                    key: 'fsr',
                    width: 120
                },
                {
                    title: '内容',
                    key: 'replayDes'
                },
                {
                    title: '发送时间',
                    key: 'replayTime',
                    width: 200,
                    align: 'center'
                },
                {
                    title: '操作',
                    width: 80,
                    align: 'center',
                    slot: 'action'
                }
            ],
            data: []
        }
    },
    computed: {
        msgList() {
            return this.$store.state.msg.wdxx;
        },
        msgHistoryList() {
            return this.$store.state.msg.ydxx;
        }
    },
    methods: {
        readMsg(id) {
            this.$store.dispatch('replayUpdateMsg',{id});
        }
    },
    mounted() {
        this.$store.dispatch('getMsgList');
    }
}
</script>