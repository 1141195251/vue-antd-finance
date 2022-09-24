<template>
  <div class="table">
    <advance-table
        :columns="columns"
        :data-source="data"
        title="用户数据"
        :loading="loading"
        rowKey="id"
        @search="onSearch"
        @refresh="onRefresh"
        :format-conditions="true"
        @reset="onReset"
        :pagination="{
        current: page,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
    >
      <template
          v-for="(col, index) in ['email', 'nickName', 'note']"
          :slot="col"
          slot-scope="{text, record}"
      >
        <span :key="col">
          <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </span>
      </template>
      <template slot="statusTitle">
        状态<a-icon style="margin: 0 4px" type="info-circle" />
      </template>
      <!-- TODO 对头像地址过滤渲染  -->
      <template slot="icon" slot-scope="{text}">
        <a-avatar style="backgroundColor:#87d068" shape="square" :size="50" icon="user" :src="text"/>
      </template>-
      <template v-slot:status="{text, record}" >
        <span key="status">
          <a-switch
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :default-checked="text ? true: false"
                    @change="e => handleChangeSwitch(e, record.id, 'status')">
            <a-icon slot="checkedChildren" type="check" />
            <a-icon slot="unCheckedChildren" type="close" />
          </a-switch>
          <template v-else>
            <span v-if="text">
              <a-badge status="success" />
            </span>
            <span v-else >
              <a-badge status="error" />
            </span>
            {{text | statusStr}}
          </template>
        </span>
      </template>
      <template v-slot:time="{text}">
        {{text | datefmt('YYYY-MM-DD HH:mm:ss')}}
      </template>
      <template v-slot:action="{text, record}">
        <span v-if="record.editable" class="editable-row-operations">
          <a @click="() => save(record.id)">Save</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定要取消吗?" @confirm="() => cancel(record.id)">
            <a>Cancel</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.id)">Edit</a>
        </span>
        <a-divider type="vertical" />
        <a-popconfirm
            v-if="data.length"
            title="确定要删除吗?小伙子"
            @confirm="() => onDelete(record.id)"
        >
          <a>Delete</a>
        </a-popconfirm>
        <a-divider type="vertical" />
      </template>
    </advance-table>
    <div>
      <a-button type="primary" @click="showDrawer"> <a-icon type="plus" /> New account </a-button>
      <a-drawer
          title="新建一个用户"
          :width="720"
          :visible="visible"
          :body-style="{ paddingBottom: '80px' }"
          @close="onClose"
      >
        <a-form :form="addForm" layout="vertical"
                hide-required-mark>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="用户名">
                <a-input
                    v-decorator="[
                  'username',
                  {
                    rules: [{ required: true, message: '请输入用户名' }],
                  },
                ]"
                    placeholder="请输入用户名"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="密码">
                <a-input
                    v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: '请输入密码' },
                    {min: 6,max: 25,message: '密码长度在6-25个字符之间',trigger: 'blur'}],
                  },
                ]"
                    style="width: 100%"
                    placeholder="请输入密码"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="邮箱">
                <a-input
                    v-decorator="[
                  'email',
                  {
                    rules: [
                              { required: true, message: '请填写邮箱', trigger: 'blur' },
                              { type: 'string',
                                message: '邮箱格式不正确',
                                trigger: 'blur',
                                transform (value) {
                                  if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) {
                                    return true
                                  }else{
                                  }
                                }
                              },
                              { type: 'string', message: '长度不能超过30位', trigger: 'blur', max: 30 }
                            ],
                  },
                ]"
                    placeholder="请输入邮箱"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="昵称">
                <a-input
                    v-decorator="[
                  'nickName',
                  {
                    rules: [{ required: false, message: '请输入昵称' }],
                  },
                ]"
                    placeholder="请输入昵称"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="描述">
                <a-textarea
                    v-decorator="[
                  'note',
                  {
                    rules: [{ required: false, message: '请输入描述' }],
                  },
                ]"
                    :rows="4"
                    placeholder="请输入描述"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div
            :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
        >
          <a-spin :spinning="addSpinning">
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
              Cancel
            </a-button>
            <a-button type="primary" @click="handleAddSubmit">
              Submit
            </a-button>
          </a-spin>
        </div>
      </a-drawer>
    </div>
    <a-divider />
    <a-row>
      <a-col span="10">
        <a-card title="用户与角色" type="inner">
          <a slot="extra" href="#">more</a>
          <AdminRoleRelationTable ref="relationTable"/>
        </a-card>
      </a-col>
      <a-col span="13" style="margin-left: 30px">
        <allocate-role @triggerRefresh="triggerRefresh" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import AdvanceTable from '@/components/table/advance/AdvanceTable'
import AdminRoleRelationTable from './AdminRoleRelationTable'
import AllocateRole from './AllocateRole'
import {adminService as ds} from '@/services'


