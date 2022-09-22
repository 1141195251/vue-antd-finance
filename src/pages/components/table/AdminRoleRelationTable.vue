<template>
  <a-table :data-source="data"
           :columns="Columns"
           rowKey="id"
           :pagination="{
                    current: pageNum,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showLessItems: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
                    onChange: onRPageChange,
                    onShowSizeChange: onRSizeChange,
                  }"
  >
    <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
    >
      <a-input
          v-ant-ref="c => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
      />
      <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
      >
        Search
      </a-button>
      <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
        Reset
      </a-button>
    </div>
    <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
    />
    <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
            v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
          >{{ fragment }}</mark
          >
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
      <template v-else>
        {{ text }}
      </template>
    </template>
  </a-table>
</template>
<script>
import {adminService as ds} from '@/services'

export default {
  name: 'AdminRoleRelationTable',
  data() {
    return {
      data: [],
      loading: false,
      pageNum: 1,
      pageSize: 8,
      total: 0,
      visible: false,
      Columns: [
        {
          title: '编号',
          dataIndex: 'id',
        },
        {
          title: '用户名',
          dataIndex: 'adminUsername',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
              record.adminUsername
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: '用户昵称',
          dataIndex: 'adminNickName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
              record.adminNickName
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          filters: [
            {
              text: '管理员',
              value: '管理员',
            },
            {
              text: '用户',
              value: '用户',
            },
          ],
          // specify the condition of filtering result
          onFilter: (value, record) => record.roleName.includes(value)
        },
      ],
      searchText: '',
      searchInput: null,
      searchedColumn: ''
    }
  },
  created() {
    this.getAdminRoleRelatList()
  },
  methods: {
    getAdminRoleRelatList() {
      this.loading = true
      const {pageNum, pageSize} = this
      // 发送请求
      ds.adminRoleRelationList({pageNum, pageSize}).then(result => {
        const {list, pageNum, pageSize, total} = result.data.data
        this.data = list
        this.pageNum = pageNum
        this.total = total
        this.pageSize = pageSize
        this.loading = false
      })
    },
    onRSizeChange(current, size) {
      if(size) {
        this.pageNum = 1
        this.pageSize = size
        this.getAdminRoleRelatList()
      }
    },
    onRPageChange(page, pageSize) {
      if(pageSize) {
        this.pageNum = page
        this.pageSize = pageSize
        this.getAdminRoleRelatList()
      }
    },
    showDrawer() {
      this.visible = true;
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
  }
}
</script>

<style scoped lang="less">
.table{
  background-color: @base-bg-color;
  padding: 24px;
}

.highlight {
  background-color: rgb(255, 192, 105);
}
</style>

