import { Argument, Option } from "commander";

export class BaseCommand {
    /**
     * The name and signature of the console command.
     */
    static signature: string;

    /**
     * The console command description.
     */
    static description: string;

    /**
     * The console command options.
     */
    static args?: Argument[];

    /**
     * The console command options.
     */
    static options?: Option[];

    /**
     * Execute the console command.
     */
    handle(...params: any): any {
        // handling loginc
    };
}