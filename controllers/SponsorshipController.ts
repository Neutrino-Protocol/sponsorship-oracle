import { increaseBy } from './../blockchain/helpers';
import { updateSponsorship } from './../blockchain/sponsorship';

class SponsorshipController {
    lastPaymentHeight?: number;
    updateTimeout?: NodeJS.Timeout;
    updateFrequency: number = Number(process.env.SPONSORSHIP_FREQ) || 300000;

    constructor() {
        this.update = this.update.bind(this);
    }

    async update() {
        const currentPrice = 90;
        const upperBound = 100;
        const minSponsoredAssetFee = increaseBy(currentPrice, upperBound);

        await updateSponsorship({
            minSponsoredAssetFee: minSponsoredAssetFee,
            assetId: process.env.SPONSORSHIP_ASSET_ID,
            chainId: process.env.CHAIN_ID,
            seed: process.env.SPONSOR_SEED,
            nodeUrl: process.env.NODE_URL,
        });

        this.updateTimeout = setTimeout(async () => {
            await this.update();
        }, this.updateFrequency);
    }

    async start() {
        await this.update();
    }
}

export default SponsorshipController;
