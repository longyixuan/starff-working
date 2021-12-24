<template>

  <Card title="异常链接排查">
      <Form inline>
        <FormItem>
          <Input v-model="host" placeholder="输入主域名" style="width: 200px"></Input>
        </FormItem>
        <FormItem>
          <Input v-model="link" placeholder="输入查询网址" style="width: 400px"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="checkStart">开始检查</Button>
        </FormItem>
        <FormItem>
          <Button type="primary">下载</Button>
        </FormItem>
      </Form>
      <!-- <div style="position: relative;">
        <dv-scroll-board :config="config" style="height:500px"></dv-scroll-board>
        <Progress style="margin-bottom: 10px" :percent="percent" hide-info />
        <Table border :columns="columns" :data="data">
          <template slot-scope="{ row }" slot="href">
            <a :href="row.href" target="_blank">{{row.href}}</a>
          </template>
          <template slot-scope="{ row }" slot="result">
              <Icon size="30" color="#19be6b" v-if="row.result=='success'" type="md-checkmark-circle" />
              <Icon size="30" color="#ff9900" v-if="row.result=='error'" type="md-alert" />
              <Icon size="30" color="#2d8cf0" v-if="row.result==''" type="ios-more" />
          </template>
        </Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div> -->
  </Card>
  
</template>
<script>
  import { checkLink } from "@/api/index";
