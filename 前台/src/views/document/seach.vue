<style lang="less" scoped>
@import "./summary.less";
</style>
<template>
    <Card>
        <Tabs value="tab2" @on-click="changeTab">
            <TabPane label="我的工作总结" name="tab1"></TabPane>
            <TabPane label="总结汇总查询" name="tab2"></TabPane>
        </Tabs>
        <div>
            <Form ref="formInline" inline>
                <FormItem>
                    <Input v-model="nf" style="width: 160px;">
                        <span slot="prepend">年份</span>
                    </Input>
                </FormItem>
                <FormItem>
                    <Input v-model="yf" style="width: 160px;">
                        <span slot="prepend">月份</span>
                    </Input>
                </FormItem>  
                <FormItem>
                    <Button type="primary">查询</Button>
                </FormItem>
            </Form>
        </div>
        <Divider size="small" style="margin: 0"/>
        <List>
            <ListItem>
                <a href="###">2019年11月月终工作总结</a><Tag color="warning" style="margin-left: 10px;">设计部</Tag>
                    <template slot="action">
                    <li>
                        <a href="">查看</a>
                    </li>
                    <li>
                        <a href="">编辑</a>
                    </li>
                    <li>
                        <a href="">下载</a>
                    </li>
                </template>
            </ListItem>
            <ListItem>
                <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选
                </Checkbox>
            </ListItem>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <ListItem>
                    <Checkbox label="尹晓龙">2019年11月月终工作总结（尹晓龙）</Checkbox>
                    <template slot="action">
                        <li>
                            <a href="">查看</a>
                        </li>
                        <li>
                            <a href="">置为补充状态</a>
                        </li>
                    </template>
                </ListItem>
                <ListItem>
                    <Checkbox label="王利英">2019年11月月终工作总结（王利英）</Checkbox>
                    <template slot="action">
                        <li>
                            <a href="">查看</a>
                        </li>
                        <li>
                            <a href="">置为补充状态</a>
                        </li>
                    </template>
                </ListItem>
                <ListItem>
                    <Checkbox label="马艳雄">2019年11月月终工作总结（马艳雄）</Checkbox>
                    <template slot="action">
                        <li>
                            <a href="">查看</a>
                        </li>
                         <li>
                            <a href="">置为补充状态</a>
                        </li>
                    </template>
                </ListItem>
                <ListItem>
                    <Checkbox label="崔永辉">2019年11月月终工作总结（崔永辉）</Checkbox>
                    <template slot="action">
                        <li>
                            <a href="">查看</a>
                        </li>
                        <li>
                            <a href="">置为补充状态</a>
                        </li>
                    </template>
                </ListItem>
                <ListItem>
                    <Checkbox label="贾晓东">2019年11月月终工作总结（贾晓东）</Checkbox>
                    <template slot="action">
                        <li>
                            <a href="">查看</a>
                        </li>
                        <li>
                            <a href="">置为补充状态</a>
                        </li>
                    </template>
                </ListItem>
            </CheckboxGroup>
            <div slot="footer">
                <Button type="success">自动合并生成设计部工作总结</Button>
            </div>
        </List>
    </Card>
</template>
<script>
export default {
        data () {
            return {
                nf: '2019',
                yf: '11',
                single: false,
                indeterminate: true,
                checkAll: false,
                checkAllGroup: []
            }
        },
        methods: {
            changeTab(name) {
                if (name=='tab1') {
                    this.$router.push({name: 'summary'})
                }
            },
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = ['尹晓龙', '王利英', '马艳雄','崔永辉','贾晓东'];
                } else {
                    this.checkAllGroup = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === 3) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            }
        }
    }
</script>