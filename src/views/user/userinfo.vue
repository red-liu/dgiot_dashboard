<template>
  <div class="userinfo">
    <div class="personal-center-container">
      <el-row :gutter="20">
        <el-col :lg="12" :md="12" :sm="24" :xl="8" :xs="24">
          <el-card shadow="hover">
            <div class="personal-center-user-info">
              <el-avatar
                :size="100"
                :src="avatar"
                @click.native="uploadCkick('userinfo.avatar')"
              />
              <vab-input ref="uploadFinish" @fileInfo="fileInfo" />
              <ul class="personal-center-user-info-list">
                <li>
                  <vab-icon icon="user-2-line" />
                  {{ username }}
                </li>
                <li>
                  <vab-icon icon="user-3-line" />
                  {{ nick }}
                </li>
                <li>
                  <vab-icon icon="women-line" />
                  {{ userinfo.sex }}
                </li>
                <li>
                  <vab-icon icon="phone-line" />
                  {{ userinfo.phone }}
                </li>
                <li>
                  <vab-icon icon="file-text-line" />
                  {{ userinfo.description }}
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="12" :md="12" :sm="24" :xl="16" :xs="24">
          <el-card shadow="hover">
            <el-tabs v-model="activeName">
              <el-tab-pane label="个人信息" name="first">
                <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                  <el-form
                    ref="userinfo"
                    :rules="registerRules"
                    label-width="80px"
                    :model="userinfo"
                  >
                    <el-form-item label="姓名">
                      <el-input v-model="username" />
                    </el-form-item>
                    <el-form-item label="昵称">
                      <el-input v-model="nick" />
                    </el-form-item>
                    <!-- <el-form-item label="objectId">
                      <el-input v-model="userinfo.objectId" disabled />
                    </el-form-item> -->
                    <el-form-item label="性别">
                      <el-select v-model="userinfo.sex" style="width: 100%">
                        <el-option label="保密" value="保密" />
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="绑定手机" prop="phone">
                      <el-input v-model="userinfo.phone" />
                    </el-form-item>
                    <el-form-item label="个人简介">
                      <el-input
                        v-model="userinfo.description"
                        type="textarea"
                      />
                    </el-form-item>
                    <el-form-item label="重置密码">
                      <el-input v-model="password" />
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
                  <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                    <el-form
                      ref="companyinfo"
                      label-width="120px"
                      :model="companyinfo"
                    >
                      <el-form-item label="企业名称">
                        <el-input v-model="companyinfo.name">
                          <template slot="prepend">
                            <vab-icon
                              icon="community-fill"
                              style="color: #3492ed"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="企业logo">
                        <el-input v-model="companyinfo.logo" readonly disabled>
                          <template slot="prepend">
                            <vab-icon
                              icon="remixicon-fill"
                              style="color: #3492ed"
                            />
                          </template>
                          <template slot="append">
                            <vab-icon
                              icon="chat-upload-fill"
                              style="color: #3492ed"
                              @click="uploadCkick('companyinfo.logo')"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="登录提示欢迎语">
                        <el-input v-model="companyinfo.title">
                          <template slot="prepend">
                            <vab-icon icon="text" style="color: #3492ed" />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="企业版权信息">
                        <el-input v-model="companyinfo.Copyright">
                          <template slot="prepend">
                            <vab-icon
                              icon="copyright-fill"
                              style="color: #3492ed"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="首页背景图">
                        <el-input
                          v-model="companyinfo.backgroundimage"
                          readonly
                          disabled
                        >
                          <template slot="prepend">
                            <vab-icon
                              icon="bank-card-line"
                              style="color: #3492ed"
                            />
                          </template>
                          <template slot="append">
                            <vab-icon
                              icon="chat-upload-fill"
                              style="color: #3492ed"
                              @click="
                                uploadCkick('companyinfo.backgroundimage')
                              "
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="侧边栏展开图">
                        <el-input v-model="companyinfo._mimg" readonly disabled>
                          <template slot="prepend">
                            <vab-icon
                              icon="bank-card-line"
                              style="color: #3492ed"
                            />
                          </template>
                          <template slot="append">
                            <vab-icon
                              icon="chat-upload-fill"
                              style="color: #3492ed"
                              @click="uploadCkick('companyinfo._mimg')"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="侧边栏收起图">
                        <el-input
                          v-model="companyinfo._pcimg"
                          readonly
                          disabled
                        >
                          <template slot="prepend">
                            <vab-icon
                              icon="bank-card-line"
                              style="color: #3492ed"
                            />
                          </template>
                          <template slot="append">
                            <vab-icon
                              icon="chat-upload-fill"
                              style="color: #3492ed"
                              @click="uploadCkick('companyinfo._pcimg')"
                            />
                          </template>
                        </el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="onSubmit">
                          保存
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { isPhone, isUrl } from '@/utils/validate'
  import { putUser } from '@/api/User'
  import { putProject } from '@/api/Project'
  export default {
    name: 'Userinfo',
    components: {},
    data() {
      const validatePhone = (rule, value, callback) => {
        if (value && !isPhone(value)) {
          callback(new Error(this.$translateTitle('请输入正确的手机号')))
        } else {
          callback()
        }
      }
      return {
        channeindex: 0,
        password: '',
        registerRules: {
          phone: [
            {
              required: false,
              trigger: 'blur',
              message: this.$translateTitle('请输入手机号'),
            },
            { validator: validatePhone, trigger: 'blur' },
          ],
        },
        filetype: '',
        objectId: '',
        dialogVisible: false,
        activeName: 'first',
        userinfo: {
          sex: '女',
          description: '',
        },
        username: '',
        nick: '',
        phone: '',
        companyinfo: {
          name: '',
          logo: '',
          title: '',
          Copyright: '',
          backgroundimage: '',
        },
        upNodeType: '',
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        token: 'user/token',
        _pcimg: 'dashboard/_pcimg',
        _mimg: 'dashboard/_mimg',
        Default: 'acl/Default',
        ObjectId: 'user/objectId',
        theme: 'settings/theme',
      }),
    },
    mounted() {
      this.$nextTick(() => {
        if (this.ObjectId) this.queryUserInfo(this.ObjectId)
      })
    },
    methods: {
      ...mapMutations({
        setAvatar: 'user/setAvatar',
        setlogo: 'user/setlogo',
        setBackgroundimage: 'user/setBackgroundimage',
        setname: 'user/setname',
        setcopyright: 'user/setCopyright',
        set_pcimg: 'dashboard/set_pcimg',
        set_mimg: 'dashboard/set_mimg',
      }),
      fileInfo(info) {
        console.log('uploadFinish', info)
        let type = this.upNodeType
        console.log('upNodeType', this[type])
        this[type] = info.url
        switch (type) {
          case 'userinfo.avatar':
            this.userinfo.avatar = info.url
            this.setAvatar(info.url)
            break
          case 'companyinfo._pcimg':
            this.set_pcimg(info.url)
            this.companyinfo._pcimg = info.url
            break
          case 'companyinfo._mimg':
            this.companyinfo._mimg = info.url
            this.set_mimg(info.url)
            break
          case 'companyinfo.logo':
            this.companyinfo.logo = info.url
            this.setlogo(info.url)
            break
          case 'companyinfo.backgroundimage':
            this.setBackgroundimage(info.url)
            putProject(this.Default.objectId, { background: info.url })
              .then((res) => {
                console.log(res)
                this.$baseMessage(
                  this.$translateTitle('保存成功'),
                  'success',
                  false,
                  'vab-hey-message-success'
                )
              })
              .catch((e) => {
                console.log(e)
                this.$baseMessage(
                  this.$translateTitle('保存失败' + e),
                  'success',
                  false,
                  'vab-hey-message-success'
                )
              })
            break
          default:
            console.log('type', this.filetype)
            break
        }
        this.$forceUpdate()
        this.onSubmit()
      },
      async onSubmit() {
        this.setname(this.companyinfo.name)
        this.setcopyright(this.companyinfo.Copyright)
        if (this.userinfo.phone.length != 0 && !isPhone(this.userinfo.phone)) {
          this.$refs['userinfo'].validateField('phone')
          return
        }
        if (
          this.companyinfo.logo.length == 0 &&
          !isUrl(this.companyinfo.logo)
        ) {
          this.$baseMessage(
            this.$translateTitle('logo链接地址非url类型'),
            'error',
            false,
            'vab-hey-message-error'
          )
          return
        }
        if (
          this.companyinfo.backgroundimage.length == 0 &&
          !isUrl(this.companyinfo.backgroundimage)
        ) {
          this.$baseMessage(
            this.$translateTitle('背景图链接地址非url类型'),
            'error',
            false,
            'vab-hey-message-error'
          )
          return
        }

        let pamams = {
          tag: {
            companyinfo: this.companyinfo,
            userinfo: this.userinfo,
            theme: this.theme,
          },
          nick: this.nick,
          username: this.username,
          phone: this.userinfo.phone,
        }
        if (this.password) {
          pamams['password'] = this.password
        }
        const res = await putUser(this.objectId, pamams)
        if (res)
          this.$baseMessage(
            this.$translateTitle('保存成功'),
            'success',
            false,
            'vab-hey-message-success'
          )
      },
      uploadCkick(type) {
        this.upNodeType = type
        // 触发子组件的点击事件
        this.$refs['uploadFinish'].$refs.uploader.dispatchEvent(
          new MouseEvent('click')
        )
      },

      async queryUserInfo(ObjectId) {
        const {
          username,
          nick,
          phone,
          objectId,
          tag = {
            companyinfo: {
              backgroundimage: '',
              name: '',
              logo: '',
              title: '',
              Copyright: '',
            },
            userinfo: {},
            theme: {},
          },
        } = await this.$get_object('_User', ObjectId)
        this.userinfo = tag.userinfo
        this.objectId = objectId
        this.username = username
        this.nick = nick
        this.phone = phone
        this.userinfo.phone = this.phone
        this.companyinfo = Object.assign(tag.companyinfo, {
          _pcimg: this._pcimg || '',
          _mimg: this._mimg || '',
        })
        console.log('this.companyinfo', tag.companyinfo)
      },
    },
  }
</script>
<style lang="scss" scoped>
  $base: '.personal-center';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
    i {
      cursor: pointer;
    }
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
