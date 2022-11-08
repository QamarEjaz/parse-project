export function cloudInit() {
  require("./booking/appConfigurations");
  require("./booking/auth");
  require("./booking/slot");
  require("./booking/patient");
  require("./booking/patientCard");
  require("./booking/patientInsurance");
  require("./booking/patientAppointment");
  require("./booking/virtualCall");
  require("./triggers/appointment");
  require("./triggers/patient");
  require("./phone");
  require("./email");
  require("./booking");
  require("./virtualCall");
  require("./patient");
  require("./automation");
  require("./relatedPatient");
  require("./treatmentPlan");

  Parse.Cloud.define('create-new-user', async request => {
    const {
      name,
      username,
      email,
      mobile,
      peopleSets } = request.params;
    const defaultPassword = '12345678aA!';
    const pendingStatus = 'pending';
    var user = new Parse.Object("_User");
    user.set('name', name);
    user.set('username', username);
    user.set('email', email);
    user.set('password', defaultPassword);
    user.set('status', pendingStatus);
    const savedUSer = await user.save();
    const PeopleSet = Parse.Object.extend("PeopleSet");
    const query = new Parse.Query(PeopleSet);
    for (const item of peopleSets) {
      const set = await query.get(item);
      const relation = set.relation("users");
      relation.add(savedUSer);
      set.save();
    }
    return true;
  });

  Parse.Cloud.define('calculate-num-people-sets-user', async request => {
    const {
      peopleSets
    } = request.params;

  });

  Parse.Cloud.define('setup-location-roles', async request => {
    const { locationId } = request.params;
    // Check if user have Admin permission
    const userId = request.user?.id;
    if (!userId) {
      throw ('No admin permissions');
    }
  });
}
