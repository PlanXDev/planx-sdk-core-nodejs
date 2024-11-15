# planx-sdk-core-nodejs

Here is the nodejs version of PlanXSDK.

### In the Server

Enter cmd `npm init` and `npm install`

Include `planx_sdk.ts` in your code.

````typescript
   import {PlanXSDK} from "./planx_sdk";
````
### Usage
-  New
````typescript
    /**
     * Create SDK.
     * @param url The SDK server url
     * @param appid The App ID
     * @param key The Key
     */
    var Planxsdk = new PlanXSDK(url, appid, key)
````

### Interface
-  sendGiftSourceInfoNew
````typescript
    /**
     * Create a new superior gift pack.
     * @param poolId The unique identifier of the capital pool
     * @param giftName Gift name
     * @param giftType Gift type [ApiVars.GIFT_TYPE_AIRDROP,ApiVars.GIFT_TYPE_REDEMPTION]
     * @param quantity Generate quantity,1<=quantity<=2000
     * @param priceAmount Number of tokens for a single Gift
     * @param expiresSeconds Expiration time.Expires after specified number of seconds
     */
    Planxsdk.sendGiftSourceInfoNew(poolId,giftName,giftType,quantity,priceAmount,expiresSeconds)
````
-  getGiftClaimWaiting
````typescript
    /**
     * Get all available sub-gift packs.
     */
    Planxsdk.getGiftClaimWaiting()
````

-  getGiftSourceInfoDetail
````typescript
    /**
     * Check the details of the superior gift pack corresponding to the Code.
     * @param giftSourceQrCode The unique CODE of the gift source
     */
    Planxsdk.getGiftSourceInfoDetail(giftSourceQrCode)
````

-  getGiftSourceInfoBatch
````typescript
   /**
     * Batch query the superior gift packs details corresponding to the code.
     * @param giftSourceQrCodes The unique CODE of the gift source
     */
    Planxsdk.getGiftSourceInfoBatch(giftSourceQrCodes)
````

-  getGiftClaimInfoBatch
````typescript
    /**
     * Batch query the sub-gift packs details corresponding to the superior gift pack code.
     * @param giftSourceQrCode The unique CODE of the gift source
     * @param giftQrCode The unique CODE of the gift
     */
    Planxsdk.getGiftClaimInfoBatch(giftSourceQrCode,giftQrCode)
````

-  sendGiftClaimIssued
````typescript
    /**
     * Send a sub-gift pack through the superior gift pack code.
     * @param giftSourceQrCode The unique CODE of the gift source
     */
    Planxsdk.sendGiftClaimIssued(giftSourceQrCode)
````

-  sendGiftInfoForceExpire
````typescript
    /**
     * Forced expiration gift pack.
     * @param giftSourceQrCode The unique CODE of the gift source
     */
    Planxsdk.sendGiftInfoForceExpire(giftSourceQrCode)
````

-  getAccountBalancesBase
````typescript
    /**
     * Get balance information for all base accounts
     */
    Planxsdk.getAccountBalancesBase()
````

-  getAccountBalancesPool
````typescript
   /**
     * Obtain the balance information of all fund pool accounts
     */
    Planxsdk.getAccountBalancesPool()
````

-  getAccountBalancesMarket
````typescript
    /**
     * Get balance information for all market accounts
     */
    Planxsdk.getAccountBalancesMarket()
````

-  sendAccountMarketInvest
````typescript
     /**
     * Add funds to a designated token market account
     * @param externalOrderId External order ID,This parameter is used to mark this operation
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     * @param targetAmount The amount of tokens on the right
     */
    Planxsdk.sendAccountMarketInvest(externalOrderId,sourceSymbol,targetSymbol,targetAmount)
````

-  sendPoolInfoNew
````typescript
     /**
     * Transfer an equal amount of tokens from the base account to create a new funding pool.
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     * @param sourceAmount The amount of tokens on the left
     * @param targetAmount The amount of tokens on the right
     */
    Planxsdk.sendPoolInfoNew(sourceSymbol,targetSymbol,sourceAmount,targetAmount)
````

-  getPoolInfoList
````typescript
    /**
     * Get all capital pool objects.
     */
    Planxsdk.getPoolInfoList()
````

-  getPoolInfoDetail
````typescript
    /**
     * Get the details of a fund pool.
     * @param poolId The unique identifier of the capital pool
     */
    Planxsdk.getPoolInfoDetail(poolId)
````

-  sendPoolCapacityChange
````typescript
   /**
     * Increase or decrease the assets of the fund pool.
     * @param poolId The unique identifier of the capital pool
     * @param sourceSymbol Token name on the left
     * @param sourceAmount The amount of tokens on the left
     * @param capacityAction Capacity action [ApiVars.POOL_CAPACITY_ACTION_INCREASE,ApiVars.POOL_CAPACITY_ACTION_DECREASE]
     */
    Planxsdk.sendPoolCapacityChange(poolId,sourceSymbol,sourceAmount,capacityAction)
````

-  sendPoolFundDestroy
````typescript
    /**
     * Destroys the fund pool and returns the available amount to the base account.
     * @param poolId The unique identifier of the capital pool
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     */
    Planxsdk.sendPoolFundDestroy(poolId,sourceSymbol,targetSymbol)
````

-  sendPoolStatusChange
````typescript
    /**
     * Modify the active status of the capital pool.
     * @param poolId The unique identifier of the capital pool
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     * @param poolStatus Pool status [ApiVars.POOL_STATUS_ACTIVE,ApiVars.POOL_STATUS_INACTIVE]
     */
    Planxsdk.sendPoolStatusChange(poolId,sourceSymbol,targetSymbol,poolStatus)
````

-  getTradePendingList
````typescript
   /**
     * Get all unfinished transactions.
     */
    Planxsdk.getTradePendingList()
````

-  getTradePendingDetail
````typescript
   /**
     * Get details according to trade ID.
     * @param tradeId Unique identifier of the trade
     */
    Planxsdk.getTradePendingDetail(tradeId)
````

-  sendTradeDealBuy
````typescript
    /**
     * The trade of purchasing the specified ID will deduct the corresponding funds from the market account.
     * Please confirm whether the funds are sufficient when calling.
     * @param tradeId Unique identifier of the trade
     */
    Planxsdk.sendTradeDealBuy(tradeId)
````
