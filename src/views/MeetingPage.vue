<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-row :gutter="10">
          <el-col :span="2">
            <el-input v-model="query.meeting_name" placeholder="会议名称" class="handle-input mr10"></el-input>
          </el-col>
          <el-col :span="2">
            <el-select v-model="query.meeting_place" clearable placeholder="会议地点">
              <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="2">
            <el-select v-model="query.meeting_type" clearable placeholder="会议类型">
              <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>

        <el-button type="primary" @click="getData">查询</el-button>
        <el-button type="primary" @click="centerDialogVisible = true">添加会议</el-button>
        </el-row>

      </div>
      <el-table :data="data" border style="width: 100%" ref="multipleTable" height="638px">
        <el-table-column label="序号" type="index" width="100" align="center" :index='indexMethod'></el-table-column>
        <el-table-column label="会议名称" prop="meeting_name" width="240" align="center"></el-table-column>
        <el-table-column label="会议类型" prop="meeting_type" width="200" align="center">
          <template v-slot="scope">
            <span v-if="scope.row.meeting_type == 1">科务会</span>
            <span v-if="scope.row.meeting_type == 2">专题会</span>
            <span v-if="scope.row.meeting_type == 3">集体学习</span>
            <span v-if="scope.row.meeting_type == 4">全体会议</span>
            <span v-if="scope.row.meeting_type == 5">青年理论学习</span>
            <span v-if="scope.row.meeting_type == 6">专项培训</span>

          </template>
        </el-table-column>
        <el-table-column label="会议时间" prop="meeting_time" :formatter="formatDate" width="200"
                         align="center"></el-table-column>
        <el-table-column label="会议地点" prop="meeting_place" width="200" align="center">
          <template v-slot="scope">
            <span v-if="scope.row.meeting_place == 0">302会议室</span>
            <span v-if="scope.row.meeting_place == 1">327会议室</span>
            <span v-if="scope.row.meeting_place == 2">317会议室</span>
            <span v-if="scope.row.meeting_place == 3">其他</span>
          </template>
        </el-table-column>
        <el-table-column label="会议议程" prop="meeting_topic" min-width="200" align="center"></el-table-column>
        <el-table-column label="备注" prop="meeting_remake" width="200" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template v-slot="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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

    <!--添加新会议-->
    <el-dialog title="会议新增" v-model="centerDialogVisible" width="650px" center>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="会议名称：" prop="meeting_name">
          <el-input v-model="registerForm.meeting_name" placeholder="会议名称"></el-input>
        </el-form-item>
        <el-form-item label="会议类型：">
          <el-radio-group v-model="registerForm.meeting_type">
            <el-radio :label="1">科务会</el-radio>
            <el-radio :label="2">专题会</el-radio>
            <el-radio :label="3">集体学习</el-radio>
            <el-radio :label="4">全体会议</el-radio>
            <el-radio :label="5">青年理论学习</el-radio>
            <el-radio :label="6">专项培训</el-radio>


          </el-radio-group>
        </el-form-item>
        <el-form-item label="会议地点：">
          <el-radio-group v-model="registerForm.meeting_place">
            <el-radio :label="0">302会议室</el-radio>
            <el-radio :label="1">327会议室</el-radio>
            <el-radio :label="2">317会议室</el-radio>
            <el-radio :label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会议时间：" prop="meeting_time">
          <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.meeting_time"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="会议议程：" prop="meeting_topic">
          <el-input type="textarea" placeholder="会议议程" v-model="registerForm.meeting_topic"></el-input>
        </el-form-item>
        <el-form-item label="会议备注：" prop="meeting_remake">
          <el-input type="textarea" placeholder="会议备注" v-model="registerForm.meeting_remake"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="addPeople">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="会议编辑" v-model="editVisible" width="650px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="会议名称：">
          <el-input type="textarea" v-model="form.meeting_name"></el-input>
        </el-form-item>
        <el-form-item label="会议类别：">
          <el-radio-group v-model="form.meeting_type">
            <el-radio label='1'>科务会</el-radio>
            <el-radio label='2'>专题会</el-radio>
            <el-radio label='3'>集体学习</el-radio>
            <el-radio label='4'>全体会议</el-radio>
            <el-radio label='5'>青年理论学习</el-radio>
            <el-radio label='6'>专项培训</el-radio>


          </el-radio-group>
        </el-form-item>
        <el-form-item label="会议地点：">
          <el-radio-group v-model="form.meeting_place">
            <el-radio label=0>302会议室</el-radio>
            <el-radio label=1>327会议室</el-radio>
            <el-radio label=2>317会议室</el-radio>
            <el-radio label=3>其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会议时间：" prop="meeting_time">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.meeting_time"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="会议议程：">
          <el-input type="textarea" v-model="form.meeting_topic"></el-input>
        </el-form-item>
        <el-form-item label="会议备注：">
          <el-input type="textarea" v-model="form.meeting_remake"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="editVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除提示框 -->
    <yin-del-dialog :delVisible="delVisible" @deleteRow="deleteRow" @cancelRow="delVisible = $event"></yin-del-dialog>
  </div>
