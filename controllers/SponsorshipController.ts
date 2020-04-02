import { updateSponsorship } from './../blockchain/sponsorship';
import { transfer, ITransferParams, broadcast } from '@waves/waves-transactions';
import { increaseBy, isFirstBiggerBy } from './../blockchain/helpers';

class SponsorshipController {
    lastPaymentHeight?: number;
    updateTimeout?: NodeJS.Timeout;
    updateFrequency: number = Number(process.env.SPONSORSHIP_FREQ) || 300000;
    currentPrice = 90;
    upperBound = 100;
    assetId = process.env.SPONSORSHIP_ASSET_ID;
    multiplierForSmartAccount = 5;

    constructor() {
        this.update = this.update.bind(this);
    }

    async update() {
        // const previousMinSponsoredAssetFee
        // By setting 1 as fee we handle error where
        // it's possible to figure out previously set minAssetFee

        // TODO: fetch price


        const transferParams: ITransferParams = {
            amount: 1,
            fee: 1,
            recipient: '3MzBbcyj3q8yCEVESpYr2sAy7HV7PU9vu9N',
            feeAssetId: this.assetId,
            assetId: this.assetId,
        };
        let previousMinSponsoredAssetFee;

        try {
            const signedTx = transfer(transferParams, process.env.SPONSOR_SEED);
            await broadcast(signedTx, process.env.NODE_URL);
        } catch (err) {
            const splitted = err.message.split(' ');
            previousMinSponsoredAssetFee = Number(splitted[splitted.length - 2]);

            if (err.message.includes('Transaction sent from smart account')) {
                previousMinSponsoredAssetFee /= this.multiplierForSmartAccount;
            }
        }

        const minSponsoredAssetFee = increaseBy(this.currentPrice, this.upperBound) * 10;
        
        // Potential loss of benefit in % if SC won't call sponsorship (won't update min asset fee)
        const potentialLoss = isFirstBiggerBy(minSponsoredAssetFee, previousMinSponsoredAssetFee)

        console.log({ previousMinSponsoredAssetFee, minSponsoredAssetFee });
        console.log(`Potential loss: ${potentialLoss}`);

        if (Math.abs(potentialLoss) >= 50) {
            await updateSponsorship({
                minSponsoredAssetFee: minSponsoredAssetFee,
                assetId: process.env.SPONSORSHIP_ASSET_ID,
                chainId: process.env.CHAIN_ID,
                seed: process.env.SPONSOR_SEED,
                nodeUrl: process.env.NODE_URL,
            });
        }

        this.updateTimeout = setTimeout(async () => {
            await this.update();
        }, this.updateFrequency);
    }

    async start() {
        await this.update();
    }
}

export default SponsorshipController;
