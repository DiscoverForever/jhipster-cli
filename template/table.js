module.exports.generateEntityTable = (entityName) => {
  return `<template>
  <div>
    <el-button-group>
      <el-button type="primary" size="medium" :plain="true">添加行</el-button>
      <el-button type="primary" size="medium" :plain="true">删除行</el-button>
      <el-button type="primary" size="medium" :plain="true">添加列</el-button>
      <el-button type="primary" size="medium" :plain="true">查询</el-button>
      <el-button type="primary" size="medium" :plain="true">刷新</el-button>
      <el-button type="primary" size="medium" :plain="true">其他</el-button>
    </el-button-group>
    <el-table ref="multipleTable" :stripe="true" :border="true" :data="tableData" height="550" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination background layout="prev, pager, next" :total="20">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AV from 'leancloud-storage';

export default {
  data() {
    return {
      tableData: [],
    }
  },
  props: {
    entityName: {
      type: String,
      required: true,
      default: '${entityName}'
    }
  },
  created() {
    this.queryEntityData();
  },
  methods: {
    async queryEntityData() {
      const ${entityName}Query = new AV.Query('${entityName}');
      const tableDataList = await ${entityName}Query.find();
      this.tableData = tableDataList.filter(item => item.toJSON());
    }
  }
}
</script>

<style scoped>
.block {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>`;
}

