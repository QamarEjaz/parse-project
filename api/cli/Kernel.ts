import { Command } from "commander";
import Parse from "parse/node";
import { BaseCommand } from "./commands/BaseCommand";

export class Kernel {

    constructor() {
        this.initialize();
    }

    initialize() {
        if (!(
            process.env.APP_ID &&
            process.env.MASTER_KEY &&
            process.env.SERVER_URL &&
            process.env.POSTGRES_USER &&
            process.env.DATABASE_HOST &&
            process.env.DATABASE_NAME &&
            process.env.POSTGRES_PASSWORD &&
            process.env.DATABASE_PORT
        )) {
            throw new Error("Required ENV variables not found.");
        }

        // Initialize Parse
        Parse.initialize(
            process.env.APP_ID || 'APP_ID',
            process.env.JAVASCRIPT_KEY,
            process.env.MASTER_KEY,
        );
        Parse.serverURL = process.env.SERVER_URL!;

        // @ts-ignore: allowCustomObjectId is valid but does not exist
        // in @types/parse. 
        Parse.allowCustomObjectId = true;
    }

    register(commands: (typeof BaseCommand)[]) {
        const program = new Command();

        for (const command of commands) {
            const instance = new (command)();
            const commanderCommand = new Command(command.signature);
            commanderCommand.description(command.description)

            // Add the arguments if available
            if (command.args) {
                for (const arg of command.args) {
                    commanderCommand.addArgument(arg);
                }
            }

            // Add the options if available
            if (command.options) {
                for (const option of command.options) {
                    commanderCommand.addOption(option);
                }
            }

            // Register command action
            commanderCommand.action(instance.handle);

            // Register the command
            program.addCommand(commanderCommand);
        }

        program.parse(process.argv);
    }
}