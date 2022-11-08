import * as Parse from 'parse/node';
const MASTER_KEY_OPTION = { useMasterKey: true }
const AdminRole={
    name: 'admin',
};

Parse.initialize(
    process.env.APP_ID as string,
    process.env.JAVASCRIPT_KEY,
    process.env.MASTER_KEY
);

const setClassLevelPermissions= async () => {
    try {
      const allClasses = await Parse.Schema.all();
      var commonCPL = new (Parse as any).CLP();
      commonCPL.setPublicGetAccess(false);
      commonCPL.setPublicFindAccess(false);
      commonCPL.setPublicCountAccess(false);
      commonCPL.setPublicCreateAccess(false);
      commonCPL.setPublicDeleteAccess(false);
      commonCPL.setPublicAddFieldAccess(false);
      commonCPL.setPublicUpdateAccess(false);
      commonCPL.setCreateRequiresAuthentication(true);
      commonCPL.setFindRequiresAuthentication(true);
      commonCPL.setDeleteRequiresAuthentication(true);
      commonCPL.setCountRequiresAuthentication(true);
      commonCPL.setGetRequiresAuthentication(true);
      commonCPL.setUpdateRequiresAuthentication(true);
      for (var item of allClasses) {
        if (item.className !== '_User') {
          const itemSchema = new Parse.Schema(item.className);
          itemSchema.setCLP(commonCPL);
          await itemSchema.update();
          console.log(itemSchema);
        }
      }
    } catch (ex) {
      console.log('Set Class level permission generate Error');
      console.log(ex);
    }
};

const verfiyAdminRole = async () => {
try {
// const Role=new Parse.Object('_Role');
const roleQ = new Parse.Query('_Role');
roleQ.equalTo('name', AdminRole.name);
const adminRole = await roleQ.find(MASTER_KEY_OPTION);
if(!adminRole){
    const Role=new Parse.Object('_Role');
    Role.set('name',AdminRole.name);
    await Role.save();
}
}catch (ex) {
    console.log('Verify Admin Role Error');
}
};