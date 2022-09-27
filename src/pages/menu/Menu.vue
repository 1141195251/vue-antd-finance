<template>
  <div>
    <a-row class="operator">
      <a-space size="8">
        <a-button type="primary" @click="showAddForm">新建</a-button>
        <a-modal title="添加一个菜单"
                 @ok="addMenu"
                 @cancel="handleAddFormCancel"
                 :visible="addFormVisible"
                 :confirm-loading="addConfirmLoading"
        >
          <a-form :form="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="父菜单">
              <a-select
                  show-search
                  placeholder="请输入父菜单名称"
                  style="width: 200px"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  v-decorator="['parentId', { rules: [{ required: true, message: '需要填写父菜单' }] }]"
                  @change="onChange"
              >
                <a-select-option v-for="d in editingParentData" :key="d.id" >
                  {{ d.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="名称">
              <a-input
                  v-decorator="['title', { rules: [{ required: true, message: '需要填写名称' }] }]"
              />
            </a-form-item>
            <a-form-item label="地址">
              <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '需要填写菜单地址' }] }]"
              />
            </a-form-item>
            <a-form-item label="图标">
              <a-input
                  v-decorator="['icon', { rules: [{ required: true, message: '需要填写图标' }] }]"
              />
            </a-form-item>
            <a-form-item label="隐藏">
              <a-select
                  v-decorator="['hidden']"
                  placeholder="选择是否隐藏菜单"
              >
                <a-select-option value="1">
                  隐藏
                </a-select-option>
                <a-select-option value="0">
                  可见
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
      </a-space>
    </a-row>
    <a-row class="row">
      <a-table
          :columns="columns"
          :data-source="data"
          :row-selection="rowSelection"
          rowKey="id"
      >
        <template v-slot:action="text, record" >
          <a @click="() => showModal(record)">Edit</a>
          <a-modal
              :mask="false"
              title="编辑菜单"
              :visible="visible"
              :confirm-loading="confirmLoading"
              :forceRender="forceRender"
              @ok="handleOk"
              @cancel="handleCancel"
          >
            <a-form :form="editingForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <a-form-item label="编号">
                <a-input
                    v-decorator="['id']"
                    disabled
                />
              </a-form-item>
              <a-form-item label="父菜单">
                <a-select
                    show-search
                    placeholder="请输入父菜单名称"
                    style="width: 200px"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    v-decorator="['parentId']"
                    @change="onChange"
                >
                  <a-select-option v-for="d in editingParentData" :key="d.id" >
                    {{ d.title }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="名称">
                <a-input
                    v-decorator="['title']"
                />
              </a-form-item>
              <a-form-item label="地址">
                <a-input
                    v-decorator="['name']"
                />
              </a-form-item>
              <a-form-item label="图标">
                <a-input
                    v-decorator="['icon']"
                />
              </a-form-item>
              <a-form-item label="隐藏">
                <a-select
                    @change="onChange"
                    v-decorator="['hidden']"
                    placeholder="选择是否隐藏菜单"
                >
                  <a-select-option value="1">
                    隐藏
                  </a-select-option>
                  <a-select-option value="0">
                    可见
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-modal>
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
      </a-table>
    </a-row>
  </div>
</template>

<script>
import {adminService as ds} from '@/services'

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

export default {
  data() {
    return {
      data: [],
      editingParentData:[],
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '名称',
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '父菜单',
          dataIndex: 'parentId',
          scopedSlots: { customRender: 'parentId' }
        },
        {
          title: '级别',
          dataIndex: 'level',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '路径',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '图标',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: 'hidden',
          dataIndex: 'hidden',
          scopedSlots: { customRender: 'hidden' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: 200
        }
      ],
      visible: false,
      confirmLoading: false,
      forceRender: true,
      editingKey: -1,
      editingForm: this.$form.createForm(this, {name: 'editingForm'}),
      addForm: this.$form.createForm(this, {name: 'addForm'}),
      addFormVisible: false,
      addConfirmLoading: false,
      rowSelection
    }
  },
  created() {
    this.getMenuTreeList()
  },
  methods: {
    getMenuTreeList() {
      ds.getMenuTreeList().then(res => {
        const {code, message, data} = res.data
        if(code === 200) {
          this.data = data
        }else {
          this.$message.error(message)
        }
      })
    },
    onDelete(key) {
      console.log('onDelete(key)', key)
      ds.deleteMenuById(key).then(res => {
        const {code, message} = res.data
        if(code === 200) {
          this.$message.success(message)
          this.onRefresh()
        }else {
          this.$message.error(message)
        }
      })
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
    showModal(record) {
      ds.getMenuName().then(res => {
        const {code, data} = res.data
        if(code === 200) {
          this.editingParentData = data
          this.editingParentData.unshift({id: 0, title: '根菜单'})
        }
      }).then(() => {
        this.editingForm.setFieldsValue({
          id: record.id,
          // TODO 应该内连接查询添加父菜单名称字段
          parentId: record.parentId,
          title: record.title,
          name: record.name,
          icon: record.icon,
          hidden: record.hidden
        })
        this.visible = true
      })

    },
    handleOk() {
      this.confirmLoading = true
      this.editingForm.validateFields((err, values) => {
        if(!err) {
          ds.updateMenuById(values).then(res => {
            const {code, message} = res.data
            if(code === 200) {
              this.onRefresh()
              this.$message.success(message)
            }else {
              this.$message.error(message)
            }
          })
        }
      })
      this.visible = false;
      this.confirmLoading = false
      this.getMenuTreeList()
    },
    handleCancel() {
      this.visible = false;
    },
    onRefresh() {
      this.getMenuTreeList()
    },
    onChange() {
      this.forceRender = false
      this.$nextTick(() => {
        this.forceRender = true
      })
    },
    showAddForm() {
      ds.getMenuName().then(res => {
        const {code, data} = res.data
        if(code === 200) {
          this.editingParentData = data
          this.editingParentData.unshift({id: 0, title: '根菜单'})
        }
      })
      console.log(this.editingParentData)
      this.addFormVisible = true
    },
    addMenu() {
      this.addForm.validateFields((err, values) => {
        console.log(values)
        if(!err) {
          ds.addMenu(values).then(res => {
            const {code, message} = res.data
            if(code === 200) {
              this.$message.success(message)
              this.onRefresh()
            }else {
              this.$message.error(message)
            }
          })
        }
        this.addFormVisible = false
      })
    },
    handleAddFormCancel() {
      this.addFormVisible = false
    }

  }
}
</script>

<style scoped lang="less">
.operator{
  margin-bottom: 18px;
}
.row{
  height: 100%;
  background-color: @base-bg-color;
  text-align: center;
  border-radius: 4px;
  //margin-top: -24px;
  h1{
    font-size: 48px;
  }
}
</style>