export default {
  name: 'Table',
  components: {AllocateRole, AdvanceTable, AdminRoleRelationTable},
  filters: {
    statusStr(val) {
      switch (val) {
        case 0:
          return '禁用中'
        case 1:
          return '启用中'
        case false:
          return 0
        case true:
          return 1
      }
    }
  },
  data() {
    return {
      data: [],
      cacheData: [],
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      visible: false,
      addForm: this.$form.createForm(this),
      addSpinning: false,
      editingKey: '',
      columns: [
        {
          title: '头像',
          dataIndex: 'icon',
          key: 'icon',
          scopedSlots: {customRender: 'icon'} // 使用在具体的插槽上传进列内容进行再次加工渲染
        },
        {
          title: '用户名',
          dataIndex: 'username',
          searchAble: true,
          key: 'username'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          searchAble: true,
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '昵称',
          dataIndex: 'nickName',
          key: 'nickName',
          searchAble: true,
          scopedSlots: { customRender: 'nickName' }
        },
        {
          title: '备注',
          dataIndex: 'note',
          key: 'note',
          scopedSlots: { customRender: 'note' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          dataType: 'date',
          searchAble: true,
          key: 'createTime',
          scopedSlots: {
            customRender: 'time'
          }
        },
        {
          title: '登录时间',
          dataIndex: 'loginTime',
          key: 'loginTime',
          dataType: 'date',
          scopedSlots: {
            customRender: 'time'
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          searchAble: true,
          dataType: 'select',
          key: 'status',
          slots: {title: 'statusTitle'},
          scopedSlots: {customRender: 'status'},
          search: {
            selectOptions: [
              {title: '禁用中', value: 0},
              {title: '启用中', value: 1}
            ]
          }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        },
      ],
      conditions: {},
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    // 获取用户列表
    getGoodList() {
      this.loading = true
      const {page, pageSize, conditions} = this
      // 发送请求
      ds.superDataSource({page, pageSize, ...conditions}).then(result => {
        const {code, message} = result.data
        if(code === 200) {
          const {list, pageNum, pageSize, total} = result.data.data
          this.data = list
          this.cacheData = this.data.map(item => ({ ...item }))
          this.page = pageNum
          this.total = total
          this.pageSize = pageSize
          this.loading = false
        }else {
          this.$message.error(message)
          this.loading = false
        }
      }).catch(()=> {
        this.$message.error('操作失败')
        this.loading = false
      })
    },
    onSearch(conditions) {
      this.page = 1
      this.conditions = conditions
      this.getGoodList()
    },
    onRefresh(conditions) {
      this.conditions = conditions
      this.getGoodList()
    },
    onReset(conditions) {
      this.conditions = conditions
      this.getGoodList()
    },
    onSizeChange(current, size) {
      this.page = 1
      this.pageSize = size
      this.getGoodList()
    },
    onPageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.getGoodList()
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.loading = false;
    },
    onDelete(key) {
      ds.deleteById(key).then(res => {
        const {code, message} = res.data
        if(code === 200) {
          this.$message.success(message)
          this.$nextTick(() => {
            this.onRefresh(null)
          })
        }else {
          this.$message.error(message)
        }
      })
    },
    handleAddSubmit(e) {
      e.preventDefault();
      this.addForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.addSpinning = true
          ds.register(values).then(res => {
            if(res.data.code === 200) {
              this.$message.success(res.data.message)
              this.onClose()
              this.addSpinning = false
              this.loading = false
              this.$nextTick(() => {
                this.onRefresh(null)
              })
            }else {
              this.$message.error(res.data.message)
              this.addSpinning = false
              this.loading = false
            }
          })
        }
      })
    },
    // 输入时变化的操作
    handleChange(value, key, column) {
      // 获取到数据源
      const newData = [...this.data]
      // 从数据源中找出当前的的一条行记录
      const target = newData.find(item => key === item.id);
      // 如果能找到 将修改的值赋给行记录的列字段
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    handleChangeSwitch(value, key, column) {
      // 获取到数据源
      const newData = [...this.data];
      // 从数据源中找出当前的的一条行记录
      const target = newData.find(item => key === item.id);
      // 如果能找到 将修改的值赋给行记录的列字段
      if (target) {
        console.log(value)
        target[column] = this.$options.filters['statusStr'](value)
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.id);
      this.editingKey = key;
      // 将触发目标行的输入框
      if (target) {
        // 打开输入框
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      // 获取最新的数据（包含刚输入的值但未保存）
      const newData = [...this.data];
      // 从缓存数据获取到又一个新的数据
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => key === item.id);
      const targetCache = newCacheData.find(item => key === item.id);
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
        ds.updateById(key, target).then(res => {
          const {code, message} = res.data
          if(code === 200) {
            this.$message.success(message)
          }else {
            this.$message.error(message)
          }
        })
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.id);
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.find(item => key === item.id));
        delete target.editable;
        this.data = newData;
      }
    },
    triggerRefresh() {
      // 触发关系表组件更新数据
      this.$refs.relationTable.getAdminRoleRelatList()
    }
  }
}
</script>

<style scoped lang="less">
.table{
  background-color: @base-bg-color;
  padding: 24px;
}
.myrow{
  margin: 0 -8px
}
.editable-row-operations a {
  margin-right: 2px;
}
.ant-col-md-12,
.ant-col-sm-24,
.ant-col-lg-6,
.ant-col-lg-8,
.ant-col-lg-10,
.ant-col-xl-8,
.ant-col-xl-6{
  padding: 0 8px
}
.card{
  margin-bottom: 24px;
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
