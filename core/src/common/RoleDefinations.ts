export enum locationRoles {
  Location_Read,
  Location_Write,
  Location_Appointments_Read,
  Location_Appointments_Write,
  Location_Schedules_Read,
  Location_Schedules_Write,
}
export interface RoleDefination {
  value: string;
  title: string;
} 
const Roles: RoleDefination[] = [{
  title: "Virtuals", value: "virtuals",
}, {
  title: "Reporting", value: "reporting",
},
{ title: "Schedule", value: "schedule" },
{
  title: "View People", value: "viewpeople",
},
{ title: "Create People", value: "createpeople" },
{ title: "Edit People", value: "editpeople" },
{ title: "View patient", value: "viewpatient"},
{title: "Create patient", value: "createpatient"},
{title: "Edit Patient", value: "editpatient"},
{title: "Create Appointments", value: "createappointments"},
{title: "Edit Appointments", value: "editappointments"},
{title: "View Appointments", value: "viewappointments"}
];
export {Roles};