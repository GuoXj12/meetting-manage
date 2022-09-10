<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="card-content">
                    <div class="card-left">
                        <el-icon>
                            <UserFilled/>
                        </el-icon>
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
                        <el-icon>
                            <Monitor/>
                        </el-icon>
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
                        <el-icon>
                            <document/>
                        </el-icon>
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
                        <el-icon>
                            <Notebook/>
                        </el-icon>
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
    import {reactive} from "vue";
    import * as echarts from "echarts";
    import {infoManager} from "@/api/info";

    export default {
        name: 'InfoPage',
        data() {
            return {
                userCount: 0,
                meetCount: 0,
                weeklyCount: 0,
                workCount: 0,
                totalList: [],
                totalType: [],
                userType1: 0,
                userType2: 0,
                meetingType1: 0,
                meetingType2: 0,
                meetingType3: 0,
                meetingType4: 0,
                meetingType5: 0,
                meetingType6: 0
            }
        },
        mounted() {
        },
        created() {
            this.getTotalData()
            this.getTypeData()
        },
        methods: {
            init() {
                let userType = reactive({
                    series: [
                        {
                            type: "pie",
                            data: [
                                {
                                    value: this.userType1,
                                    name: "管理员用户",
                                },
                                {
                                    value: this.userType2,
                                    name: "普通用户",
                                },
                            ],
                        },
                    ],
                });
                let meetingType = reactive({
                    series: [
                        {
                            type: "pie",
                            data: [
                                {
                                    value: this.meetingType1,
                                    name: "科务会",
                                },
                                {
                                    value: this.meetingType2,
                                    name: "专题会",
                                },
                                {
                                    value: this.meetingType3,
                                    name: "集体学习",
                                },
                                {
                                    value: this.meetingType4,
                                    name: "全体会议",
                                },
                                {
                                    value: this.meetingType5,
                                    name: "青年理论学习",
                                },
                                {
                                    value: this.meetingType6,
                                    name: "专项培训",
                                }
                            ],
                        },
                    ],
                });
                let userTypeSti = reactive({
                    xAxis: {
                        type: "category",
                        data: ["管理员", "普通用户"],
                    },
                    yAxis: {
                        type: "value",
                    },
                    series: [
                        {
                            data: [this.userType1, this.userType2],
                            type: "bar",
                            barWidth: "20%",
                        },
                    ],
                });
                let meetingTypeSti = reactive({
                    xAxis: {
                        type: "category",
                        data: ["科务会", "专题会", "集体学习", "全体会议", "青年理论学习", "专项培训"]
                    },
                    yAxis: {
                        type: "value",
                    },
                    series: [
                        {
                            data: [this.meetingType1, this.meetingType2, this.meetingType3, this.meetingType4, this.meetingType5, this.meetingType6],
                            type: "bar",
                            barWidth: "20%",
                        },
                    ],
                });
                let userTypeChart = echarts.init(document.getElementById("userType"));
                userTypeChart.setOption(userType);
                let meetingTypeChart = echarts.init(document.getElementById("meetingType"));
                meetingTypeChart.setOption(meetingType);
                let userTypeStiChart = echarts.init(document.getElementById("userTypeSti"));
                userTypeStiChart.setOption(userTypeSti);
                let meetingTypeStiChart = echarts.init(document.getElementById("meetingTypeSti"));
                meetingTypeStiChart.setOption(meetingTypeSti);
            },

            getTypeData() {
                this.totalList = []
                infoManager.getTypeData().then((res) => {
                    this.totalList = res
                    this.userType1 = this.totalList.userType1
                    this.userType2 = this.totalList.userType2
                    this.meetingType1 = this.totalList.meetingType1
                    this.meetingType2 = this.totalList.meetingType2
                    this.meetingType3 = this.totalList.meetingType3
                    this.meetingType4 = this.totalList.meetingType4
                    this.meetingType5 = this.totalList.meetingType5
                    this.meetingType6 = this.totalList.meetingType6
                    this.init()
                })
            },

            getTotalData() {
                this.totalType = []
                infoManager.getTotalData().then((res) => {
                    this.totalType = res
                    this.userCount = this.totalType.userCount
                    this.meetCount = this.totalType.meetCount
                    this.weeklyCount = this.totalType.weeklyCount
                    this.workCount = this.totalType.workCount
                })
            },
        }
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

