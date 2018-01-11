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
        <el-button @click="onCancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AV from 'leancloud-storage';
export default {
  name: 'Task-add',
  data() {
    return {
      formData: {
        <%entity.body.forEach(prop => {%>
        <%=prop.name%>: '',
        <%})%>
      }
    }
  },
  methods: {
    onSubmit() {
      const <%=entity.name.toLowerCase()%> = new AV.Object('<%=entity.name%>')
      <%entity.body.forEach(prop => {%>
      <%=entity.name.toLowerCase()%>.set('<%=prop.name%>', this.formData.<%=prop.name%>)
      <%})%>
      return <%=entity.name.toLowerCase()%>.save();
    },
    onCancle() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.el-form {
  margin: 20px;
}
</style>
