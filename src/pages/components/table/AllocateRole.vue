<template>
  <div>
    <a-input-search
        placeholder="输入用户名"
        enter-button="Search"
        size="large"
        @search="onSearch"
    />
    <a-transfer
        style="margin-top: 30px"
        :data-source="mockData"
        :rowKey="record => record.key"
        :titles="['角色库', '已分配']"
        :list-style="{
          width: '250px',
          height: '300px',
        }"
        :operations="['<', '>']"
        :target-keys="targetKeys"
        :render="item => `${item.title}`"
        @change="handleChange"
    >
      <span slot="notFoundContent">
        <a-empty
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
            :image-style="{
            height: '60px',
          }"
        >
          <span slot="description">
            <a>请确保输入正确的用户名</a>
          </span>
        </a-empty>
      </span>
    </a-transfer>
    <a-spin :spinning="loading">
      <a-button type="primary" style="margin-top: 20px" @click="handleSubmit">
        确定分配
      </a-button>
    </a-spin>
  </div>
</template>
<script>
import {adminService as ds} from '@/services'
export default {
  name: 'AllocateRole',
  data() {
    return {
      mockData: [],
      targetKeys: [],
      edittingUser: '',
      loading: false
    };
  },
  methods: {
    getMock(value) {
      const mockData = []
      const targetKeys = []
      ds.getRoleTransfer(value).then(res => {
        const {code, message, data} = res.data
        if(code === 200) {
          data.forEach(item => {
            if(item.chosen) {
              targetKeys.push(item.key)
            }
            mockData.push(item)
          })
          this.mockData = mockData
          this.targetKeys = targetKeys
        }else {
          this.$message.error(message)
        }
      }).catch(res => {
        this.$message.error(res)
      })
    },
    handleChange(targetKeys) {
      this.targetKeys = targetKeys;
    },
    onSearch(value) {
      this.edittingUser = value
      this.getMock(value)
    },
    handleSubmit() {
      const roleIds = []
      this.targetKeys.forEach(item => roleIds.push(item))
      console.log(roleIds)
      this.loading = true
      ds.updateRolesByUsername(this.edittingUser, roleIds).then(res => {
        const {code, message} = res.data
        if(code === 200) {
          this.$emit('triggerRefresh')
          this.$message.success(message)
        }else {
          this.$message.error(message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.$message.error('操作失败')
      })
    }
  }
};
</script>
