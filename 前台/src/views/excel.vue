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
    }
    .layout-nav{
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
    .layout-footer-center{
        text-align: center;
    }
    .ivu-card-body {
        height: 600px !important;
        overflow: 'auto' !important;
    }
</style>
<template>
    <Layout>
        <Header :style="{width: '100%'}">
            <div class="layout-logo">Excel转Json</div>
        </Header>
        <Content :style="{margin: '20px 20px 0'}">
            <Card>
                <Tabs value="name2">
                    <TabPane label="JSON显示" name="name2">
                        <Input :rows="20" :value="JSON.stringify(data)" type="textarea" placeholder="数据" />
                    </TabPane>
                    <TabPane label="表格显示" name="name1">
                        <Table border stripe :columns="columns" :data="data" v-if="columns.length>0"></Table>
                    </TabPane>
                </Tabs>
            </Card>
            <div style="margin-top: 20px;text-align: center;">
                <Upload action="/" :before-upload="handleUpload" style="display: inline-block;margin-right: 20px;">
                    <Button type="primary" size="large" icon="ios-cloud-upload-outline">上传excel文件</Button>
                </Upload>
                <Button type="warning" size="large" v-clipboard:copy="JSON.stringify(data)" v-clipboard:success="doCopy">复制Json到剪贴板</Button>
            </div>
        </Content>
    </Layout>
</template>
<script>
    import XLSX from 'xlsx';
    export default {
        data() {
            return {
                columns: [],
                data: []
            }
        },
        methods: {
            doCopy(e) {
                this.$Message.success(e.text);
            },
            handleUpload(file) {
                //拿到所导入文件的名字
                let fileName = file.name
                //定义reader，存放文件读取方法
                let reader = new FileReader();
                //启动函数
                reader.readAsBinaryString(file);
                reader.onload = (e) => {
                let uploadData = [];
                const workbook = XLSX.read(e.target.result, {type: 'binary'});
                let sheetList = workbook.SheetNames// 工作表名称集合
                sheetList.forEach((name) => {
                    let worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
                    uploadData.push(XLSX.utils.sheet_to_json(worksheet));
                });
                const keys = Object.keys(uploadData[0][0]);
                keys.forEach((item) => {
                    this.columns.push({
                    title: item,
                    key: item
                    })
                })
                this.data = uploadData[0];
                }
                return false;
            }
        }
    }
</script>
