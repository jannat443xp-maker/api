const axios = require("axios");
require("dotenv").config();

const HL_API_URL = "https://proapis.hlgamingofficial.com/main/games/freefire/account/api";

/**
 * Fetch detailed Free Fire player info using the HL Gaming Official API.
 * @param {string} uid
 * @param {string} region Defaults to 'bd'
 */
async function checkUID(uid, region = "bd") {
  try {
    console.log(`[ffService] Checking UID ${uid} (${region}) via HL Gaming API...`);

    if (!process.env.HL_USER_UID || !process.env.HL_API_KEY) {
      console.error("[ffService] Missing HL Gaming credentials in .env or Vercel Settings.");
      return { 
        success: false, 
        status: 500, 
        error: "Server configuration missing HL Gaming credentials." 
      };
    }

    const response = await axios.get(HL_API_URL, {
      params: {
        sectionName: "AllData",
        PlayerUid: uid,
        region: region,
        useruid: process.env.HL_USER_UID,
        api: process.env.HL_API_KEY
      },
      timeout: 10000
    });

    const data = response.data;
    
    if (!data || !data.result) {
      return { 
        success: false, 
        status: 404, 
        error: data.message || "Player not found or API error." 
      };
    }

    // Map the HL Gaming response to the requested structure
    const result = data.result;
    const accountInfo = result.AccountInfo || {};
    const guildInfo = result.GuildInfo || {};
    const petInfo = result.petInfo || {};
    const socialInfo = result.socialinfo || {};

    return {
      success: true,
      endpoint: "AllData",
      result: {
        AccountInfo: accountInfo,
        AccountProfileInfo: result.AccountProfileInfo || {},
        GuildInfo: guildInfo,
        captainBasicInfo: result.captainBasicInfo || {},
        creditScoreInfo: result.creditScoreInfo || {},
        newUpdate: result.newUpdate || {},
        petInfo: petInfo,
        socialinfo: socialInfo
      },
      source: "ihntopup.shop",
      usage: data.usage || {}
    };
  } catch (err) {
    console.error("[ffService] HL Gaming API error:", err.message);
    const status = err.response?.status || 500;
    const errorMessage = err.response?.data?.message || err.message;
    
    return { 
      success: false, 
      status: status, 
      error: `API Call Failed: ${errorMessage}` 
    };
  }
}

module.exports = { checkUID };
