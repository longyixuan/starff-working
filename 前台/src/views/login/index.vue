<template>
  <div class="login" id="particles-js">
      <div class="login-card">
        <div class="login-logo"></div>
        <Card icon="log-in" title="欢迎登录" :dis-hover="true">
            <Form>
                <FormItem>
                    <Input type="text" v-model="account" placeholder="请输入用户名">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Input type="password" v-model="password" placeholder="请输入密码">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem v-show="!isLogin">
                    <Input type="password" v-model="rePassword" placeholder="请再次输入密码">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleRegister">
                        {{isLogin ? '注 册' : '已有账号'}}
                    </Button>
                    <Button type="primary" @click="handleLogin">
                        {{isLogin ? '登 录' : '注册并登录'}}
                    </Button>
                </FormItem>
            </Form>
        </Card>
      </div>
  </div>
</template>
<style>
.login {
  position: relative;
  height: 100%;
  width: 100%;
  background: url(../../assets/bg.jpg) no-repeat center center;
}
.login-card {
  position: absolute;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,calc(-50% - 100px));
}
.login-logo {
  width: 500px;
  height: 200px;
  background: url(../../assets/logo.png) no-repeat center center;
}
</style>

<script>
import { mapMutations } from "vuex";
import "../../../static/particles.js";
export default {
  data() {
    return {
      account: '',
      password: '',
      rePassword: '',
      isLogin: true
    };
  },
  methods: {
    ...mapMutations(['SET_USER','SET_TOKEN']),
    login() {
      this.$http
        .login({
          account: this.account,
          password: this.password
        })
        .then(res => {
          this.SET_USER(res.data);
          this.SET_TOKEN(res.token);
          this.$router.push('/home');
        })
        .catch(err => {
          console.log(err)
          this.$Message.error("用户名或密码错误！");
        });
    },
    handleRegister() {
      this.isLogin = !this.isLogin;
    },
    handleLogin() {
      if (this.account == "" || this.password == "") {
        this.$Message.error("用户名或密码不能为空！");
        return;
      }

      if (this.isLogin) { // 登录
        this.login();
      } else { // 注册
        if (this.rePassword != this.password) {
          this.$Message.error("两次输入密码不一致！");
          return;
        }

        this.$http
          .register({
            account: this.account,
            password: this.password
          })
          .then(res => {
            this.SET_USER(res.data);
            this.$router.push('/home');
          })
          .catch(err => {
          });
      }
    }
  },
  mounted () {
    particlesJS.load('particles-js', '../../../static/particles.json', function() {
      console.log('callback - particles.js config loaded');
    });
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .logo {
    width: 300px;
    margin: 100px 0 20px;
  }

  .box {
    width: 280px;
    margin-bottom: 20px;
  }

  .btn-login {
    margin-left: 20px;
  }
}
</style>

