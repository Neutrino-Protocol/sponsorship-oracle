import SponsorshipController from './controllers/SponsorshipController';
import * as dotenv from 'dotenv';

async function main() {
    const envParseResult = dotenv.config({ path: './.env' });

    if (envParseResult.error) {
        dotenv.config({ path: './.env.example' });
    }

    // console.log(process.env)
    const spController = new SponsorshipController()
    spController.start()
}

main();