</template>

<script>
import {mixin} from '../mixins'
import {RULES} from '../enums'
import {getDateTime} from '../utils'
import YinDelDialog from '@/components/dialog/YinDelDialog'
import {MeetingManager} from "@/api/metting";


export default {
  name: 'MeetingPage',
  mixins: [mixin],
  components: {
    YinDelDialog
  },
  data() {
    return {
      registerForm: { // 新增会议
        meeting_name: '',
        meeting_type: '',
        meeting_time: '',
        meeting_place: '',
        meeting_topic: '',
        meeting_remake: ''
      },
      query: {
        meeting_name: '',
        meeting_type: '',
        meeting_place: ''
      },
      options1: [{
        value: '0',
        label: '302会议室'
      }, {
        value: '1',
        label: '327会议室'
      }, {
        value: '2',
        label: '317会议室'
      }, {
        value: '3',
        label: '其他'
      }],
      options2: [
       {
        value: '1',
        label: '科务会'
      }, {
        value: '2',
        label: '专题会'
      }, {
        value: '3',
        label: '集体学习'
      },{
          value: '4',
          label: '全体会议'
        },{
          value: '5',
          label: '青年理论学习'
        },{
          value: '6',
          label: '专项培训'
        },


      ],
      form: { // 记录编辑会议
        id: '',
        meeting_name: '',
        meeting_type: '',
        meeting_time: '',
        meeting_place: '',
        meeting_topic: '',
        meeting_remake: ''
      },
      rules: RULES,
      tableData: [], // 记录会议信息，用于显示
      tempDate: [], // 记录用户信息，用于搜索时能临时记录一份用户信息
      centerDialogVisible: false,
      editVisible: false, // 显示编辑框
      delVisible: false, // 显示删除框
      select_word: '', // 记录输入框输入的内容
      pageSize: 10, // 页数
      currentPage: 1, // 当前页
      idx: -1 // 记录当前点中的行
    }
  },
  computed: {
    // 计算当前表格中的数据
    data() {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 获取用户信息
    getData() {
      this.tableData = []
      this.tempDate = []
      MeetingManager.getAllMeeting(this.query).then((res) => {
        this.tableData = res
        this.tempDate = res
        this.currentPage = 1
      })
    },

    // 添加用户
    addPeople() {
      let datetime = getDateTime(this.registerForm.meeting_time)
      let params = new URLSearchParams()
      params.append('meeting_name', this.registerForm.meeting_name)
      params.append('meeting_type', this.registerForm.meeting_type)
      params.append('meeting_place', this.registerForm.meeting_place)
      params.append('meeting_topic', this.registerForm.meeting_topic)
      params.append('meeting_remake', this.registerForm.meeting_remake)
      params.append('meeting_time', datetime)
      MeetingManager.setMeeting(params)
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
    // 编辑
    handleEdit(row) {
      this.idx = row.id
      this.form = {
        id: row.id,
        meeting_name: row.meeting_name,
        meeting_type: row.meeting_type,
        meeting_time: row.meeting_time,
        meeting_place: row.meeting_place,
        meeting_topic: row.meeting_topic,
        meeting_remake: row.meeting_remake
      }
      this.editVisible = true
    },
    // 保存编辑
    formatDate(row) {
      let date = new Date(row['meeting_time']);
      console.log(date);
      console.log(row);
      console.log(row['meeting_time']);
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      return Y + M + D;
    },
    saveEdit() {
      let datetime = getDateTime(new Date(this.form.meeting_time))
      let params = new URLSearchParams()
      params.append('id', this.form.id)
      params.append('meeting_name', this.form.meeting_name)
      params.append('meeting_type', this.form.meeting_type)
      params.append('meeting_time', datetime)
      params.append('meeting_place', this.form.meeting_place)
      params.append('meeting_topic', this.form.meeting_topic)
      params.append('meeting_remake', this.form.meeting_remake)

      MeetingManager.updateMeeting(params).then(res => {
        if (res.code === 1) {
          this.getData()
          this.$notify({
            title: '修改成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '修改失败',
            type: 'error'
          })
        }
      }).catch(err => {
        console.error(err)
      })
      this.editVisible = false
    },
    // 确定删除

    deleteRow() {
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
    }
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
