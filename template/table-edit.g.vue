<template>
  <div class="<%=entity.name%>-add">
    <el-form ref="form" :model="formData" label-width="80px">
      
      <%entity.body.forEach(prop => {%>
      <el-form-item label="<%=prop.javadoc%>">
        <%if (prop.type === 'String') {%>
        <el-input v-model.number="formData.<%=prop.name%>"></el-input>
        <%}%>
        <%if (prop.type === 'Date') {%>
        <el-date-picker v-model="formData.<%=prop.name%>" type="date" placeholder="选择日期"></el-date-picker>
        <%}%>
        <%if (prop.type === 'Integer' || prop.type === 'Long' || prop.type === 'BigDecimal' || prop.type === 'Float' || prop.type === 'Double') {%>
        <el-input v-model.number="formData.<%=prop.name%>"></el-input>
        <%}%>
        <%if (prop.type === 'Boolean') {%>
        <el-select v-model="formData.<%=prop.name%>" placeholder="请选择活动区域">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
        <%}%>
        <%if (enums.find(enumItem => enumItem.name === prop.type)) {%>
        <el-select v-model="formData.<%=prop.name%>" placeholder="请选择活动区域">
          <%enums.find(enumItem => enumItem.name === prop.type).values.forEach(enumVal => {%>
          <el-option label="<%=enumVal%>" value="<%=enumVal%>"></el-option>
          <%})%>
        </el-select>
        <%}%>
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
