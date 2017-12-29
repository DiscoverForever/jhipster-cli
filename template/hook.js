

const AV = require('leanengine');
/** 保存前 */
AV.Cloud.beforeSave('<%=entity.name%>', function(request) {});
/** 保存后 */
AV.Cloud.afterSave('<%=entity.name%>', function(request) {});
/** 更新前 */
AV.Cloud.beforeUpdate('<%=entity.name%>', function(request) {});
/** 更新后 */
AV.Cloud.afterUpdate('<%=entity.name%>', function(request) {});
/** 删除前 */
AV.Cloud.beforeDelete('<%=entity.name%>', function(request) {});
/** 删除后 */
AV.Cloud.afterDelete('<%=entity.name%>', function(request) {});
<% entity.body.forEach(prop => { %>
  <% if (prop.type === 'Service') { %>
/**<%=prop.javadoc%>*/
AV.Cloud.define('<%=prop.name%>',  function(request){});
  <%}%>
<%})%>
  