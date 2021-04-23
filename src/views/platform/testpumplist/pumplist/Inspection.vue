<template>
  <el-container>
    <!-- dialog -->
    <div class="dialog-mian">
      <el-dialog :visible.sync="add_taskdialog" width="40%">
        <el-form
          ref="formRef"
          :model="task_form"
          :rules="formRule"
          label-width="120px"
        >
          <el-divider content-position="left" style="color: blue">
            检测任务基本信息
          </el-divider>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="任务名称：" prop="task_name">
                  <el-input
                    v-model="task_form.name"
                    placeholder="请输入任务名称"
                  />
                </el-form-item>
                <el-form-item label="质检项目" prop="reportId">
                  <el-select
                    v-model="task_form.basedata.info.testContent.name"
                    placeholder="质检项目"
                    style="width: 100%"
                    @change="changeReport"
                  >
                    <el-option
                      v-for="(item, index) in reportList"
                      :key="index"
                      :label="item.name"
                      :value="index"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <!--右边的地方-->
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="开始时间：" prop="starttime">
                  <el-date-picker
                    v-model="task_form.basedata.info.starttime"
                    type="datetime"
                    value-format="timestamp"
                  />
                </el-form-item>

                <el-form-item label="结束时间：" prop="endtime">
                  <el-date-picker
                    v-model="task_form.basedata.info.endtime"
                    type="datetime"
                    value-format="timestamp"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left" style="color: blue">
            检测资源信息
          </el-divider>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple" />
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="测试台体" prop="bedname">
                  <el-select
                    v-model="task_form.basedata.info.devInfo.name"
                    style="width: 100%"
                    placeholder="请选择测试台体"
                    @change="changeBed"
                  >
                    <!-- item.objectId -->
                    <el-option
                      v-for="(item, index) in testbedlist"
                      :key="index"
                      :label="item.name"
                      :value="index"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="检验编号" prop="bedname">
                  <el-input v-model="task_form.basedata.info.inspnumber" />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add_taskdialog = false">取 消</el-button>
          <el-button type="primary" @click="submiTask('formRef')">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <el-aside v-show="treeState" width="300px">
      <RoleTree ref="roleTreeRef" />
    </el-aside>
    <el-main>
      <div class="inspection">
        <el-tabs type="border-card">
          <el-tab-pane :label="'审核中(' + total + ')'">
            <el-row>
              <el-col :span="12">&nbsp;</el-col>
              <el-col :span="12" style="text-align: right">
                <p>
                  <el-button
                    type="primary"
                    size="medium"
                    icon="el-icon-plus"
                    @click="add_taskdialog = true"
                  >
                    新增任务
                  </el-button>
                </p>
              </el-col>
            </el-row>

            <div class="tasklist">
              <el-table
                :data="
                  taskList.undoneData.slice(
                    (currentPage - 1) * PageSize,
                    currentPage * PageSize
                  )
                "
                stripe
                border
              >
                <el-table-column type="index" label="id" />
                <!-- <el-table-column label="检验编号" align="center" prop="basedata.inspection_number" /> -->

                <el-table-column
                  label="检验/试验编号"
                  align="center"
                  prop="basedata.inspection_number"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ $objGet(scope.row, 'basedata.BasicInfo.bianhao') }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="name" label="任务名称" align="center" />

                <el-table-column
                  prop="basedata.insectionName"
                  label="质检项目"
                  align="center"
                />

                <el-table-column
                  prop="basedata.bedname"
                  label="测试台体"
                  align="center"
                  width="150"
                />

                <el-table-column
                  label="开始时间"
                  prop="$timestampToTime(scope.row.basedata.starttime)}"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ $timestampToTime(scope.row.basedata.starttime) }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  label="结束时间"
                  prop="$timestampToTime(scope.row.basedata.endtime)}"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ $timestampToTime(scope.row.basedata.endtime) }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="创建日期" align="center">
                  <template slot-scope="scope">
                    <span>
                      {{ $utc2beijing(scope.row.createdAt).substring(0, 16) }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="状态" align="center" width="160">
                  <template slot-scope="scope">
                    <!-- verifyStatus 0 未审核, 1 审核通过 2 审核不通过 -->

                    <span v-if="scope.row.basedata.verifyStatus > 0">
                      {{
                        ['', '审核通过', '审核不通过'][
                          scope.row.basedata.verifyStatus
                        ]
                      }}
                    </span>

                    <span v-else>
                      {{
                        ['未开始', '正在测试', '测试完成'][
                          scope.row.basedata.testStatus
                        ] || '未测试'
                      }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="报告操作" width="240">
                  <template slot-scope="scope">
                    <!-- <span v-if="userRoles.org_type != '中心厂家检测员' "> -->
                    <el-button
                      v-show="scope.row.basedata.testStatus == 1"
                      type="success"
                      size="mini"
                      @click="clientView(scope.row, scope.$index)"
                    >
                      取证
                    </el-button>

                    <el-button
                      v-show="scope.row.basedata.testStatus == 2"
                      :disabled="!scope.row.basedata.hasReport"
                      type="success"
                      style="margin-left: 20px"
                      size="mini"
                      @click="stepfun(scope.row)"
                    >
                      导出
                    </el-button>

                    <el-button
                      v-show="scope.row.basedata.testStatus == 0"
                      size="mini"
                      @click="showTaskStartBox(scope.row)"
                    >
                      开始
                    </el-button>

                    <!-- testStatus = 2 代表完成 -->

                    <el-button
                      v-show="
                        scope.row.basedata.testStatus > 0 &&
                        scope.row.basedata.testStatus < 2
                      "
                      type="primary"
                      size="mini"
                      @click="beforeFinish(scope.row)"
                    >
                      完成
                    </el-button>

                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="生成报告以后才能导出"
                      placement="top-start"
                    >
                      <el-button
                        v-show="scope.row.basedata.testStatus == 2"
                        size="mini"
                        icon="el-icon-document"
                        @click="beforGetTestReport(scope.row)"
                      >
                        报告
                      </el-button>
                    </el-tooltip>

                    <!-- </span> -->
                  </template>
                </el-table-column>

                <el-table-column width="320" align="center">
                  <template slot-scope="scope">
                    <el-dropdown>
                      <el-button size="small">
                        更多操作
                        <i class="el-icon-arrow-down el-icon--right" />
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          :disabled="scope.row.basedata.testStatus == 2"
                          @click.native="editorClient(scope.row)"
                        >
                          编 辑
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click.native="deleteClient(scope.row.objectId)"
                        >
                          删 除
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click.native="examineVerify(scope.row)"
                        >
                          详 情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>

              <div style="margin-top: 20px">
                <el-pagination
                  :page-sizes="pageSizes"
                  :page-size="pagesize"
                  :total="totalCount"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="'审核完成(' + total1 + ')'">
            <el-table
              :data="
                taskList.doneData.slice(
                  (currentPage - 1) * PageSize,
                  currentPage * PageSize
                )
              "
              stripe
              border
            >
              <el-table-column type="index" label="id" />
              <!-- <el-table-column label="检验编号" align="center" prop="basedata.inspection_number" /> -->

              <el-table-column
                label="检验/试验编号"
                align="center"
                prop="basedata.inspection_number"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $objGet(scope.row, 'basedata.BasicInfo.bianhao') }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column prop="name" label="任务名称" align="center" />

              <el-table-column
                prop="basedata.insectionName"
                label="质检项目"
                align="center"
              />

              <el-table-column
                prop="basedata.bedname"
                label="测试台体"
                align="center"
                width="150"
              />

              <el-table-column
                label="开始时间"
                prop="$timestampToTime(scope.row.basedata.starttime)}"
                align="center"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $timestampToTime(scope.row.basedata.starttime) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                label="结束时间"
                prop="$timestampToTime(scope.row.basedata.endtime)}"
                align="center"
              >
                <template slot-scope="scope">
                  <span>
                    {{ $timestampToTime(scope.row.basedata.endtime) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="创建日期" align="center">
                <template slot-scope="scope">
                  <span>
                    {{ $utc2beijing(scope.row.createdAt).substring(0, 16) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="状态" align="center" width="160">
                <template slot-scope="scope">
                  <!-- verifyStatus 0 未审核, 1 审核通过 2 审核不通过 -->

                  <span v-if="scope.row.basedata.verifyStatus > 0">
                    {{
                      ['', '审核通过', '审核不通过'][
                        scope.row.basedata.verifyStatus
                      ]
                    }}
                  </span>

                  <span v-else>
                    {{
                      ['未测试', '正在测试', '测试完成'][
                        scope.row.basedata.testStatus
                      ] || '未测试'
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                v-if="userRoles.org_type != '中心厂家检测员'"
                label="数据操作"
                width="320"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deleteClient(scope.row.objectId)"
                  >
                    删 除
                  </el-button>

                  <el-button
                    type="success"
                    style="margin-left: 20px"
                    size="mini"
                    @click="stepfun(scope.row)"
                  >
                    导出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
              <el-pagination
                :page-sizes="pageSizes"
                :page-size="pagesize"
                :total="total1"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </el-container>
</template>

<script src="./Inspection.js" lang="js"></script>

<style src="./Inspection.scss" lang="scss" scoped></style>
