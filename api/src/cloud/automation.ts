const MASTER_KEY_OPTION = { useMasterKey: true };

Parse.Cloud.define("getSchemaKeys", async (request: any) => {
  const { tableName } = request.params;
  const schema = await new Parse.Schema(`${tableName}`).get();
  let constant: any = [];
  Object.keys(schema.fields).forEach((key1: any) => {
    if (
      !key1.includes("_ascend") &&
      !key1.includes("ascend_") &&
      !key1.includes("ACL") &&
      !key1.includes("_ascned") &&
      schema.fields[key1].type != "Relation" &&
      schema.fields[key1].type != "File"
    ) {
      constant.push({ label: key1, value: schema.fields[key1] });
    }
  });
  return constant;
});

Parse.Cloud.define("createAutomationPolicy", async (request) => {
  const { source, criterias, actions, policyName } = request.params;

  // add policy criteria
  let savedPolicy: any;
  let savedCriterias = [];
  for (const criteria of criterias) {
    var AutomationCriteria = new Parse.Object("AutomationCriteria")
    AutomationCriteria.set("key", criteria.key.value);
    AutomationCriteria.set("keyType", criteria.key.type);
    AutomationCriteria.set("operator", criteria.operator.value);
    AutomationCriteria.set("value", criteria.value);
    AutomationCriteria.set("priority", criteria.priority);
    var savedAutomationCriteria = await AutomationCriteria.save(null, MASTER_KEY_OPTION);
    savedCriterias.push(savedAutomationCriteria);
  }

  // add policy action params
  let savedActionParams = [];
  for (const param of actions.params) {
    var AutomationPolicyActionParams = new Parse.Object("AutomationPolicyActionParams");
    AutomationPolicyActionParams.set("name", param.name);
    AutomationPolicyActionParams.set("value", param.value);
    AutomationPolicyActionParams.set("type", "input");
    var savedAutomationPolicyActionParams = await AutomationPolicyActionParams.save(null, MASTER_KEY_OPTION);
    savedActionParams.push(savedAutomationPolicyActionParams);
  }

  // add policy action
  var AutomationPolicyAction = new Parse.Object("AutomationPolicyAction");
  let savedActions;
  // for (const action of actions) {
  AutomationPolicyAction.set("action", actions.actionName);
  AutomationPolicyAction.set("priority", actions.priority);
  const actionParamRelation = AutomationPolicyAction.relation("params");
  actionParamRelation.add(savedActionParams);
  try {
    const savedAction = await AutomationPolicyAction.save(null, MASTER_KEY_OPTION);
    savedActions = savedAction;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  // }

  var Source = new Parse.Object("Sources");
  Source.id = source;

  var AutomationPolicy = new Parse.Object("AutomationPolicy");
  AutomationPolicy.set("source", Source);
  AutomationPolicy.set("name", policyName);
  AutomationPolicy.set("isActive", true);
  AutomationPolicy.set("executedCount", 0);
  for (const item of savedCriterias) {
    const relationCriteria = AutomationPolicy.relation("criteria");
    relationCriteria.add(item);
  }
  // for (const item of savedActions) {
  const relationAction = AutomationPolicy.relation("action");
  relationAction.add(savedActions);
  // }
  try {
    savedPolicy = await AutomationPolicy.save(null, MASTER_KEY_OPTION);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  return savedPolicy;
},
{
  fields: {
    source: {
      required: true,
      type: String,
    },
    policyName: {
      required: true,
      type: String,
    },
    criterias: {
      required: true,
      type: Array,
    },
    actions: {
      required: true,
      type: Object,
    },
  },
  requireUser: true,
});

Parse.Cloud.define("getAutomationPolicyData", async (request) => {
    const { policyId } = request.params;

    var AutomationPolicy = await new Parse.Query("AutomationPolicy")
      .include("source")
      .get(policyId);

    let source = {
      value: AutomationPolicy.get("source").id,
      label: AutomationPolicy.get("source").get("name"),
    };
    let criteriasArray = [];
    const criterias = await AutomationPolicy.relation("criteria")
      .query()
      .find();
    for (const criteria of criterias) {
      var getInput = false;
      if (criteria.get("value")) {
        getInput = true;
      }

      const criteriaObject = {
        key: {
          value: criteria.get("key"),
          label: criteria.get("key"),
          type: criteria.get("keyType"),
          name: "key",
        },
        operator: {
          value: criteria.get("operator"),
          label: criteria.get("operator"),
          getInput: getInput,
          name: "operator",
        },
        value: criteria.get("value"),
        priority: criteria.get("priority"),
      };

      criteriasArray.push(criteriaObject);
    }

    let actionsArray = [];
    const actions = await AutomationPolicy.relation("action").query().find();
    for (const action of actions) {
      let paramsArray = [];
      const params = await action.relation("params").query().find();
      for (const param of params) {
        const paramObject = {
          objectId: param.id,
          name: param.get("name"),
          value: param.get("value"),
        };
        paramsArray.push(paramObject);
      }

      const actionObject = {
        actionName: {
          value: action.get("action"),
          label: action.get("action"),
        },
        priority: action.get("priority"),
        params: paramsArray,
      };
      actionsArray.push(actionObject);
    }

    let policy = {
      source: source,
      policyName: AutomationPolicy.get("name"),
      criterias: criteriasArray,
      actions: actionsArray[0],
    };

    return policy;
  },
  {
    fields: {
      policyId: {
        required: true,
        type: String,
      },
    },
    requireUser: true,
  }
);

Parse.Cloud.define("deleteAutomationPolicy", async (request) => {
    const { policyId } = request.params;

    var AutomationPolicy = await new Parse.Query("AutomationPolicy").get(policyId);
    var actions = await AutomationPolicy.relation("action").query().find();
    for (const action of actions) {
      let params = await action.relation("params").query().find();
      params.forEach(async param => {
        try {
          await param.destroy(MASTER_KEY_OPTION)
        } catch (error) {
          console.log("param - ", error)
          throw new Error("param - " + error);
        }
      })
      try {
        await action.destroy(MASTER_KEY_OPTION)
      } catch (error) {
        console.log("action - ", error)
        throw new Error("action - " + error);
      }
    }

    var criterias = await AutomationPolicy.relation("criteria").query().find();
    criterias.forEach(async criteria => {
      try {
        await criteria.destroy(MASTER_KEY_OPTION)
      } catch (error) {
        console.log("criteria - ", error)
        throw new Error("criteria - " + error);
      }
    })
    try {
      await AutomationPolicy.destroy(MASTER_KEY_OPTION);
      return true;
    } catch (error) {
      console.log("policy - ", error);
      throw new Error("policy - " + error);
    }
  },
  {
    fields: {
      policyId: {
        required: true,
        type: String,
      },
    },
    requireUser: true,
  }
);

Parse.Cloud.define("toggleEnableAutomationPolicy", async (request) => {
    const { policyId, isActive } = request.params;

    var AutomationPolicy = await new Parse.Query("AutomationPolicy").get(policyId);
    AutomationPolicy.set("isActive", isActive);
    try {
      await AutomationPolicy.save(null, MASTER_KEY_OPTION);
      return true;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  {
    fields: {
      policyId: {
        required: true,
        type: String,
      },
      isActive: {
        required: true,
        type: Boolean,
      },
    },
    requireUser: true,
  }
);
