<template>
  <div>
    <el-button-group>
      <el-button type="primary" size="medium" :plain="true">添加行</el-button>
      <el-button type="primary" size="medium" :plain="true">删除行</el-button>
      <el-button type="primary" size="medium" :plain="true">添加列</el-button>
      <el-button type="primary" size="medium" :plain="true">查询</el-button>
      <el-button type="primary" size="medium" :plain="true">刷新</el-button>
      <el-button type="primary" size="medium" :plain="true">其他</el-button>
    </el-button-group>
    <div class="table-wrapper">
    <el-table class="table" ref="multipleTable" :stripe="true" :border="true" :data="tableData" height="550" tooltip-effect="dark" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="250" prop="objectId" label="objectId"></el-table-column>
      <%_ entity.body.forEach(prop => { _%>
      <el-table-column width="120" prop="<%=prop.name%>" label="<%=prop.javadoc%>"></el-table-column>
      <%_ })_%>
      <el-table-column width="200" prop="createdAt" label="创建时间" :formatter="formatterDate"></el-table-column>
      <el-table-column width="200" prop="updatedAt" label="更新时间" :formatter="formatterDate"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="$router.push({path: '/entities/<%=entity.name%>/<%=entity.name%>-add.g.vue', query: {objectId: scope.row.objectId}})" type="text" size="small">查看</el-button>
          <el-button @click="$router.push({path: '/entities/<%=entity.name%>/<%=entity.name%>-edit.g.vue', query: {objectId: scope.row.objectId}})" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>  
    </div>
    <div class="block">
      <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="[20, 50, 100, 200, 300, 400]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
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
      pageNumber: 1,
      pageSize: 20,
      total: 0
    }
  },
  created() {
    this.queryEntityData();
  },
  methods: {
    async queryEntityData(skip = 0, limit = 20) {
      const <%=entity.name%>Query = new AV.Query('<%=entity.name%>');
      <%=entity.name%>Query.skip(skip);
      <%=entity.name%>Query.limit(limit);
      const tableDataList = await <%=entity.name%>Query.find();
      this.tableData = tableDataList.map(item => item.toJSON());
      this.total = await (new AV.Query('<%=entity.name%>').count());
    },
    handleSelectionChange() {
      
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    formatterDate(row, column, cellValue) {
      return cellValue.split('.')[0].replace(/[a-zA-Z]/g, '\n')
    },
    create() {
      
    },
    delete() {

    }
  },
  watch: {
    'pageSize'() {
      this.queryEntityData((this.pageNumber - 1) * this.pageSize, this.pageSize)
    },
    'pageNumber'() {
      this.queryEntityData((this.pageNumber  - 1) * this.pageSize, this.pageSize)
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
.table-wrapper {
  padding: 20px;
  box-sizing: border-box;
}
.el-button-group {
  padding: 10px 20px;
}
</style>