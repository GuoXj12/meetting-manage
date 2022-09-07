<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-row :gutter="10">
          <el-col :span="2">
            <el-select v-model="query.weeklyYear"  clearable placeholder="年份">
              <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="2">
            <el-select v-model="query.weeklyDate"  clearable placeholder="周报日期">
              <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-button type="primary"  @click="getData">查询</el-button>
          <el-button type="primary" @click="setModelVisible = true">生成最新周报模板</el-button>
        </el-row>
      </div>
      <el-table :data="data" border style="width: 100%" ref="multipleTable" height="500px">
        <el-table-column label="序号" type="index"   width="300" align="center" :index='indexMethod'> </el-table-column>
        <el-table-column label="周报日期" prop="model_date" min-width="240" align="center"></el-table-column>
        <el-table-column label="创建日期" prop="create_time" :formatter="formatDate" width="300" align="center"></el-table-column>
        <el-table-column label="操作" width="500" align="center">
            <template v-slot="scope">
              <el-button type="info" :disabled = "false" @click="handleSetDetail(scope.row)">填写周报</el-button>
              <el-button @click="handleDetail(scope.row)">查看明细</el-button>
              <el-button type="danger" :disabled = "true" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="tableData.length">
        </el-pagination>
      </div>
    </div>

    <!--添加最新周报模板-->
    <el-dialog title="最新周报模板" v-model="setModelVisible" width="650px" center>
      <div class="test-box">
        <span>周报日期：</span>
        <el-date-picker
            :clearable="false"
            :disabled = "true"
            v-model="queryParam.value"
            :format="'YYYY-MM 第' + queryParam.week + '周'"
            @change="weekChange"
            value-format="YYYY-M-D"
            class="inp"
            size="medium"
            type="week"
            placeholder="请选择"
            :picker-options="{'firstDayOfWeek': 1}"
        ></el-date-picker>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="addWeeklyModel">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 周报明细查看 -->
    <el-dialog title="周报详细信息" v-model="editVisible" width="850px">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="本周工作总结" name="first">
          <el-tabs v-model="activeName1" @tab-click="handleClick1">
          <el-tab-pane label="参会情况" name="first1">
            <el-descriptions title="专题会" :column="1" :size="size">
              <el-descriptions-item  v-for="item in meetingTopic" :key="item.label" :value="item.value" >
                  {{item.meeting_detail}}
              </el-descriptions-item>
            </el-descriptions>
            <br/>
            <el-descriptions  title="科务会" :column="1" :size="size">
              <el-descriptions-item  v-for="item in meetingAffairs" :key="item.label" :value="item.value" >
                {{item.meeting_detail}}
              </el-descriptions-item>

            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="科室日常工作" name="second1">
            <el-descriptions title="科室日常工作" :column="1" :size="20">
              <el-descriptions-item  v-for="item in normalWork" :key="item.label" :value="item.value" >
                  {{item.normal_work}}
              </el-descriptions-item>
            </el-descriptions>

          </el-tab-pane>
          <el-tab-pane label="绿通业务" name="third1">
            <el-descriptions title="绿通业务" :column="1" :size="20">
              <el-descriptions-item  v-for="item in lvtong" :key="item.label" :value="item.value" >
                {{item.lvtong_work}}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="其他重点工作" name="fourth1">
            <el-descriptions title="其他重点工作" :column="1" :size="20">
              <el-descriptions-item  v-for="item in other" :key="item.label" :value="item.value" >
                {{item.other_work}}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="下周工作计划" name="second">
          <el-descriptions title="下周工作计划" :column="1" :size="20">
            <el-descriptions-item  v-for="item in next" :key="item.label" :value="item.value" >
              {{item.research}}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="需研究事项" name="third">
          <el-descriptions title="需研究事项" :column="1" :size="20">
            <el-descriptions-item>
              {{research === null || research === ''?"无数据":research.normal_work}}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editVisible = false">确 定</el-button>
          <el-button @click="deriveword(tableDetail)" type="success">导出周报</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 周报填写页面 -->
    <el-dialog title=" 周报填写" v-model="setVisible" width="850px">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="本周工作总结" name="first">
          <el-tabs v-model="activeName1" @tab-click="handleClick1">
            <el-tab-pane label="参会情况" name="first1">
              <el-descriptions title="专题会" :column="1" :size="size">
                <el-descriptions-item>
                  <el-button type="primary" @click="saveMeetingTopic">保 存</el-button>
                  <el-button type="primary" plain @click="addEl">添加</el-button>
                  <el-row>
                    <el-col :span="24" v-for="(list,index) in meetingTopic" :key="list">
                      <el-row :gutter="20" class="margins">
                        <el-col :span="18">
                          <el-input  type="textarea" autosize v-model="list.meeting_detail"></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-button type="danger" @click="del(index)">删除信息</el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-descriptions-item>
              </el-descriptions>
              <br/>
              <el-descriptions  title="科务会" :column="1" :size="size">
                <el-descriptions-item >
                  <el-button type="primary" plain @click="addEl1">添加</el-button>
                  <el-row>
                    <el-col :span="24" v-for="(list,index) in meetingAffairs" :key="list">
                      <el-row :gutter="20" class="margins">
                        <el-col :span="18">
                          <el-input  type="textarea" autosize v-model="list.meeting_detail"></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-button type="danger" @click="del1(index)">删除信息</el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-descriptions-item>

              </el-descriptions>
            </el-tab-pane>
            <el-tab-pane label="科室日常工作" name="second1">
              <el-descriptions title="科室日常工作" :column="1" :size="20">
                <el-descriptions-item  v-for="item in normalWork" :key="item.label" :value="item.value" >
                  <el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 5}"  v-model="item.normal_work"></el-input>
                </el-descriptions-item>
              </el-descriptions>

            </el-tab-pane>
            <el-tab-pane label="绿通业务" name="third1">
              <el-descriptions title="绿通业务" :column="1" :size="20">
                <el-descriptions-item  v-for="item in lvtong" :key="item.label" :value="item.value" >
                  <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 4}" v-model="item.lvtong_work"></el-input>
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
            <el-tab-pane label="其他重点工作" name="fourth1">
              <el-descriptions title="其他重点工作" :column="1" :size="20">
                <el-descriptions-item>
                  <el-button type="primary" plain @click="addEl2">添加</el-button>
                  <el-row>
                    <el-col :span="24" v-for="(list,index) in other" :key="list">
                      <el-row :gutter="20" class="margins">
                        <el-col :span="18">
                          <el-input  type="textarea" autosize v-model="list.other_work"></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-button type="danger" @click="del2(index)">删除信息</el-button>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="下周工作计划" name="second">
          <el-descriptions title="下周工作计划" :column="1" :size="20">
            <el-descriptions-item>
                <el-button type="primary" plain @click="addEl3">添加</el-button>
                <el-row>
                  <el-col :span="24" v-for="(list,index) in next" :key="list">
                    <el-row :gutter="20" class="margins">
                      <el-col :span="18">
                        <el-input  type="textarea" autosize v-model="list.research"></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-button type="danger" @click="del3(index)">删除信息</el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="需研究事项" name="third">
          <el-descriptions title="需研究事项" :column="1" :size="20">
            <el-descriptions-item>
              <el-input type="textarea" autosize v-model="research.normal_work"></el-input>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setVisible = false">取 消</el-button>
          <el-button type="primary" @click="setVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 删除提示框 -->
    <yin-del-dialog :delVisible="delVisible" @deleteRow="deleteRow" @cancelRow="delVisible = $event"></yin-del-dialog>
  </div>
