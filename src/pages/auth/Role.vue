<template>
  <a-card class="root">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form" @submit="handleSelect"  >
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="编号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input-number placeholder="请输入"
                                style="width: 100%"
                                v-decorator="['id', {rules: [{type: 'number', message: '必须是数字类型!' }]}]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入角色名称"
                                style="width: 100%"
                                v-decorator="['name']"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="状态"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="请选择"
                          v-decorator="['status']"
                >
                  <a-select-option value="0">禁用中</a-select-option>
                  <a-select-option value="1">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="调用次数"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input-number style="width: 100%" placeholder="请输入"
                                v-decorator="['adminCount', { rules: [{type: 'number', message: '必须是数字类型!' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="创建日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-date-picker style="width: 100%" placeholder="请输入更新日期"
                               v-decorator="['createTime', { rules: [{ type: 'date', message: '必须是日期!' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="描述"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入相关描述"
                         v-decorator="['description']"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button style="margin-left: 8px" @click="clearConditions">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-modal
            title="添加角色"
            :visible="addFormVisible"
            :confirm-loading="addFormConfirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            :mask="false"
        >
          <a-form :form="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="名称">
              <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入角色名称' }] }]"
              />
            </a-form-item>
            <a-form-item label="描述">
              <a-input
                  v-decorator="['description', { rules: [{ required: true, message: '简单描述下角色的作用吧' }] }]"
              />
            </a-form-item>
            <a-form-item label="状态">
              <a-select
                  v-decorator="['status']"
                  placeholder="选择一个初始化状态"
              >
                <a-select-option value="1">
                  启用
                </a-select-option>
                <a-select-option value="0">
                  禁用
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
        <a-button type="primary" @click.prevent="showModal">新建</a-button>
        <a-button >批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </a-space>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          rowKey="id"
          :selectedRows.sync="selectedRows"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
          :pagination="{
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showLessItems: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
            onChange: onPageChange,
            onShowSizeChange: onSizeChange
            }"
      >
        <template
            v-for="(col, index) in ['name', 'description']"
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
        <template
            v-slot:adminCount="{text, record}"
        >
          <span key="adminCount">
            <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.id, 'adminCount')"
            />
            <template v-else>
              {{text}}次
            </template>
          </span>
        </template>
        <template v-slot:action="{text, record}" >
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
              v-if="dataSource.length"
              title="确定要删除吗?小伙子"
              @confirm="() => onDelete(record.id)"
          >
            <a>Delete</a>
          </a-popconfirm>
          <a-divider type="vertical" />
        </template>
        <template slot="statusTitle">
          <a-popover>
            <template slot="content">
              <span>状态</span>
            </template>
            <a-icon @click.native="onStatusTitleClick" type="info-circle" />
          </a-popover>
        </template>
        <template v-slot:status="{text, record}" >
        <span key="status">
          <a-switch :default-checked="text ? true : false"
                    v-if="record.editable"
                    style="margin: -5px 0"
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
          </template>
        </span>
        </template>

        <template v-slot:time="{text}">
          {{text | datefmt('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {adminService as ds} from '@/services'


export default {
  name: 'Role',
  components: {StandardTable},
  data () {
    return {
      datasource: [],
      loading: false,
      advanced: true,
      pageNum: 1,
      editingKey: '',
      cacheData: [],
      pageSize: 10,
      total: 0,
      form: this.$form.createForm(this),
      conditions: {},
      columns: [
        {
          title: '编号',
          dataIndex: 'id'
        },
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '描述',
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: '服务调用次数',
          dataIndex: 'adminCount',
          sorter: true,
          needTotal: true,
          scopedSlots: {customRender: 'adminCount'}
        },
        {
          dataIndex: 'status',
          needTotal: true,
          slots: {title: 'statusTitle'},
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: {customRender: 'time'}
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: 200
        }
      ],
      dataSource: [],
      selectedRows: [],
      addForm: this.$form.createForm(this, {name: 'addRole'}),
      addFormVisible: false,
      addFormConfirmLoading: false,
    }
  },
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
  created () {
    this.initData()
  },
  authorize: {
    onDelete: {
      check: 'delete',
      type: 'role'
    }
  },
  methods: {
    initData() {
      this.loading = true
      const {pageNum, pageSize, conditions} = this
      ds.getAllRoles({pageNum, pageSize, ...conditions}).then(res => {
        const {code, message} = res.data
        if(code === 200) {
          const {list, pageNum, pageSize, total} = res.data.data
          this.pageNum = pageNum
          this.total = total
          this.pageSize = pageSize
          this.dataSource = list
          this.cacheData = this.dataSource.map(item => ({ ...item }))
          this.loading = false
        }else {
          this.$message.error(message)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    onRefresh(conditions) {
      this.conditions = conditions
      this.initData()
    },
    handleChange(value, key, column) {
      // 获取到数据源
      const newData = [...this.dataSource]
      // 从数据源中找出当前的的一条行记录
      const target = newData.find(item => key === item.id);
      // 如果能找到 将修改的值赋给行记录的列字段
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
    },
    handleChangeSwitch(value, key, column) {
      // 获取到数据源
      const newData = [...this.dataSource];
      // 从数据源中找出当前的一条行记录
      const target = newData.find(item => key === item.id);
      // 如果能找到 将修改的值赋给行记录的列字段
      if (target) {
        target[column] = this.$options.filters['statusStr'](value);
        this.dataSource = newData;
      }
    },
    edit(key) {
      const newData = [...this.dataSource];
      const target = newData.find(item => key === item.id);
      this.editingKey = key;
      // 将触发目标行的输入框
      if (target) {
        // 打开输入框
        target.editable = true;
        this.dataSource = newData;
      }
    },
    onDelete(key) {
      ds.deleteRoleById(key).then(res => {
        const {code, message} = res.data
        if(code === 200) {
          this.$message.success(message)
          this.$nextTick(() => {
            this.onRefresh()
          })
        }else {
          this.$message.error(message)
        }
      })
    },
    save(key) {
      // 获取最新的数据（包含刚输入的值但未保存）
      const newData = [...this.dataSource];
      // 从缓存数据获取到又一个新的数据
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => key === item.id);
      const targetCache = newCacheData.find(item => key === item.id);
      if (target && targetCache) {
        delete target.editable;
        this.dataSource = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
        ds.updateRoleById(key, target).then(res => {
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
      const newData = [...this.dataSource];
      const target = newData.find(item => key === item.id);
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.find(item => key === item.id));
        delete target.editable;
        this.dataSource = newData;
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange() {
      this.$message.info('表格状态改变了')
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    handleSelect(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.conditions = values
          this.initData()
        }
      })
    },
    clearConditions() {
      this.form.resetFields()
    },
    handleMenuClick (e) {
      if (e.key === 'delete') {
        this.remove()
      }
    },
    onSizeChange(current, size) {
      this.pageNum = 1
      this.pageSize = size
      this.initData()
    },
    onPageChange(page, pageSize) {
      this.pageNum = page
      this.pageSize = pageSize
      this.initData()
    },
    showModal() {
      this.addFormVisible = true;
    },
    handleOk() {
      this.addFormConfirmLoading = true;
      this.addForm.validateFields((err, values) => {
        if (!err) {
          ds.addRole(values).then(res => {
            const {code, message} = res.data
            if(code === 200) {
              this.$message.success(message)
            }else {
              this.$message.error(message)
            }
          })
        }
      })
      this.addForm.resetFields()
      this.addFormVisible = false;
      this.addFormConfirmLoading = false;
      this.onRefresh()
    },
    handleCancel() {
      this.addFormVisible = false;
      this.addForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.search{
  margin-bottom: 54px;
}
.fold{
  width: calc(100% - 216px);
  display: inline-block
}
.operator{
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
