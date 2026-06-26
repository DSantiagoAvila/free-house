import { AppDataSource } from '../data-source';
import { runInitialSeed } from './initial.seed';

async function main() {
  await AppDataSource.initialize();
  console.log('Database connected. Running seeds...');
  await runInitialSeed(AppDataSource);
  await AppDataSource.destroy();
  console.log('Seeds completed.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
