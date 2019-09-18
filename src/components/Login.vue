<template>
  <div class="content">
    <!-- 登陆页面 -->
    <div class="login" v-if="!loginflag">
      <div class="title">
        <div style="margin: 0 auto;">饭卡消费记录查询</div>
      </div>
      <div class="loginbox">
        <van-field v-model="username" clearable label="用户名" placeholder="学号" />
        <van-field v-model="password" clearable type="password" label="密码" placeholder="身份证后六位" />
      </div>
      <div class="loginbtn">
        <van-button round type="info" size="large" @click="toList">登陆</van-button>
      </div>
      <div class="Copyright">©易班工作站技术中心</div>
    </div>
    <!-- /登陆页面 -->

    <!-- 登陆成功的页面 -->
    <div v-else>
      <van-tabs color="#409EFF" v-model="active">
        <van-tab title="今日消费">
          <van-cell-group>
            <van-cell
              v-for="(info,ind) of todayCost"
              :key="ind"
              :title="info.station"
              :value="info.use_money"
              :label="info.time"
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="历史消费">
          <van-field
            readonly
            clickable
            label="日期"
            :value="currentDate"
            placeholder="选择日期"
            @click="show = true"
          />
          <van-cell-group>
            <van-cell
              v-for="(info,ind) of historyCost"
              :key="ind"
              :title="info.station"
              :value="info.use_money"
              :label="info.time"
            />
          </van-cell-group>
          <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
            <van-picker
              :columns="columns"
              show-toolbar
              @cancel="show = false"
              @confirm="onConfirm"
            />
          </van-popup>
        </van-tab>
        <van-tab title="我的">
          <van-cell-group>
            <van-cell title="姓名" :value="userInfo['name:']" />
            <van-cell title="学号" :value="userInfo.id" />
            <van-cell title="卡号" :value="userInfo.card_id" />
            <van-cell title="余额" :value="userInfo.money" />
          </van-cell-group>
          <div style="width:80%;margin: 0 auto">
            <van-button round type="info" size="large" @click="quit">退出登陆</van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- /登陆成功的页面 -->

    <!-- 版权 -->
    <div v-if="loginflag" class="Copyright">©易班工作站技术中心</div>
  </div>
</template>

<script>
import * as api from "../utils/api";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loginflag: false, //登陆标志
      show: false, //选择时间弹框
      currentDate: "", //当前日期
      dateInfo: [], //当前日期的数组
      columns: [
        {
          values: "",
          className: "column1"
        },
        {
          values: "",
          className: "column2"
        }
      ], //可选年月
      active: -1, //当前选择的标签页
      todayCost: [], //今日消费列表
      historyCost: [], //历史消费列表
      userInfo: {} //用户信息
    };
  },
  mounted() {
    this.username = localStorage.getItem("username");
    this.password = localStorage.getItem("password");
    if (this.username && this.password) {
      this.toList();
    }
  },
  methods: {
    toList() {
      console.log("login" + this.username + ":" + this.password);
      api.userLogin(this.username, this.password).then(res => {
        console.log(res, 31);
        if (res.info == 1) {
          //登陆成功
          this.$toast("登陆成功！请等待跳转");
          setTimeout(() => {
            this.loginflag = true;
            this.active = 0;
            this.getSelectRange();
          }, 10);
          localStorage.setItem("username", this.username);
          localStorage.setItem("password", this.password);
        } else {
          this.$toast("账号或密码错误！");
        }
      });
    },
    getSelectRange() {
      api.getYear(this.username).then(res => {
        if (res == null || res == undefined) {
          this.loginflag = false;
          this.$toast("登陆失效，请重新登陆！");
        }
        this.columns[0].values = res.year;
        this.columns[1].values = res.months;
      });
    },
    //确认选择
    onConfirm(value) {
      this.currentDate = value[0] + "年" + value[1] + "月";
      this.dateInfo = value;
      this.show = false;
      this.historyCost = [];
      this.getConsume("history");
    },
    //获取消费记录
    getConsume(time) {
      if (time == "today") {
        if (this.todayCost.length > 0) {
          return;
        }
        api.getToday(this.username).then(res => {
          if (res == null || res == undefined) {
            this.quit();
            this.$toast("登陆失效，请重新登陆！");
          }
          console.log(res, 95);
          this.todayCost = res.reverse();
        });
      } else {
        if (this.historyCost.length > 0) {
          return;
        }
        api
          .getHistory(this.username, this.dateInfo[0], this.dateInfo[1])
          .then(res => {
            if (res == null || res == undefined) {
              this.quit();
              this.$toast("登陆失效，请重新登陆！");
            }
            this.historyCost = res.reverse();
          });
      }
    },
    //获取我的信息
    getMine() {
      console.log("getMine");
      if (this.userInfo.id != null && this.userInfo.id != undefined) {
        return;
      }
      api.getMine(this.username).then(res => {
        if (res == null || res == undefined) {
          this.quit();
          this.$toast("登陆失效，请重新登陆！");
        }
        this.userInfo = res;
      });
    },
    //退出登陆
    quit() {
      this.userInfo = {};
      this.todayCost = [];
      this.historyCost = [];
      this.loginflag = false;
    }
  },
  watch: {
    active(value) {
      console.log(value, 102);
      if (value == 0) {
        this.getConsume("today");
      }
      if (value == 1) {
        if (this.currentDate != "") {
          this.getConsume("history");
        }
      }
      if (value == 2) {
        this.getMine();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login,
.content {
  width: 100%;
  height: 100%;
  overflow: scroll;
  /* display:flex;
  justify-items: center;
  align-items: center; */
}
.login .loginbox {
  width: 100%;
}
.login .title {
  width: 100%;
  text-align: center;
  height: 30%;
  font-size: 20px;
  display: flex;
  justify-items: center;
  align-items: center;
}
.login .loginbtn {
  width: 80%;
  margin: 0 auto;
  margin-top: 20px;
}
.Copyright {
  width: 200px;
  line-height: 50px;
  margin: 0 auto;
  text-align: center;
  color: gray;
}
</style>
