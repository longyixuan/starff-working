<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 500px;
        font-weight: 700;
        color: #fff;
        font-size: 32px;
    }
    .layout-nav{
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
    .layout-footer-center{
        text-align: center;
    }
    .ivu-tabs-tabpane {
        height: 430px;
        overflow: auto;
    }
</style>
<template>
    <Layout>
        <Header :style="{width: '100%'}">
            <div class="layout-logo">WEB前端工具箱</div>
        </Header>
        <Layout>
            <Sider hide-trigger :style="{background: '#fff'}">
                <Menu active-name="2" theme="light" width="auto" :open-names="['1']">
                    <MenuItem name="1" to="excel">Excel转JSON</MenuItem>
                    <MenuItem name="2">文本转JSON</MenuItem>
                    <MenuItem name="3" target="_blank" to="https://lanhuapp.com/">蓝湖</MenuItem>
                </Menu>
            </Sider>
            <Content :style="{margin: '20px 20px 0'}">
                <Card>
                    <Tabs value="name1">
                        <TabPane label="文本" name="name1">
                            <Input :rows="20" v-model="txtData" type="textarea" placeholder="粘贴数据" />
                        </TabPane>
                        <TabPane label="JSON显示" name="name2">
                            <Input :rows="20" :value="JSON.stringify(data)" type="textarea" placeholder="数据" />
                        </TabPane>
                        <TabPane label="表格显示" name="name3">
                            <Table border stripe :columns="columns" :data="data" v-if="columns.length>0"></Table>
                        </TabPane>
                    </Tabs>
                </Card>
                <div style="margin-top: 20px;margin-bottom: 20px;text-align: center;">
                    <Button type="warning" size="large" icon="md-copy" v-clipboard:copy="JSON.stringify(data)" v-clipboard:success="doCopy">复制JSON到剪贴板</Button>
                </div>
            </Content>
        </Layout>
    </Layout>
</template>
<script>
    export default {
        data() {
            return {
                columns: [],
                txtData: '',
                data: []
            }
        },
        methods: {
            doCopy(e) {
                this.$Message.success('复制成功');
            }
        },
        watch: {
            'txtData': function(newValue,oldValue) {
                if (newValue!='') { 
                    let dataArray = newValue.split('\n');
                    dataArray.forEach((item,index) => {
                        if (index==0) {
                            item.split('\t').forEach((item2) => {
                                this.columns.push({
                                    title: item2,
                                    key: item2
                                })
                            });
                        } else {
                            if (!item) {
                                return;
                            }
                            let dataRow = item.split('\t');
                            let tempData = {};
                            dataRow.forEach((item3,index3) => {
                                tempData[this.columns[index3].key] = item3;
                            });
                            this.data.push(tempData);
                        }
                    });
                } else {
                    this.columns = [];
                    this.data = [];
                }
            }
        }
    }
</script>
