const AV = require('leanengine');
/** 保存前 */
AV.Cloud.beforeSave('<%=entities[0].name%>', function(request) {});
/** 保存后 */
AV.Cloud.afterSave('<%=entities[0].name%>', function(request) {});
/** 更新前 */
AV.Cloud.beforeUpdate('<%=entities[0].name%>', function(request) {});
/** 更新后 */
AV.Cloud.afterUpdate('<%=entities[0].name%>', function(request) {});
/** 删除前 */
AV.Cloud.beforeDelete('<%=entities[0].name%>', function(request) {});
/** 删除后 */
AV.Cloud.afterDelete('<%=entities[0].name%>', function(request) {});
<% entities[1]&&entities[1].body.forEach(prop => { %>
/**<%=prop.javadoc%>*/
AV.Cloud.define('<%=prop.name%>', async ({params, currentUser, sessionToken, meta}) => {
  const objectId = params.objectId;
  if (!objectId) throw new Error('objectId must not null');
  const entity = AV.Object.createWithoutData('<%=entities[0].name%>', objectId);
  await entity.fetch();
  let currentState = entity.get('state');
  if (currentState !== <%=state.values.indexOf(prop.type.split('__')[0])%>) throw new Error('currentState must be <%=state.values.indexOf(prop.type.split('__')[0])%>,but get ${currentState}');
  entity.set('state', <%=state.values.indexOf(prop.type.split('__')[1])%>);
  return entity.save(null, {sessionToken});
});
<%})%>
  