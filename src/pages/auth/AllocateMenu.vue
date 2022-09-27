<template>
  <div>
    <a-row>
      <a-col span="8">
        <a-auto-complete
          v-model="value"
          :data-source="dataSource"
          style="width: 200px"
          placeholder="input here"
          @select="onSelect"
          @search="onSearch"
        />
      </a-col>
      <a-col span="24">
        <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onExpand"
            @select="onSelect"
        />
      </a-col>
      <a-button type="primary" @click="onSubmit">确认分配</a-button>
    </a-row>
  </div>
</template>
<script>
import {adminService as ds} from '@/services'

export default {
  name: 'AllocateMenu',
  data() {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      data: [],
      treeData: [],
      value: '',
      dataSource: [],
      selectedRoleKey: -1,
      allocateRoleId: -1
    };
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val);
    },
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      ds.getMenuTreeList().then(res => {
        const {data, code, message} = res.data
        if(code === 200) {
          this.treeData = data
          console.log(this.treeData)
        }else {
          this.$message.error(message)
        }
      })
      ds.getRoleList().then(res => {
        const {data, code, message} = res.data
        if(code === 200) {
          this.data = data
          data.forEach(item => this.dataSource.push(item.name))
          console.log(this.dataSource)
        }else {
          this.$message.error(message)
        }
      })
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys) {
      console.log('onSelect(selectedKeys)', selectedKeys)
      if(typeof selectedKeys === 'string') {
        const val = this.data.find(item => item.name === selectedKeys)
        this.allocateRoleId = val.id
        const menuKey = []
        ds.getMenuByRoleId(val.id).then(res => {
          const {data, code, message} = res.data
          if(code === 200) {
            data.forEach(item => menuKey.push(item.id))
            console.log(data)
          }else {
            this.$message.error(message)
          }
        })
        this.checkedKeys = menuKey
        this.value = val.name
      }
    },
    onSearch() {

    },
    onSubmit() {
      ds.allocateMenu(this.allocateRoleId, this.checkedKeys).then(res => {
        const {code, message} = res.data
        if(code === 200) {
          this.$message.success(message)
        }else {
          this.$message.error(message)
        }
      })
    }
  },
};
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
