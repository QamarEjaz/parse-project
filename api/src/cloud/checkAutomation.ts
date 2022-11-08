// check and execute automations
const OPERATORS = {
    equalTo: "equalTo",
    notEqualTo: "notEqualTo",
    lessThan: "lessThan",
    lessThanOrEqualTo: "lessThanOrEqualTo",
    greaterThan: "greaterThan",
    greaterThanOrEqualTo: "greaterThanOrEqualTo",
    containedIn: "containedIn",
    notContainedIn: "notContainedIn",
    contains: "contains",
    containsAll: "containsAll",
    startsWith: "startsWith",
    fullText: "fullText",
    distinct: "distinct",
    limit: "limit",
    skip: "skip",
    withCount: "withCount",
    ascending: "ascending",
    descending: "descending",
    exists: "exists",
    doesNotExist: "doesNotExist",
    matchesKeyInQuery: "matchesKeyInQuery",
    doesNotMatchKeyInQuery: "doesNotMatchKeyInQuery",
    select: "select",
    exclude: "exclude",
    matchesQuery: "matchesQuery",
    doesNotMatchQuery: "doesNotMatchQuery",
    include: "include"
    };
    
const operators = {
    'equalTo': (a:string, b:string) => a == b,
    'notEqualTo': (a:string, b:string) => a != b,
    'lessThan': (a:string, b:string) => a < b,
    'lessThanOrEqualTo': (a:string, b:string) => a <= b,
    'greaterThan': (a:string, b:string) => a > b,
    'greaterThanOrEqualTo': (a:string, b:string) => a >= b,
    'containedIn': (a:string, b:string) => a.includes(b),
    'notContainedIn': (a:string, b:string) => !(a.includes(b)),
    'startsWith': (a:string, b:string) => a.startsWith(b),
    'endsWith': (a:string, b:string) => a.endsWith(b),
    'fullText': (a:string, b:string) => (a.match(`/${b}/gi`)) ? true : false,
    'exists': (a:string, b:string) => (a != null) ? true : false,
    'doesNotExist': (a:string, b:string) => (a == null || a == undefined) ? true : false,
    'matchesQuery': (a:string, b:string) => a.match(b) ? true : false,
    'doesNotMatchQuery': (a:string, b:string) => !(a.match(b))  ? true : false,
    'include': (a:string, b:string) => a.includes(b),
},
compare = function (keyValue:string, sign:string, value:string) {
    if (sign in operators) {
        return operators[sign as keyof typeof operators](keyValue, value);
    }
}

const actions = {
    sendEmail: function (params:any) {

        if(params.patientEmail) {
            params.toAddress = params.patientEmail;
            delete params.patientEmail;
            try {
                Parse.Cloud.run(params.action, params)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('Patient email does not exist');
            
        }
    },
    sendPhoneMessage: function(params:any) {
        
        if(params.patientPhones.length !==0) {
            for (const phone of params.patientPhones) {
                params.phone = phone.number;
                if (phone.number) {
                    try {
                        Parse.Cloud.run(params.action, params)
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    console.log('Patient Phones does not exist');
                }
            }
        } else {
            console.log('Patient Phones does not exist');
        }
         
    }
};
    
export const checkAutomations = async (source: any, object:any) => {
    
    const AutomationSourcesQuery = new Parse.Query("Sources");
    const AutomationSource = await AutomationSourcesQuery.equalTo('name', source).first()

    if(AutomationSource) {
        const AutomationPolicyQuery = new Parse.Query("AutomationPolicy")
        const AutomationPolicy = await AutomationPolicyQuery.equalTo('source', AutomationSource.id).equalTo('isActive', true).include('criteria').include('action').find()
        if(AutomationPolicy.length !== 0) {
            console.log('\nAutomation policy exist on', source, '\n');
    
            AutomationPolicy.forEach(async policy => {
                console.log('\nFetch Automation criterias\n');
                const policyCriterias = await policy.relation('criteria').query().find();
    
                if (policyCriterias.length !== 0) {
                    var condition:any = [];
    
                    policyCriterias.forEach(async criteria => {
    
                        // var Appointment = await new Parse.Query("AppointmentV1").equalTo(criteria.get('key'),criteria.get('value')).get(object.id);
                        
                        condition.push(compare(object.get(criteria.get('key')), criteria.get('operator'), criteria.get('value')));
                        
                    })
    
                    console.log("conditions: ", condition);
                    
        
                    if (!condition.includes(false)) {
        
                        console.log('criteria matched Appointment row, executing relavent actions')
        
                        const policyActions = await policy.relation('action').query().find();
            
                        policyActions.forEach(async action => {
            
                            const params = await action.relation('params').query().equalTo('type','input').find()
    
                            let patientId:string;
                            let AppointmentProviderName:string = '';
                            if (object.className == 'AppointmentV1') {
                                patientId = object.get('patient').id
                                const ProviderV1 = await new Parse.Query("ProviderV1").get(object.get('provider').id)
                                AppointmentProviderName = ProviderV1.get('firstName') + ' ' + ProviderV1.get('lastName');
                                
                            } else if (object.className == 'PatientV1') {
                                patientId = object.id
                            }
    
                            const PatientV1Query = new Parse.Query("PatientV1")
                            const PatientV1 = await PatientV1Query.include('preferredLocation').get(patientId)
                            const policyActionValue = action.get('action')
                            
                            let actionParams:any = { "action": policyActionValue, "patientPhones": PatientV1.get('phones'), "patientEmail": PatientV1.get('emailAddress') };
                            params.forEach(async param => {
                                // add replace variable here
                                // {patient.name}
                                // {patient.office}
                                // {appointment.provider}
                                
                                let patientName = PatientV1.get('firstName') + ' ' + PatientV1.get('lastName');
                                let patientHomeOffice = PatientV1.get('preferredLocation').get('name');
                                let paramValue = param.get('value');
                                paramValue = paramValue.replace(new RegExp('{patient.name}','g'), patientName);
                                paramValue = paramValue.replace(new RegExp('{patient.office}','g'), patientHomeOffice);
                                paramValue = paramValue.replace(new RegExp('{appointment.provider}','g'), AppointmentProviderName);
                                actionParams[param.get('name')] = paramValue;
                            })
    
                            console.log("actionParams: ", actionParams);
                            actions[policyActionValue as keyof typeof actions] (actionParams);
                            policy.increment("executedCount");
                            policy.save()
                            
                        })
                    }
                } else {
                    console.log('\nAutomation criteria Mismatch\n');
                }
            });
    
        }
    }
}
