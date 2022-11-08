import Parse from "parse/node";

// Make Parse global to make sure that all the
// dependencies use the same instance.
global.Parse = Parse;

import { BaseCommand } from "./commands/BaseCommand";
import { LaravelBackendImportInsurances } from "./commands/LaravelBackendImportInsurances";
import { LaravelBackendImportSquareCards } from "./commands/LaravelBackendImportSquareCards";
import { LaravelBackendImportSquareCustomer } from './commands/LaravelBackendImportSquareCustomer';
import { LaravelBackendImportTreatmentPlans } from "./commands/LaravelBackendImportTreatmentPlans";
import { Kernel } from './Kernel';

const commands: (typeof BaseCommand)[] = [
    LaravelBackendImportSquareCustomer,
    LaravelBackendImportSquareCards,
    LaravelBackendImportInsurances,
    LaravelBackendImportTreatmentPlans,
]

const kernel = new Kernel();
kernel.register(commands)