<style lang="less">
    @import './infor-card.less';
</style>

<template>
    <div class="infor-card-con" :class="iconType">
        <count-up
            class="infor-card-count user-created-count"
            :id-name="idName"
            :end-val="endVal"
            :color="color"
            :countSize="countSize"
            :countWeight="countWeight"
        >
            <p class="infor-intro-text" slot="intro">{{ introText }}</p>
        </count-up>
    </div>
</template>

<script>
import countUp from './countUp.vue';

export default {
    name: 'inforCard',
    components: {
        countUp
    },
    props: {
        idName: String,
        endVal: Number,
        color: String,
        iconType: String,
        introText: String,
        countSize: {
            type: String,
            default: '58px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        iconSize: {
            type: Number,
            default: 40
        }
    }
};
</script>

