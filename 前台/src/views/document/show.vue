<style lang="less">
@import "./summary.less";
</style>
<template>
    <div class="">
        <Card title="工作总结">
            <h2 class="summary-title">{{contentHtml.documentName}}</h2>
            <div class="summary-html" v-html="contentHtml.contentHtml"></div>
        </Card>
    </div>
</template>
<script>
import {
    getDocumentDetails
} from "@/api/index";
export default {
    data() {
        return{
            contentHtml: ''
        }
    },
    methods: {
        init() {
            const id = this.$route.params.id;
            getDocumentDetails(id).then(res => {
                this.contentHtml = res.data
            })
        }
    },
    mounted() {
        this.init();
    }
}
</script>