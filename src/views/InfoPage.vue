<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ userCount }}</div>
            <div>用户总数</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ meetCount }}</div>
            <div>会议数量</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><document /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ weeklyCount }}</div>
            <div>周报数量</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><Notebook /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ workCount }}</div>
            <div>重点工作数量</div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <h3>用户类型</h3>
      <el-card class="cav-info" shadow="hover" :body-style="{ padding: '0px' }" id="userType"></el-card>
    </el-col>
    <el-col :span="12">
      <h3>会议类型</h3>
      <el-card class="cav-info" shadow="hover" :body-style="{ padding: '0px' }" id="meetingType"></el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <h3>用户统计</h3>
      <el-card class="cav-info" shadow="hover" :body-style="{ padding: '0px' }" id="userTypeSti"></el-card>
    </el-col>
    <el-col :span="12">
      <h3>会议统计</h3>
      <el-card class="cav-info" shadow="hover" :body-style="{ padding: '0px' }" id="meetingTypeSti"></el-card>
    </el-col>
  </el-row>
</template>

<script>
import { reactive } from "vue";
import * as echarts from "echarts";

const userType = reactive({
  series: [
    {
      type: "pie",
      data: [
        {
          value: 2,
          name: "管理员用户",
        },
        {
          value: 7,
          name: "普通用户",
        },
      ],
    },
  ],
});

const meetingType = reactive({
  series: [
    {
      type: "pie",
      data: [
        {
          value: 2,
          name: "科务会",
        },
        {
          value: 7,
          name: "专题会",
        },
        {
          value: 8,
          name: "集体学习",
        },
      ],
    },
  ],
});
const userTypeSti = reactive({
  xAxis: {
    type: "category",
    data: ["管理员", "普通用户"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [2, 7],
      type: "bar",
      barWidth: "20%",
    },
  ],
});
 const meetingTypeSti = reactive({
  xAxis: {
    type: "category",
    data: ["科务会", "专题会","集体学习"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [2, 7, 8],
      type: "bar",
      barWidth: "20%",
    },
  ],
});



export default {
  name: 'InfoPage',

  data() {
    return {
      userCount:9,
      meetCount:9,
      weeklyCount:9,
      workCount:0


    }
  },
  mounted() {
    const userTypeChart = echarts.init(document.getElementById("userType"));
    userTypeChart.setOption(userType);
    const meetingTypeChart = echarts.init(document.getElementById("meetingType"));
    meetingTypeChart.setOption(meetingType);
    const userTypeStiChart = echarts.init(document.getElementById("userTypeSti"));
    userTypeStiChart.setOption(userTypeSti);
    const meetingTypeStiChart = echarts.init(document.getElementById("meetingTypeSti"));
    meetingTypeStiChart.setOption(meetingTypeSti);
  },
  created() {
  },
  methods: {}
}
</script>



<style scoped>
.card-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100px;
  padding-left: 20%;
  text-align: center;
}
.card-left {
  display: flex;
  font-size: 3rem;
}
.card-right {
  flex: 1;
  font-size: 14px;
}
.card-num {
  font-size: 30px;
  font-weight: bold;
}
h3 {
  margin: 10px 0;
  text-align: center;
}
.cav-info {
  border-radius: 6px;
  overflow: hidden;
  height: 250px;
  background-color: white;
}
</style>

