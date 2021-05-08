<template>
  <div class="userinfo">
    <div class="dialog">
      <el-dialog width="100vh" height="500vh" :visible.sync="dialogVisible">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-dialog>
    </div>
    <div class="personal-center-container">
      <el-row :gutter="20">
        <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
          <el-card shadow="hover">
            <div class="personal-center-user-info">
              <el-avatar
                :size="100"
                :src="avatar"
                @click.native="uploadCkick"
              />
              <div class="personal-center-user-info-full-name">
                {{ userinfo.username }}
              </div>
              <div class="personal-center-user-info-description">
                {{ userinfo.description }}
              </div>

              <ul class="personal-center-user-info-list">
                <li>
                  <vab-icon icon="user-3-line" />
                  {{ userinfo.nick }}
                </li>
                <li>
                  <vab-icon icon="magic-line" />
                  {{ userinfo.objectId }}
                </li>
                <li>
                  <vab-icon icon="women-line" />
                  {{ userinfo.sex }}
                </li>
                <li>
                  <vab-icon icon="women-line" />
                  {{ userinfo.phone }}
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
          <el-card shadow="hover">
            <el-tabs v-model="activeName">
              <el-tab-pane label="个人信息" name="first">
                <el-col :lg="12" :md="16" :sm="24" :xl="12" :xs="24">
                  <el-form ref="userinfo" label-width="80px" :model="userinfo">
                    <el-form-item label="姓名">
                      <el-input v-model="userinfo.username" />
                    </el-form-item>
                    <el-form-item label="昵称">
                      <el-input v-model="userinfo.nick" />
                    </el-form-item>
                    <el-form-item label="objectId">
                      <el-input v-model="userinfo.objectId" disabled />
                    </el-form-item>
                    <el-form-item label="性别">
                      <el-select v-model="userinfo.sex" style="width: 100%">
                        <el-option label="保密" value="保密" />
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="个人简介">
                      <el-input
                        v-model="userinfo.description"
                        type="textarea"
                      />
                    </el-form-item>
                    <el-form-item label="绑定手机">
                      <el-input v-model="userinfo.phone" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">
                        保存
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="平台设置" name="second">
                <div class="personal-center-item">
                  <vab-icon icon="qq-line" style="color: #3492ed" />
                  <div class="personal-center-item-content">
                    <div>企业名称</div>
                    <div class="personal-center-item-content-second"></div>
                  </div>
                  <el-link type="primary">更换绑定</el-link>
                </div>
                <el-divider />
                <div class="personal-center-item">
                  <vab-icon icon="wechat-line" style="color: #4daf29" />
                  <div class="personal-center-item-content">
                    <div>企业logo</div>
                    <div class="personal-center-item-content-second"></div>
                  </div>
                  <el-link type="primary">更换绑定</el-link>
                </div>
                <el-divider />
                <div class="personal-center-item">
                  <vab-icon icon="alipay-line" style="color: #1476fe" />
                  <div class="personal-center-item-content">
                    <div>登录提示欢迎语</div>
                    <div class="personal-center-item-content-second"></div>
                  </div>
                  <el-link type="primary">更换绑定</el-link>
                </div>
                <el-divider />
                <div class="personal-center-item">
                  <vab-icon icon="weibo-line" style="color: #ffd440" />
                  <div class="personal-center-item-content">
                    <div>企业版权信息</div>
                    <div class="personal-center-item-content-second"></div>
                  </div>
                  <el-link type="primary">更换绑定</el-link>
                </div>
                <el-divider />
                <div class="personal-center-item">
                  <vab-icon icon="github-line" />
                  <div class="personal-center-item-content">
                    <div>首页背景图</div>
                    <div class="personal-center-item-content-second"></div>
                  </div>
                  <el-link type="primary">更换绑定</el-link>
                </div>
                <el-divider />
                <div class="personal-center-item">
                  <vab-icon icon="paypal-line" style="color: #012e85" />
                  <div class="personal-center-item-content">
                    <div>绑定qq</div>
                    <div class="personal-center-item-content-second"></div>
                  </div>
                  <el-link type="primary">更换绑定</el-link>
                </div>
                <el-divider />
                <div class="personal-center-item">
                  <vab-icon icon="paypal-line" style="color: #012e85" />
                  <div class="personal-center-item-content">
                    <div>绑定微信</div>
                    <div class="personal-center-item-content-second"></div>
                  </div>
                  <el-link type="primary">更换绑定</el-link>
                </div>
                <el-divider />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  var editor
  import { mapGetters } from 'vuex'
  export default {
    name: 'Userinfo',
    data() {
      return {
        dialogVisible: false,
        activeName: 'first',
        userinfo: {
          objectId: '',
          sex: '女',
          description: unescape(
            '\u5bcc\u5728\u672f\u6570\uff0c\u4e0d\u5728\u52b3\u8eab\uff1b\u5229\u5728\u52bf\u5c45\uff0c\u4e0d\u5728\u529b\u8015\u3002'
          ),
          phone: '',
        },
        userid: '',
        roles: [],
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
      }),
    },
    mounted() {
      this.queryUserInfo()
    },
    methods: {
      onSubmit() {
        this.$baseMessage(
          '模拟保存成功',
          'success',
          false,
          'vab-hey-message-success'
        )
      },
      handleChange(file) {
        console.log('file文件對象', file.raw)
      },
      uploadCkick() {
        this.dialogVisible = !this.dialogVisible
        // console.log(this.$refs['uploadBox'].$refs.upload.$refs['upload-inner'])
        // this.$refs['uploadBox'].$refs.upload.$refs[
        //   'upload-inner'
        // ].$refs.input.click()
      },
      async queryUserInfo() {
        const { username, nick, objectId, ACL, phone } = await this.$get_object(
          '_User',
          this.$route.params.userid
        )
        this.userinfo.objectId = objectId
        this.userinfo.username = username
        this.userinfo.nick = nick
        this.userinfo.objectId = objectId
        this.userinfo.phone = phone
      },
    },
  }
</script>
<style lang="scss" scoped>
  $base: '.personal-center';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;

    #{$base}-user-info {
      padding: $base-padding;
      text-align: center;

      ::v-deep {
        .el-avatar {
          img {
            cursor: pointer;
          }
        }
      }

      &-full-name {
        margin-top: 15px;
        font-size: 24px;
        font-weight: 500;
        color: #262626;
      }

      &-description {
        margin-top: 8px;
      }

      &-follow {
        margin-top: 15px;
      }

      &-list {
        margin-top: 18px;
        line-height: 30px;
        text-align: left;
        list-style: none;

        h5 {
          margin: -20px 0 5px 0;
        }

        ::v-deep {
          .el-tag {
            margin-right: 10px !important;
          }

          .el-tag + .el-tag {
            margin-left: 0;
          }
        }
      }
    }

    #{$base}-item {
      display: flex;

      i {
        font-size: 40px;
      }

      &-content {
        box-sizing: border-box;
        flex: 1;
        margin-left: $base-margin;

        &-second {
          margin-top: 8px;
        }
      }
    }
  }
  .userinfo {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #fff;
  }
</style>
