<!-- eslint-disable-next-line -->

<template>
  <div class="roles">
    <el-row :gutter="20">
      <el-col :span="14" :xs="24">
        <div class="rightTable">
          <div class="search">
            <vab-query-form style="margin-top: 20px">
              <vab-query-form-top-panel>
                <el-form
                  :inline="true"
                  label-width="100px"
                  :model="queryForm"
                  @submit.native.prevent
                >
                  <el-form-item :label="$translateTitle('user.department')">
                    <el-select
                      v-model="queryForm.workGroupName"
                      placeholder="请选择"
                      clearable
                      @visible-change="change($event)"
                    >
                      <el-option
                        :value="treeDataValue"
                        style="height: auto; padding: 0"
                      >
                        <el-tree
                          ref="workGroup"
                          class="workGroup"
                          :data="roleTree"
                          :props="roleProps"
                          node-key="index"
                          default-expand-all
                          :expand-on-click-node="false"
                        >
                          <div
                            slot-scope="{ node, data }"
                            class="custom-tree-node"
                          >
                            <span
                              :class="{
                                selected: data.objectId == curDepartmentId,
                              }"
                              @click="handleNodeClick(data)"
                            >
                              {{ node.label }}
                            </span>
                            <span>
                              <i
                                class="el-icon-circle-plus-outline"
                                :title="$translateTitle('product.addrole')"
                                @click="setDialogRole(data)"
                              />
                            </span>
                          </div>
                        </el-tree>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$translateTitle('user.rolename')">
                    <el-input
                      v-model="search"
                      :placeholder="$translateTitle('user.rolename')"
                      size="mini"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item>
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-search"
                      style="margin-left: 20px"
                      @click="getRolesList(0)"
                    >
                      {{ $translateTitle('developer.search') }}
                    </el-button>
                    <!-- icon="el-icon-plus" -->
                    <!--           <el-button type="primary" size="mini" @click="add">
              {{
               $translateTitle("developer.add")
              }}
            </el-button>-->
                    <!-- icon="el-icon-search" -->
                    <el-button
                      type="primary"
                      size="mini"
                      @click="getRolesList()"
                    >
                      <!-- 所有角色 -->
                      {{ $translateTitle('product.allroles') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </vab-query-form-top-panel>
            </vab-query-form>
          </div>
          <div class="tableroles" style="margin-top: 20px">
            <el-table
              highlight-current-row
              :data="roleList"
              :row-class-name="tableRowClassName"
              :row-style="selectedHighlight"
              style="width: 100%; text-align: center"
              size="small"
              @row-click="getDetailmenu"
            >
              <el-table-column
                :label="$translateTitle('user.rolename')"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <!--         <el-table-column :label=" $translateTitle('developer.describe')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.desc }}</span>
                </template>
              </el-table-column>-->
              <el-table-column
                :label="$translateTitle('user.Remarks')"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.alias }}</span>
                </template>
              </el-table-column>
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.objectId }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$translateTitle('developer.operation')"
                align="center"
              >
                <template slot-scope="scope">
                  <!-- <el-button size="mini" type="primary" @click="handleEdit(scope.row)">分配权限</el-button> -->
                  <!-- <el-button size="mini" type="success" @click="addmenu(scope.row)">分配菜单</el-button> -->
                  <!-- <el-button size="mini" type="primary" >增加用户</el-button> -->

                  <el-dropdown
                    split-button
                    type="primary"
                    size="mini"
                    @click="exportRolerole(scope.row)"
                  >
                    <span class="el-dropdown-link">
                      <!-- 修改 -->
                      {{ $translateTitle('product.modify') }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        icon="el-icon-document"
                        @click.native="exportRoletemp(scope.row)"
                      >
                        <!-- 保存模板 -->
                        {{ $translateTitle('product.savetemplate') }}
                      </el-dropdown-item>
                      <!-- <el-dropdown-item icon="el-icon-document" @click.native="handleEditrole(scope.row)" >编辑</el-dropdown-item> -->
                      <el-dropdown-item
                        size="mini"
                        icon="el-icon-delete"
                        @click.native="handleDelete(scope.row)"
                      >
                        <!-- 删除 -->
                        {{ $translateTitle('task.Delete') }}
                      </el-dropdown-item>
                      <!-- <el-dropdown-item @click.native="taskDetail(scope.row.objectId,scope.row.test_bed.id)">详情</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="rightPagination">
              <el-pagination
                :total="total"
                layout="prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10" :xs="24">
        <!--菜单-->
        <div class="rolefooter">
          <div class="footerleft">
            <p class="top">
              <span class="svg-container">
                <vab-icon icon="role_group" />
              </span>
              <span>
                <!-- 分配权限 -->
                {{ $translateTitle('user.assignroles1') }}
              </span>
            </p>
            <div class="rolecontrol">
              <el-tree
                ref="permissionTree"
                :data="permissionTreeData"
                :default-checked-keys="rolePermissonList"
                :expand-on-click-node="false"
                show-checkbox
                node-key="objectId"
                default-props
                accordion
              >
                <span slot-scope="{ node }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                </span>
                <span>
                  <i
                    class="el-icon-circle-plus-outline"
                    :title="$translateTitle('product.addrole')"
                    @click="setDialogRole(data)"
                  />
                </span>
              </el-tree>
            </div>
          </div>
          <div class="footerright">
            <p class="top">
              <span class="svg-container">
                <vab-icon icon="menu_group" />
              </span>
              <span>
                <!-- 菜单分配 -->
                {{ $translateTitle('user.assignmenu') }}
              </span>
            </p>
            <div class="menucontrol" style="margin-top: 30px">
              <el-tree
                ref="menusTree"
                :data="menuTreeData"
                :default-checked-keys="roleMenuList"
                :expand-on-click-node="false"
                show-checkbox
                node-key="objectId"
                default-props
                accordion
              >
                <!-- eslint-disable-next-line -->
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  {{ data.title ? data.title : node.label }}
                </span>
              </el-tree>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <a-modal
      :footer="null"
      :visible="centerDialogRole"
      :title="$translateTitle('product.addrole')"
      @cancel="closeDialogRole"
    >
      <addroles
        ref="addRoleRef"
        :key="$moment().unix()"
        :dept-data="deptData"
      />
    </a-modal>

    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('developer.add')"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        ref="multipleTable"
        :data="tableDataroles"
        style="width: 100%; text-align: center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$translateTitle('user.name')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$translateTitle('user.Remarks')"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.objectId }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click="addacl">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </span>
    </el-dialog>

    <!--编辑权限弹窗-->
    <el-dialog
      :append-to-body="true"
      :title="$translateTitle('developer.edit')"
      :visible.sync="roleEdit"
    >
      <el-form :model="form">
        <el-form-item
          :label="$translateTitle('user.rolename')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width: 300px"
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="$translateTitle('user.Remarks')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.alias"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item
          :label="$translateTitle('developer.describe')"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.desc"
            :rows="2"
            autocomplete="off"
            style="width: 300px"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleEdit = false">
          {{ $translateTitle('developer.cancel') }}
        </el-button>
        <el-button type="primary" @click="updaterole">
          {{ $translateTitle('developer.determine') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    saveRoletemp,
    delRole,
    queryRole,
    roleMenu,
    saveRole,
  } from '@/api/Role/index'
  import { mapGetters, mapMutations } from 'vuex'
  import addroles from '@/views/roles/rolelist/addroles'
  import { Roletree } from '@/api/Menu'
  export default {
    name: 'Role',
    data() {
      return {
        curDepartmentId: '',
        formLabelWidth: '120px',
        roleEdit: false,
        form: {
          name: '',
          alias: '',
          desc: '',
        },
        data: [],
        dialogVisible: false,
        multipleSelection: [],
        search: '',
        total: 0,
        pagesize: 10,
        start: 0,
        roleList: [],
        tableDataroles: [],
        centerDialogVisible: false,
        editroleid: '',
        currentSelectIndex: null,
        roleProps: {
          children: 'children',
          label: 'name',
        },
        treeDataValue: '',
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
          workGroupName: '',
          workGroupTreeShow: false,
          access_token: '',
        },
        checkMenus: [], // 选中菜单
        checkRoles: [], // 选中权限
        dataMenus: [],
        menusTreeloading: false,
        permissionTreeloading: false,
        roleMenuList: [],
        dataPermissions: [],
        rolePermissonList: [],
        loadingService: {},
        roleItem: [],
        centerDialogRole: false,
        deptData: {},
      }
    },
    computed: {
      roleTree: {
        get: function () {
          return this.$store.state.user.roleTree
        },
        set: function (v) {
          return this.setRoleTree(v)
        },
      },
      ...mapGetters({
        // roleTree: 'user/roleTree',
        Menu: 'user/Menu',
        Permission: 'user/Permission',
      }),
      permissionTreeData() {
        const cloneData = JSON.parse(JSON.stringify(this.dataPermissions))
        return cloneData.filter((father) => {
          /* eslint-disable */
        const branchArr = cloneData.filter(
          (child) => father.objectId == child.parentId
        ) // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : '' // 如果存在子级，则给父级添加一个children属性，并赋值
        return father.parentId == 0 // 返回第一层
        /* eslint-disable */
      })
    },
    menuTreeData() {
      const cloneData = JSON.parse(JSON.stringify(this.dataMenus))

      const res = cloneData.filter((father) => {
        father.title =
          father.meta && father.meta.title ? father.meta.title : ''
        /* eslint-disable */
        const branchArr = cloneData.filter(
          (child) => father.objectId == child.parentId
        )
        branchArr.length > 0 ? (father.children = branchArr) : ''
        return father.parentId == 0
        /* eslint-disable */
      })
      return res
    },
  },
  components: {
    addroles,
  },
  mounted() {
    this.getRoletree()
    this.getRoleschema()
    this.getMenu()
    this.getRolesList()
    this.$baseEventBus.$on('dialogHide', () => {
      this.centerDialogRole = false
      this.getMenu()
    })
  },

  methods: {
    ...mapMutations({
      setRoleTree: 'user/setRoleTree'
    }),
    async getRoletree(){
      const {results = []} = await Roletree()
      console.log(results,'results')
      this.setRoleTree(results)
    },
    change(e) {
      console.log(e)
      if (e) {
        $('.el-tree').css({
          height: '300px',
          display: 'block',
          'overflow-x': 'auto',
        })
      }
    },
    getMenu() {
      console.log('this.Menu', this.Menu)
      this.menusTreeloading = true
      this.data = []
      this.dataMenus = []
      if (this.Menu) {
        const results = this.Menu
        results.map((items) => {
          var obj = {}
          obj.label = items.name
          obj.meta = items.meta
          obj.objectId = items.objectId
          obj.parentId = items.parent.objectId
          obj.createtime = new Date(items.createdAt).toLocaleDateString()
          this.data.push(obj)
          this.dataMenus.push(obj)
        })
        console.log('this.dataMenus', this.dataMenus)
        this.handleNodeClick(this.roleTree[0])
      }
      this.menusTreeloading = false
    },
    diguiquchu(datas, arr, v, needdelarr) {
      // 递归找出半选中的数据
      arr.map((item) => {
        // console.log(item.key, v, "----------");
        if (item.key == v && item.children.length > 0) {
          // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
          needdelarr.push(v)
          this.diguiquchu(datas, item.children, v, needdelarr)
        } else if (item.key != v && item.children.length > 0) {
          this.diguiquchu(datas, item.children, v, needdelarr)
        }
      })
    },
    add() {
      this.$router.push({
        path: 'roles/editroles',
        query: {
          insert: 0,
        },
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //给role添加acl权限
    addacl() {
      this.$get_object('_Role', this.objectId).then((object) => {
      })
    },
    //关闭菜单弹窗
    handleClose() {
      this.dialogVisible = false
    },
    //删除角色
    handleDelete(row) {

      this.$confirm(this.$translateTitle('user.This operation will permanently delete this role, do you want to continue?'), this.$translateTitle('user.prompt'), {
        confirmButtonText: this.$translateTitle('developer.determine'),
        cancelButtonText: this.$translateTitle('developer.cancel'),
        type: 'warning',
      })
        .then(() => {
          this.delConfirm(row.objectId)
        })
        .catch(() => {
        })
    },
    // 二次确认删除
    async delConfirm(objectId) {
      let res = await delRole(objectId)
      if (res) {
        this.$message.success(`${this.$translateTitle('user.successfully deleted')}`)

        this.getRolesList()
        this.getRoletree()
        this.getMenu()
      }
    },
    //增加菜单
    addmenu(row) {
      // console.log(row)
      this.rolename = row.attributes.name

      // this.dialogVisible = true;
      this.getMenu()
      this.getRoletree()
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row

      row.index = rowIndex
    },
    selectedHighlight({row, rowIndex}) {
      if (this.currentSelectIndex === rowIndex) {
        return {
          // "background-color": "#409EFF",
          color: '#409EFF',
          'font-weight': 'bold',
          // border: "5px solid black"
        }
      }
    },
    async getDetailmenu(row, column, event, cell) {
      if (column && column.label == '操作') {
        return
      }

      this.loadingService = this.$loading({
        lock: true,
        text: this.$translateTitle('developer.Data is loading') + '...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.6)',
      })

      this.currentSelectIndex = row.index
      const {menus, rules, roles, users, objectId} = await roleMenu(
        row.name
      )
      this.roleItem = {
        menus: menus,
        rules: rules,
        users: users,
        roles: roles,
        objectId: objectId,
      }
      console.log(" this.roleItem", this.roleItem)
      this.loadingService.close()
      if (menus && rules) {
        this.checkMenus = menus
        this.checkRoles = rules
        this.doSetChecked()
      } else {
        this.$message({
          type: 'warning',
          message: '获取角色菜单失败',
        })
      }
    },
    doSetChecked() {
      this.roleMenuList = []
      this.rolePermissonList = []

      this.Menu.map((items) => {
        this.checkMenus.map((mentItem) => {
          if (items.name == mentItem.name) {
            this.roleMenuList.push(items.objectId)
          }
        })
      })
      // console.log("this.Menu", this.Menu)
      // console.log("this.checkMenus", this.checkMenus)
      // console.log("this.roleMenuList", this.roleMenuList)
      // set ###
      this.$refs.menusTree.setCheckedKeys(this.roleMenuList)

      this.Permission.map((items) => {
        this.checkRoles.map((mentItem) => {
          if (items.name === mentItem.name) {
            this.rolePermissonList.push(items.objectId)
          }
        })
      })
      // set ###
      this.$refs.permissionTree.setCheckedKeys(this.rolePermissonList)
    },

    //初始化权限列表
    async getRolesList(start, dataR) {
      if (start == 0) {
        this.start = 0
      }

      let where = {}

      if (dataR && dataR.name != 'admin') {
        where.objectId = dataR.objectId
      }
      const loading = this.$loading({
        background: 'rgba(0, 0, 0, 0.5)',
      })
      let params = {
        skip: this.start,
        limit: this.pagesize,
        order: '-createdAt',
        where: where,
        count: 'objectId',
      }
      let {results, count} = await queryRole(params)
      if (results) {
        loading.close()
        this.roleList = results
        this.total = count
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getRolesList()
    },
    handleCurrentChange(val) {
      this.start = Number(val - 1) * Number(this.pagesize)
      this.getRolesList()
    },
    handleCheckChange(data, checked) {
      console.log(data, checked)
    },
    // 获取权限
    getRoleschema() {
      console.log("this.Permission", this.Permission)
      this.permissionTreeloading = true
      this.dataPermissions = []
      if (this.Permission) {
        const results = this.Permission
        results.map((items) => {
          var obj = {}
          obj.label = items.alias
          obj.alias = items.name
          obj.objectId = items.objectId
          obj.parentId = items.parent.objectId
          obj.createtime = new Date(items.createdAt).toLocaleDateString()
          this.dataPermissions.push(obj)
        })
      }
      this.permissionTreeloading = false
    },
    getCheckedKeys(data, keys, key) {
      var res = []
      recursion(data, false)
      return res

      // arr -> 树形总数据
      // keys -> getCheckedKeys获取到的选中key值
      // isChild -> 用来判断是否是子节点
      function recursion(arr, isChild) {
        var aCheck = []
        for (var i = 0; i < arr.length; i++) {
          var obj = arr[i]
          aCheck[i] = false

          if (obj.children) {
            aCheck[i] = recursion(obj.children, true) ? true : aCheck[i]
            if (aCheck[i]) {
              res.push(obj)
            }
          }

          for (var j = 0; j < keys.length; j++) {
            if (obj[key] == keys[j]) {
              aCheck[i] = true
              if (res.indexOf(obj[key]) == -1) {
                res.push(obj)
              }
              break
            }
          }
        }
        if (isChild) {
          return aCheck.indexOf(true) != -1
        }
      }
    },
    // 修改角色权限
    async exportRolerole(row) {
      let checkmenu = []
      let selectMenu = this.getCheckedKeys(
        this.menuTreeData,
        this.$refs.menusTree.getCheckedKeys(),
        'objectId'
      ) // 选中子级时选中父级
      // let selectMenu = this.$refs.menusTree.getCheckedNodes()  // 只选中子级
      let usersList = []
      let rolesList = []
      let checkrole = []
      let selectRermission = this.$refs.permissionTree.getCheckedNodes()
      let rolesData = this.roleItem.roles
      let usersData = this.roleItem.users

      if (!usersData || !rolesData) {
        this.$message.error(`${this.$translateTitle('user.The correct role permissions and menus are not selected')}`,
        )

        return false
      }
      usersData.forEach((item) => {
        usersList.push(item.username)
      })
      rolesData.forEach((item) => {
        console.log('loadsh', _.assign(...rolesData))
        console.log("item", item)
        rolesList.push(item.name)
      })
      if (selectMenu && selectRermission) {
        selectMenu.forEach((item) => {
          checkmenu.push(item.label)
        })
        console.log('selectMenu', checkmenu)
        selectRermission.forEach((item) => {
          checkrole.push(item.alias)
        })
        console.log('selectRermission', checkrole)
        console.log(row, 'row', row)
        // loadsh uniq 去重，否则则报错 https://blog.csdn.net/qq_38519358/article/details/103330249
        await saveRole({
          objectId: this.roleItem.objectId,
          name: row.name,
          alias: row.alias,
          desc: row.desc,
          rules: _.uniq(checkrole),
          menus: _.uniq(checkmenu),
          roles: _.uniq(rolesList),
          users: _.uniq(usersList),
        }).then(res => {

          if (res) {
            this.$message.success(`${this.$translateTitle('user.Role information updated successfully')}`)
          } else {
            this.$message.error(`${this.$translateTitle('user.Role information updated failed')}`)
          }
        }).catch(e => {
          this.$message.error(`${this.$translateTitle('user.Role information updated successfully')}` + `${e}`)
        })


      } else {
        this.$message.info(`${this.$translateTitle('user.Please select the menu list and permission list')}`)
      }
    },
    // 保存模板
    async exportRoletemp(row) {
      const res = await saveRoletemp(row.name)
      if (res)
        this.$message.success(`${this.$translateTitle('user.Save the template successfully')}`)
    },
    updaterole() {
      const params = {
        alias: this.form.alias,
        desc: this.form.desc,
      }
      this.$update_object(this.editroleid, params).then((res) => {
        this.$message.success(`${this.$translateTitle('user.update completed')}`)

        this.roleEdit = false
        this.getRolesList()
      })
    },
    handleNodeClick(data) {
      this.treeDataValue = data.label
      this.queryForm.workGroupName = data.label
      $('.workGroup').css({
        height: '0px',
        display: 'none',
        'overflow-x': 'auto',
      })
      $('.el-select-dropdown').css({display: 'none'})
      this.curDepartmentId = data.objectId

      // 清除选中的角色

      this.currentSelectIndex = null
      this.getRolesList(0, data)
      // 清除菜单树

      // this.dataMenus = []
    },
    // 添加子节点
    appendChildTree(data) {
      console.log(data, '添加子节点')
    },
    renderContent(h, {node, data, store}) {
      return (
        <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.appendChildTree(data)}
              >
                <i class="el-icon-plus"/>
              </el-button>
            </span>
          </span>
      )
    },
    // 显示弹窗
    setDialogRole(data) {
      this.deptData = data
      // this.$store.commit("set_DeptObj", data);
      // this.$baseEventBus.$emit("set_DeptObj", data)
      this.centerDialogRole = true
      // this.$nextTick(() => {
      //   this.$refs['addRoleRef'].getData(data)
      // })

    },
    closeDialogRole() {
      this.centerDialogRole = false
      this.getRoletree()
    },
  },
}
</script>
<style scoped lang="scss">
.roles {
  background: #ffffff;

  ::v-deep .el-table__body tr.current-row > td {
    color: #f19944;
    background-color: #fdf3ea;
  }

  .rightTable {
    height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
    overflow-x: hidden;
    overflow-y: scroll;

    .search {
      margin: 20px;
      text-align: center;
    }

    .rightPagination {
      margin: 10px;
      text-align: center;
    }
  }
}

.rolefooter {
  display: flex;
  width: 100%;
  height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
  //height: auto;
  margin-top: 10px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.footerleft,
.footerright {
  box-sizing: border-box;
  width: 45%;
  height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
  padding: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
  border: 1px solid #cccccc;
}

.footerright {
  margin-left: 5%;
}

.rolefooter .top {
  height: 50px;
  border-bottom: 1px solid #cccccc;
}

.rolefooter .top span {
  float: left;
  line-height: 50px;
}

.rolefooter .top button {
  float: right;
}
</style>
<style lang="scss">
.roles .search .el-input {
  width: 200px;
}

.leftTree {
  height: calc(100vh - #{$base-top-bar-height} * 4 - 25px);
  overflow-x: hidden;
  overflow-y: scroll;

  span.selected {
    font-weight: bold;
    color: #409eff;
  }

  .el-tree-node {
    margin-top: 5px;
  }

  .custom-tree-node .el-icon-circle-plus-outline:hover {
    color: #409eff;
  }
}
</style>