</template>

<script>
import { mixin } from '../mixins'
import { RULES } from '../enums'
import YinDelDialog from '@/components/dialog/YinDelDialog'
import {MeetingManager} from "@/api/metting";
import {WeeklyManager} from "@/api/weekly";
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'


export default {
  name: 'WeeklyPage',
  mixins: [mixin],
  components: {
    YinDelDialog
  },
  data () {
    return {
      tables: [],
      queryParam: {
        value: '',
        week: ''
      },
      insertDate:'',
      query:{
        weeklyYear: '',
        weeklyDate: ''
      },
      activeName: 'first',
      activeName1: 'first1',
      tableDetail:'',
      meetingTopic:[],
      meetingAffairs:[],
      normalWork:[],
      lvtong:[],
      other:[],
      next:[],
      research:{
        normal_work:''
      },
      initNormal: [{
        normal_work: '（1）省内通行费拆账和跨省结算工作顺利进行，XX月XX日至XX月XX日省内日拆账平均XX亿，截止到XX月XX日省内通行费拆账金额本年累计XX亿元，同比去年增加XX%；XX月XX日至XX月XX日跨省日轧差平均XX亿元，截止到XX月XX日，跨省资金轧差本年累计轧差XX亿。\n',
        },{
        normal_work: '（2）清分争议处理共计XX余条。\n',
      },{
        normal_work: '（3）退费业务处理XX多条。\n',
      }],
      initlvtong:  [{
        lvtong_work: '（1）XX月XX日至XX月XX日，查验合格量XX车次，查验合格率为XX%；预约量XX车次，日平均预约率为XX，绿通车免本省通行费XX万元。\n',
      },{
        lvtong_work: '（2）我省绿通应急查验补录数据XX条，已处理XX条\n',
      }],
      setVisible:false,
      options1: [{
        value: '2022',
        label: '2022'
      }, {
        value: '2023',
        label: '2023'
      }, {
        value: '2024',
        label: '2024'
      }],
      options2: [{
        value: '1',
        label: '2022-03 第1周'
      }, {
        value: '2',
        label: '2022-03 第2周'
      },{
        value: '3',
        label: '2022-03 第3周'
      },{
        value: '4',
        label: '2022-03 第4周'
      }],
      form:"",
      rules: RULES,
      tableData: [], // 记录会议信息，用于显示
      tableDataDetail:'',
      tempDate: [], // 记录用户信息，用于搜索时能临时记录一份用户信息
      centerDialogVisible: false,
      editVisible: false, // 显示编辑框
      delVisible: false, // 显示删除框
      select_word: '', // 记录输入框输入的内容
      pageSize: 10, // 页数
      currentPage: 1, // 当前页
      idx: -1, // 记录当前点中的行
      setModelVisible:false
    }
  },
  computed: {
    // 计算当前表格中的数据
    data () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  created () {
    this.getData();
    this.getDay();
  },
  methods: {
    addEl: function() {
      let cope = {
        meeting_detail: "",
      }
      this.meetingTopic.push(cope);
    },
    del: function(index) {
      this.meetingTopic.splice(index, 1);
    },
    addEl1: function() {
      let cope = {
        meeting_detail: "",
      }
      this.meetingAffairs.push(cope);
    },
    del1: function(index) {
      this.meetingAffairs.splice(index, 1);
    },
    addEl2: function() {
      let cope = {
        other_work: "",
      }
      this.other.push(cope);
    },
    del2: function(index) {
      this.other.splice(index, 1);
    },
    addEl3: function() {
      let cope = {
        research: "",
      }
      this.next.push(cope);
    },
    del3: function(index) {
      this.next.splice(index, 1);
    },
    getDay() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      let nowDay = year + '-' + month + '-' + day;
      this.queryParam.week = this.getWeekInMonth(new Date(nowDay));
      this.queryParam.value = year + '-' + month + '-' + day;
      this.insertDate = year + '年' + month + '月第' + this.queryParam.week + '周'
    },
    weekChange(val) {
      if (val) {
        //let arr = val.split('-');
        this.queryParam.week = this.getWeekInMonth(new Date(val));
      }
    },
    // 根据日期判断是月的第几周
    getWeekInMonth(t) {
      if (t == undefined || t == '' || t == null) {
        t = new Date();
      } else {
        var _t = new Date();
        _t.setYear(t.getFullYear());
        _t.setMonth(t.getMonth());
        _t.setDate(t.getDate());

        var date = _t.getDate(); //给定的日期是几号

        _t.setDate(1);
        var d = _t.getDay(); //1. 得到当前的1号是星期几。
        var fisrtWeekend = d;
        if (d == 0) {
          fisrtWeekend = 1;
          //1号就是星期天
        } else {
          fisrtWeekend = 7 - d + 1; //第一周的周未是几号
        }
        if (date <= fisrtWeekend) {
          return 1;
        } else {
          return 1 + Math.ceil((date - fisrtWeekend) / 7);
        }
      }
    },

    indexMethod(index){
      return (this.currentPage - 1) * this.pageSize + index + 1 ;
    },
    // 获取当前页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 获取用户信息
    getData () {
      this.tableData = []
      this.tempDate = []
      WeeklyManager.getWeeklyBasic(this.query).then((res) => {
        this.tableData = res
        this.tempDate = res
        this.currentPage = 1
      })
    },

    // 添加周报
    addWeeklyModel () {
      let params = new URLSearchParams()
      params.append('insertDate', this.insertDate)
      WeeklyManager.setModel(params)
        .then(res => {
          if (res.code === 1) {
            this.getData()
            this.registerForm = {}
            this.$notify({
              title: '添加成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '添加失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.centerDialogVisible = false
    },
    handleSetDetail (row) {
      this.idx = row.id
      this.form = {
        id: row.weekly_id,
        model_date:row.model_date
      }
      WeeklyManager.getWeeklyDetail(this.form).then((res) => {
        this.tableDetail = JSON.parse(JSON.stringify(res))
        //查找专题会的数据
        this.meetingTopic = this.tableDetail.meeting.meetingTopic
        this.meetingAffairs = this.tableDetail.meeting.meetingAffairs
        this.normalWork = (this.tableDetail.normal.length === 0?this.initNormal:this.tableDetail.normal)
        this.lvtong = (this.tableDetail.Lvtong.length === 0?this.initlvtong:this.tableDetail.Lvtong)
        this.other = this.tableDetail.other
        this.next = this.tableDetail.next
        this.research.normal_work = (this.tableDetail.research==='' || this.tableDetail.research=== null ?'':this.tableDetail.research.normal_work)
        this.setVisible = true
      })
    },
    saveMeetingTopic(){
      window.console.log("HHHHHHHH")
      window.console.log(this.form)
      window.console.log(this.meetingTopic)
      window.console.log("HHHHHHHH")

/*      let formdata = new FormData()
      formdata.append('insetBasic', this.form )
      formdata.append('meetingTopic', this.meetingTopic )*/
      let formdata={
        insetBasic:this.form,
        meetingTopic:this.meetingTopic
      }


      WeeklyManager.saveMeetingTopic(formdata).then((res) => {
          if (res) {
            this.$notify({
              title: '保存成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '保存失败',
              type: 'error'
            })
          }
        }).catch(error => {
              console.error(error)
            })
    },
    handleDetail (row) {
      this.idx = row.id
      this.form = {
        id: row.weekly_id,
        model_date:row.model_date
      }
      WeeklyManager.getWeeklyDetail(this.form).then((res) => {
        this.tableDetail = JSON.parse(JSON.stringify(res))
        //查找专题会的数据
        this.meetingTopic = this.tableDetail.meeting.meetingTopic
        this.meetingAffairs = this.tableDetail.meeting.meetingAffairs
        this.normalWork = this.tableDetail.normal
        this.lvtong = this.tableDetail.Lvtong
        this.other = this.tableDetail.other
        this.next = this.tableDetail.next
        this.research= this.tableDetail.research
        this.editVisible = true
      })
    },
    // 保存编辑
    formatDate(row) {
      let date = new Date(row['create_time'] );
      console.log(date);
      console.log(row);
      console.log(row['create_time']);
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      return Y + M + D;
    },
    // 确定删除

    deleteRow () {
      MeetingManager.deleteMeeting(this.idx)
        .then(res => {
          if (res) {
            this.getData()
            this.$notify({
              title: '删除成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '删除失败',
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.error(error)
        })
      this.delVisible = false
    },

    //导出格式化word文档，点击导出
    deriveword(tableDetail) {
      let docxname = "工作周报.docx";                        //导出文件的名字
      // 读取并获得模板文件的二进制内容
        JSZipUtils.getBinaryContent("week_moban.docx", function(error, content) {
        // docxsrc是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error;
        }
        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content);
        // 创建并加载docx templater实例对象
        let doc = new docxtemplater().loadZip(zip);
        // 设置模板变量的值
          window.console.log("KKKK")
          window.console.log(tableDetail)
          window.console.log("KKKK")

        doc.setData({
          week_date: tableDetail.model_date,
          meetingTopic: tableDetail.meeting.meetingTopic,
          meetingAffairs: tableDetail.meeting.meetingAffairs,
          normalWork: tableDetail.normal,
          lvtong: tableDetail.Lvtong,
          other: tableDetail.other,
          next: tableDetail.next,
          research: tableDetail.research === null || tableDetail.research === ''?"无数据":tableDetail.research.normal_work
        });

        try {
          // 用模板变量的值替换所有模板变量
          doc.render();
        } catch (error) {
          // 抛出异常
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          };
          console.log(JSON.stringify({ error: e }));
          throw error;
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, docxname);
      });
    },

  }
}

</script>



<style scoped>
.handle-box {
  margin-bottom: 20px;
  font-size: 12px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>
