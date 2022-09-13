const functions = require('@google-cloud/functions-framework');
const DVC = require('@devcycle/nodejs-server-sdk');

functions.http('helloHttp', async (req, res) => {
    const serverKey = process.env.SERVER_KEY;
    const dvcClient = DVC.initialize(serverKey, {
        enableCloudBucketing: true,
        enableEdgeDB: true
    });
    const userWithAllData = {
        user_id: "testuser_1234333",
        email: "vip@email.ca"
    };
    const { value: hasCampaign } = await dvcClient.variable(userWithAllData, "campaign-switch", false);
    const { value: campaignData } = await dvcClient.variable({ user_id: "testuser_1234333" }, "campaign-details", {});
    const { value: proposedCampaignTitle } = await dvcClient.variable({ user_id: "testuser_1234333" }, "dec-campaign-proposed-name", "");
    if (hasCampaign) {
        const finalizedCampaignData = campaignData;
        if (campaignData.campaignId === "20221223") {
            finalizedCampaignData.title = proposedCampaignTitle; 
        }
        res.send(`Current Campaign Data: ${JSON.stringify(finalizedCampaignData)}`);
    } else {
        res.send("No campaign at the moment!");
    }

});
