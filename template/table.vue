<template>
  <div>
    <el-button-group>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-circle-plus-outline" @click="handleCreate">创建</el-button>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button type="primary" size="medium" :plain="false" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </el-button-group>
    <div class="table-wrapper">
    <el-table class="table" ref="multipleTable" :stripe="true" :border="true" :data="tableData" height="650" tooltip-effect="dark" highlight-current-row @selection-change="handleSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column width="250" prop="objectId" label="objectId"></el-table-column>
      <%_ entity.body.forEach(prop => { _%>
      <el-table-column width="120" prop="<%=prop.name%>" label="<%=prop.javadoc%>" sortable="custom"></el-table-column>
      <%_ })_%>
      <el-table-column width="200" prop="createdAt" label="创建时间" :formatter="formatterDate" sortable="custom"></el-table-column>
      <el-table-column width="200" prop="updatedAt" label="更新时间" :formatter="formatterDate" sortable="custom"></el-table-column>
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
    <el-dialog title="查询条件" :visible.sync="searchDialogVisiable">
      <el-form :model="form">
        <el-form-item>
          <el-select v-model="value5" multiple placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value5" multiple placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="input23">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="searchDialogVisiable = false">添加条件</el-button>
        <el-button @click="searchDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="searchDialogVisiable = false">确 定</el-button>
      </div>
    </el-dialog>
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
      total: 0,
      selectedRows: [],
      searchDialogVisiable: false,
      sortBy: 'createdAt',
      sortType: 'ascending',
      form: {
        name: 1
      },
      options: [{ label: '大于', value: 'greaterThan' }]
    }
  },
  created() {
    this.queryEntityData();
  },
  methods: {
    async queryEntityData(skip = 0, limit = 20, sortBy = 'createdBy', sortType = 'ascending') {
      const <%=entity.name%>Query = new AV.Query('<%=entity.name%>');
      <%=entity.name%>Query.skip(skip);
      <%=entity.name%>Query.limit(limit);
      if (sortType === 'ascending') <%=entity.name%>Query.ascending(sortBy);
      if (sortType === 'descending') <%=entity.name%>Query.descending(sortBy);
      const tableDataList = await <%=entity.name%>Query.find();
      this.tableData = tableDataList.map(item => item.toJSON());
      this.total = await (new AV.Query('<%=entity.name%>').count());
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows;
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
    handleCreate() {
      this.$router.push({ path: '/entities/<%=entity.name%>/<%=entity.name%>-add.g.vue' })
    },
    async handleDelete() {
      await this.$confirm('确认删除？')
      const promiseList = this.selectedRows.map(selectedRow => AV.Object.createWithoutData('Task', selectedRow.objectId));
      AV.Object.destroyAll(promiseList);
    },
    handleSearch() {
      this.searchDialogVisiable = true;
    },
    handleRefresh() { 
      this.queryEntityData((this.pageNumber - 1) * this.pageSize, this.pageSize, this.sortBy, this.sortType);
    },
    onSortChange({ column, prop, order }) {
      this.sortBy = prop;
      this.sortType = order;
      this.handleRefresh();
    }
  },
  watch: {
    'pageSize'() {
      this.handleRefresh();
    },
    'pageNumber'() {
      this.handleRefresh();
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