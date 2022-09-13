<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="2">
                    <el-col :span="3">
                        <el-date-picker type="date" placeholder="选择日期" v-model="query.work_time"
                                        style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-button type="primary" @click="getData">查询</el-button>
                    <el-button type="primary" @click="centerDialogVisible = true">添加工作记录</el-button>
                </el-row>
            </div>

            <el-table :data="data" border style="width: 100%" ref="multipleTable" height="638px">
                <el-table-column label="序号" type="index" width="100" align="center"
                                 :index='indexMethod'></el-table-column>
                <el-table-column label="日期" prop="work_time" :formatter="formatDate" width="200"
                                 align="center"></el-table-column>
                <el-table-column label="工作事项" prop="work_topic" min-width="200" align="center">
                    <template v-slot="scope">
                       <span class="pre-wrap ">
                        {{ scope.row.work_topic }}
                       </span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="work_remake" width="200" align="center"></el-table-column>
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

        <!--添加工作事项-->
        <el-dialog title="添加工作事项" v-model="centerDialogVisible" width="650px" center>
            <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="时间：" prop="work_time">
                    <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.work_time"
                                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="工作事项：" prop="work_topic">
                    <el-input type="textarea" placeholder="工作事项" v-model="registerForm.work_topic" :autosize="{ minRows: 3, maxRows: 10}"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="work__remake">
                    <el-input type="textarea" placeholder="备注" v-model="registerForm.work_remake"></el-input>
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
        <el-dialog title="工作事项编辑" v-model="editVisible" width="650px">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="时间：" prop="work_time">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.work_time"
                                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="工作事项：">
                    <el-input type="textarea" v-model="form.work_topic" :autosize="{ minRows: 3, maxRows: 10}"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input type="textarea" v-model="form.work_remake"></el-input>
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
        <yin-del-dialog :delVisible="delVisible" @deleteRow="deleteRow"
                        @cancelRow="delVisible = $event"></yin-del-dialog>
    </div>
</template>

<script>
    import {mixin} from '../mixins'
    import {RULES} from '../enums'
    import {getDateTime} from '../utils'
    import {WorkRecordManager} from "@/api/work";

    import YinDelDialog from '@/components/dialog/YinDelDialog'


    export default {
        name: 'workRecordPage',
        mixins: [mixin],
        components: {
            YinDelDialog
        },
        data() {
            return {
                registerForm: { // 新增工作事项
                    work_time: '',
                    work_topic: '',
                    work_remake: ''
                },
                query: {
                    work_time: '',
                },
                form: { // 记录编辑会议
                    id: '',
                    work_time: '',
                    work_topic: '',
                    work_remake: ''
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
                idx: -1, // 记录当前点中的行
                deleteID: -1
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
                this.query.work_time = this.query.work_time === null || this.query.work_time === '' || this.query.work_time === undefined ? '' : this.formatDate1(this.query.work_time)
                this.tableData = []
                this.tempDate = []
                WorkRecordManager.getAllWork(this.query).then((res) => {
                    this.tableData = res
                    this.tempDate = res
                    this.currentPage = 1
                })
            },

            //
            addPeople() {
                let params = new URLSearchParams()
                params.append('work_topic', this.registerForm.work_topic)
                params.append('work_remake', this.registerForm.work_remake)
                params.append('work_time', this.formatDate1(this.registerForm.work_time))
                WorkRecordManager.setWork(params)
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
                    work_topic: row.work_topic,
                    work_remake: row.work_remake,
                    work_time: row.work_time
                }
                this.editVisible = true
            },

            formatDate(row) {
                let date = new Date(row['work_time']);
                console.log(date);
                console.log(row);
                console.log(row['work_time']);
                let Y = date.getFullYear() + '-';
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                return Y + M + D;
            },

            formatDate1(time) {
                let date = new Date(time);

                let Y = date.getFullYear() + '-';
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                return Y + M + D;
            },
            handleDelete(id) {
                this.delVisible = true
                this.deleteID = id;

            },
            saveEdit() {
                let datetime = getDateTime(new Date(this.form.work_time))
                let params = new URLSearchParams()
                params.append('id', this.form.id)
                params.append('work_topic', this.form.work_topic)
                params.append('work_remake', this.form.work_remake)
                params.append('work_time', datetime)

                WorkRecordManager.updateWork(params).then(res => {
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
                WorkRecordManager.deleteWork(this.deleteID)
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

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }


    .handle-box {
        margin-bottom: 20px;
        font-size: 12px;
    }

    .pre-wrap {
        white-space: nowrap;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .pagination {
        display: flex;
        justify-content: center;
    }
</style>
