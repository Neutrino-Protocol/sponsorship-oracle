import { sponsorship, broadcast, ISponsorshipTransaction } from '@waves/waves-transactions';
// import { increaseBy } from './helpers';

export const updateSponsorship = async ({
    minSponsoredAssetFee,
    assetId,
    chainId,
    seed,
    nodeUrl,
}: {
    minSponsoredAssetFee: number;
    assetId: string;
    seed: string;
    chainId: string;
    nodeUrl: string;
}): Promise<ISponsorshipTransaction | Error> => {
    const sponsorData = {
        assetId: assetId,
        minSponsoredAssetFee: minSponsoredAssetFee,
        // chainId: 'T',
        chainId: chainId,
        fee: 100400000,
    };

    const signedTx = sponsorship(sponsorData, seed);

    try {
        const res = await broadcast(signedTx, nodeUrl);

        return res;
    } catch (err) {
        console.log(`Error: ${err}`);

        return err;
    }
};