import config from '../../../../../ycms-远程面试/webapp-htgl/src/main/webapp/_ui/demo/src/utils/WebIMConfig';
  export default {
    data() {
      return {
        // 需要滚动的时间
        duration: 5000,
        // 初始值
        startVal: 0,
        // 最终值
        endVal: 0,
        host: 'https://www.cedf.org.cn',
        link: 'https://www.cedf.org.cn',
        spinShow: false,
        percent: 0,
        websocket: null,
        config: {
          rowNum: 10,
          index: true,
          waitTime: 600,
          indexHeader: '序号',
          columnWidth: [100],
          header: ['父页面', '当前页面', '结果','代码'],
          data:  [ [ "https://yz.chsi.com.cn", "https://www.chsi.com.cn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://my.chsi.com.cn/", "success", 412 ], [ "https://yz.chsi.com.cn", "https://www.chsi.com.cn/xlcx/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://www.chsi.com.cn/xlcx/bgcx.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://www.chsi.com.cn/xlrz/index2.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://my.chsi.com.cn/archive/index.jsp#txjd", "success", 412 ], [ "https://yz.chsi.com.cn", "https://gaokao.chsi.com.cn/", "success", 412 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://zf.chsi.com.cn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://www.gatzs.com.cn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://www.chsi.com.cn/cet/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://www.gfbzb.gov.cn/", "success", 412 ], [ "https://yz.chsi.com.cn", "https://www.ncss.cn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://xz.chsi.com.cn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://jp.chsi.com.cn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/user/?entrytype=yzgr", "success", 403 ], [ "https://yz.chsi.com.cn", "https://account.chsi.com.cn/account/preregister.action?from=yz-home", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/htgl/", "success", 403 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/wbwx.shtml", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zcdh/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/yxzc/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyinfo/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/zbft2021", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/glllk", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/sch/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/zyk/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/zxdy/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/z/yzzyss/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/zyqmjx/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/zsgs/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/tm/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/zsml/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/sswbgg/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzwb/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/apply/cjcx/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yztj/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/bsmlcx/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/bsbm/", "success", 403 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/tm/lqmd.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zcdh/201209/20120914/342662418.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zcdh/201408/20140811/1215967702.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/202012/20201209/2007002095.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/cxky2021", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zcdh/201609/20160914/1554119922.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/other/202009/20200921/1979676141.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/201108/20110818/227328408.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/201809/20180905/1718817601.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/201108/20110818/227329095.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/201108/20110818/227329363.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/200910/20091009/34480737.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/202010/20201014/1983647892.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/201809/20180905/1718844973.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zcdh/201401/20140102/706062525.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/202104/20210422/2060994497.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/yxzc/202104/20210425/2061761113.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/tjzd/202103/20210322/2041312158.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/kyfs2021", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/yxzc/202104/20210425/2062228237.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/kybk", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/zsxz", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/202104/20210422/2060987149.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/202103/20210312/2037434816.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/202103/20210319/1773474721.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://www.ncss.cn/tbch/jyzlbg2020/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/z/amgx/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/g/hlj.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/g/yjs.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/g/ln.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/g/hebei.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/g/anhui.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kyft/2021ft/202010/20201027/1987154197.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kyft/2021ft/202010/20201013/1983587767.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kyft/2021ft/202010/20201013/1983587761.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kyft/2021ft/202010/20201012/1983506717.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kyft/2021ft/202010/20201012/1983449718.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsxz/202103/20210303/2034024991.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsxz/202012/20201231/2016492152.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsxz/202012/20201223/2012607990.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsxz/202012/20201218/2011136280.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsxz/202012/20201210/2007993614.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202010/20201015/1984002940.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202010/20201013/1983610430.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202010/20201013/1983587759.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202010/20201013/1983592271.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202010/20201009/1982818825.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202009/20200923/1980476100.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202009/20200909/1974305497.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/tmjz/202009/20200908/1973837894.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/202104/20210426/2063335178.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/202104/20210415/2058888628.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kydt/202104/20210415/2058586293.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/yxzc/202104/20210425/2062176754.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/yxzc/202104/20210423/2061711747.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/yxzc/202104/20210423/2061711688.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/yxzc/202104/20210422/2060726763.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/202104/20210413/2057838439.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/202104/20210407/2055844536.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/202104/20210407/2055539499.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/202104/20210406/2054163806.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/202103/20210323/2042269982.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/yzcs2021", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/cc2021", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/zyxwfzfa", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/zsml/zyfx_search.jsp", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/help/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/jybzc/202009/20200904/1972918872.html#part04", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzwb/#xcqr", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzwb/#zkzxz", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/other/201809/20180905/1718869964.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/yzzt/tmzn/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/kp/201909/20190905/1819207712.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/tm/zyml/", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/202010/20201015/1984002939.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/202010/20201015/1983951090.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/202010/20201013/1983610431.html", "success", 200 ], [ "https://yz.chsi.com.cn", "https://yz.chsi.com.cn/kyzx/zsjz/202010/20201013/1983606737.html", "success", 200 ] ] 
        },
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 64,
            align: 'center'
          },
          {
            title: '标题',
            width: 300,
            key: 'text'
          },
          {
            title: '链接',
            key: 'href',
            slot: 'href'
          },
          {
            title: '结果',
            width: 80,
            key: 'result',
            align: 'center',
            slot: 'result'
          },
          {
            title: '状态码',
            width: 100,
            key: 'code'
          }
        ],
        data: []
      };
    },
    methods: {
      initWs() {
        var _this = this;
          if ('WebSocket' in window) {
            this.websocket = new WebSocket('ws://'+document.domain+':3333/ws');
             //连接发生错误的回调方法
            this.websocket.onerror = function() {
              console.log("WebSocket连接发生错误");
            };
            //连接成功建立的回调方法
            this.websocket.onopen = function() {
              console.log("WebSocket连接成功");
            }
            //接收到消息的回调方法
            this.websocket.onmessage = function(event) {
              var _data = JSON.parse(event.data);
              // console.log(_data)
              if (_data.href) {
                _this.$set(_this.config.data,_this.config.data.length,[_data.parentUrl,_data.href,_data.result,_data.code])
              }
            }
            //连接关闭的回调方法
            this.websocket.onclose = function() {
              console.log("WebSocket连接关闭");
            }
          }  else {
            console.log('当前浏览器 Not support websocket')
          }
      },
      checkStart() {
        if (this.host==''||this.link=='') {
          this.$Message.error('请输入网址和域名')
          return;
        }
        this.spinShow = true;
        this.initWs();
        checkLink({
          host: this.host,
          parentUrl: this.link,
          url: this.link,
          isList: 'list'
        }).then( res => {
          this.spinShow = false;
           if (res.code===1) {
             this.data = res.data;
             this.websocket.send(JSON.stringify({
               type: 'checkLink',
               link: this.link,
               host: this.host,
               msg: '检查死链接'
             }));
            //  this.requestLink(0);
           }
        })
      },
      requestLink(index) {
        checkLink({
          host: this.host,
          parentUrl: this.data[index].href,
          url: this.data[index].href, 
          isList: 'detail'
        }).then( res => {
          if (res.code===1) {
            this.$set(this.data[index],'result',res.data.result);
            this.$set(this.data[index],'code',res.data.code);
          }
          this.percent = Math.ceil(index/this.data.length*100);
          if (index<this.data.length-1) {
            this.requestLink(index+1);
          }
        });
      }
    },
    mounted() {
    }
  }
</script>