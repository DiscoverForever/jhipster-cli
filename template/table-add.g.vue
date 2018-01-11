<template>
  <div class="<%=entity.name%>-add">
    <el-form ref="form" :model="formData" label-width="80px">
      
      <%entity.body.forEach(prop => {%>
      <el-form-item label="<%=prop.javadoc%>">
        <el-input v-model="formData.<%=prop.name%>"></el-input>
      </el-form-item>
      <%})%>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Task-add',
  data() {
    return {
      formData: {
        name: ''
      }
    }
  },
  methods: {
    onSubmit() {
      
    }
  }
}
</script>

<style scoped>
.el-form {
  margin: 20px;
}
</style>
