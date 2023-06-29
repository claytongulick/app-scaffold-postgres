import '../../load-env.js';
import { program } from "commander";
import sync from './commands/database/sync.js';
import seed from './commands/database/seed.js';

program.name('application-cli')
.description('Command line utilities');

let database_command = program
    .command('database')
    .description("Database utilities");

database_command
    .command('sync')
    .description("Synchronize sequelize models to the database server")
    .option("-f, --force", "Force the selected models to be dropped and recreated. WARNING: you WILL lose data")
    .action(sync);

database_command
    .command('seed')
    .description("Add default data to the database tables")
    .action(seed);

await program.parseAsync(process.argv);