import SponsorshipController from './controllers/SponsorshipController';

import * as dotenv from 'dotenv';

const ENV_PARAM = '--env';

async function main() {
    const envDest = process.argv[process.argv.indexOf(ENV_PARAM) + 1];
    const envParseResult = dotenv.config({ path: envDest ?? './.env' });

    if (envParseResult.error) {
        dotenv.config({ path: './.env.example' });
    }

    const requiredParams = ['NODE_URL', 'SPONSOR_SEED', 'SPONSORSHIP_ASSET_ID', 'CHAIN_ID', 'SPONSORSHIP_FREQ', 'UPPER_BOUND'];

    for (const param of requiredParams) {
        if ([null, undefined].includes(process.env[param])) {
            throw new Error(`Param: ${param} is not provided in .env file...`);
        }
    }

    const spController = new SponsorshipController();
    spController.start();
}

main();
