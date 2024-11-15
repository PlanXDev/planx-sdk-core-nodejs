import axios from "axios";
import hmacSHA1 from 'crypto-js/hmac-sha1';
import Base64 from 'crypto-js/enc-base64';
import { v4 as uuidv4 } from 'uuid';

const ACCOUNT_BALANCES_BASE="/v1/api/account/balances/base";
const ACCOUNT_BALANCES_POOL="/v1/api/account/balances/pool";
const ACCOUNT_BALANCES_MARKET="/v1/api/account/balances/market";
const ACCOUNT_MARKET_INVEST="/v1/api/account/market/invest";

const POOL_INFO_NEW="/v1/api/pool/info/new";
const POOL_INFO_LIST="/v1/api/pool/info/list";
const POOL_INFO_DETAIL="/v1/api/pool/info/detail";
const POOL_CAPACITY_CHANGE="/v1/api/pool/capacity/change";
const POOL_FUND_DESTROY="/v1/api/pool/fund/destroy";
const POOL_STATUS_CHANGE="/v1/api/pool/status/change";

const GIFT_INFO_NEW="/v1/api/gift/info/new";
const GIFT_CLAIM_WAITING="/v1/api/gift/claim/waiting";
const GIFT_INFO_DETAIL="/v1/api/gift/info/detail";
const GIFT_INFO_BATCH="/v1/api/gift/info/batch";
const GIFT_CLAIM_INFO_BATCH="/v1/api/gift/claim/info/batch";
const GIFT_CLAIM_ISSUED="/v1/api/gift/claim/issued";
const GIFT_INFO_FORCE_EXPIRE="/v1/api/gift/info/forceExpire";

const TRADE_PENDING_LIST="/v1/api/trade/pending/list";
const TRADE_PENDING_DETAIL="/v1/api/trade/pending/detail";
const TRADE_DEAL_BUY="/v1/api/trade/deal/buy";

export class PlanXSDK {
    appid: string;
    key: string;
    url: string;

    constructor(url: string, appid: string, key: string) {
        this.url = url;
        this.appid = appid;
        this.key = key;
    }

    sortObjectByASCII(obj:any) {
        const entries = Object.entries(obj);
        entries.sort((a, b) => a[0].localeCompare(b[0], 'en', { sensitivity: 'base' }));
        const sortedObj = Object.fromEntries(entries);
        return sortedObj;
    }

    objectToURLParams(obj: Record<string, any>): string {
        return Object.entries(obj)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    const arrayValues = `[${value.map(item => encodeURIComponent(item)).join(" ")}]`;
                    return `${encodeURIComponent(key)}=${arrayValues}`;
                } else {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                }
            })
            .join("&");
    }

    async send(type: string, url: string, data: any) {
        const _nonce = uuidv4();
        data["appid"] = this.appid;
        data["nonce"] = _nonce;
        const _url = this.objectToURLParams(this.sortObjectByASCII(data));
        const _sha1 = hmacSHA1(_url, this.key);
        const _sign = Base64.stringify(_sha1);
        return new Promise<any>((resolve, reject) => {
            axios({
                url: url,
                method: type,
                headers: {
                    appid: this.appid,
                    nonce: _nonce,
                    sign: _sign
                },
                data: data
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                resolve({
                    code: err.errno + '',
                    success: false,
                    msg: err.message,
                });
            });
        });
    }

    /**
     * Create a new superior gift pack.
     * @param poolId The unique identifier of the capital pool
     * @param giftName Gift name
     * @param giftType Gift type [ApiVars.GIFT_TYPE_AIRDROP,ApiVars.GIFT_TYPE_REDEMPTION]
     * @param quantity Generate quantity,1<=quantity<=2000
     * @param priceAmount Number of tokens for a single Gift
     * @param expiresSeconds Expiration time.Expires after specified number of seconds
     */
    async sendGiftSourceInfoNew( poolId: string,  giftName: string,  giftType: string,  quantity: number,
                                priceAmount: number,  expiresSeconds: number) {
        return this.send("post",this.url + GIFT_INFO_NEW,{
            poolId:poolId,
            giftName:giftName,
            giftType:giftType,
            quantity:quantity,
            priceAmount:priceAmount,
            expiresSeconds:expiresSeconds
        })
    }

    /**
     * Get all available sub-gift packs.
     */
    async getGiftClaimWaiting() {
        return this.send("get",this.url + GIFT_CLAIM_WAITING,{});
    }

    /**
     * Check the details of the superior gift pack corresponding to the Code.
     * @param giftSourceQrCode The unique CODE of the gift source
     */
    async getGiftSourceInfoDetail(giftSourceQrCode: string) {
        return this.send("post",this.url + GIFT_INFO_DETAIL,{
            giftSourceQrCode:giftSourceQrCode
        });
    }

    /**
     * Batch query the superior gift packs details corresponding to the code.
     * @param giftSourceQrCodes The unique CODE of the gift source
     */
    async getGiftSourceInfoBatch(giftSourceQrCodes: any) {
        return this.send("post",this.url + GIFT_INFO_BATCH,{
            giftSourceQrCodes:giftSourceQrCodes
        });
    }

    /**
     * Batch query the sub-gift packs details corresponding to the superior gift pack code.
     * @param giftSourceQrCode The unique CODE of the gift source
     * @param giftQrCode The unique CODE of the gift
     */
    async getGiftClaimInfoBatch(giftSourceQrCode: string, giftQrCode: any) {
        return this.send("post",this.url + GIFT_CLAIM_INFO_BATCH,{
            giftSourceQrCode:giftSourceQrCode,
            giftQrCode:giftQrCode
        });
    }

    /**
     * Send a sub-gift pack through the superior gift pack code.
     * @param giftSourceQrCode The unique CODE of the gift source
     */
    async sendGiftClaimIssued(giftSourceQrCode: string) {
        return this.send("post",this.url + GIFT_CLAIM_ISSUED,{
            giftSourceQrCode:giftSourceQrCode,
        });
    }

    /**
     * Forced expiration gift pack.
     * @param giftSourceQrCode The unique CODE of the gift source
     */
    async sendGiftInfoForceExpire(giftSourceQrCode: string) {
        return this.send("post",this.url + GIFT_INFO_FORCE_EXPIRE,{
            giftSourceQrCode:giftSourceQrCode,
        });
    }

    /**
     * Get balance information for all base accounts
     */
    async getAccountBalancesBase() {
        return this.send("get",this.url + ACCOUNT_BALANCES_BASE,{});
    }

    /**
     * Obtain the balance information of all fund pool accounts
     */
    async getAccountBalancesPool() {
        return this.send("get",this.url + ACCOUNT_BALANCES_POOL,{});
    }

    /**
     * Get balance information for all market accounts
     */
    async getAccountBalancesMarket() {
        return this.send("get",this.url + ACCOUNT_BALANCES_MARKET,{});
    }

    /**
     * Add funds to a designated token market account
     * @param externalOrderId External order ID,This parameter is used to mark this operation
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     * @param targetAmount The amount of tokens on the right
     */
    async sendAccountMarketInvest(externalOrderId: string, sourceSymbol: string, targetSymbol: string,
                                    targetAmount: number) {
        return this.send("post",this.url + ACCOUNT_MARKET_INVEST,{
            externalOrderId:externalOrderId,
            sourceSymbol:sourceSymbol,
            targetSymbol:targetSymbol,
            targetAmount:targetAmount
        });
    }

    /**
     * Transfer an equal amount of tokens from the base account to create a new funding pool.
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     * @param sourceAmount The amount of tokens on the left
     * @param targetAmount The amount of tokens on the right
     */
    async sendPoolInfoNew(sourceSymbol: string, targetSymbol: string,
                            sourceAmount: number, targetAmount: number) {
        return this.send("post",this.url + POOL_INFO_NEW,{
            sourceSymbol:sourceSymbol,
            targetSymbol:targetSymbol,
            sourceAmount:sourceAmount,
            targetAmount:targetAmount
        });
    }

    /**
     * Get all capital pool objects.
     */
    async getPoolInfoList() {
        return this.send("get",this.url + POOL_INFO_LIST,{});
    }

    /**
     * Get the details of a fund pool.
     * @param poolId The unique identifier of the capital pool
     */
    async getPoolInfoDetail(poolId: string) {
        return this.send("post",this.url + POOL_INFO_DETAIL,{
            poolId:poolId
        });
    }

    /**
     * Increase or decrease the assets of the fund pool.
     * @param poolId The unique identifier of the capital pool
     * @param sourceSymbol Token name on the left
     * @param sourceAmount The amount of tokens on the left
     * @param capacityAction Capacity action [ApiVars.POOL_CAPACITY_ACTION_INCREASE,ApiVars.POOL_CAPACITY_ACTION_DECREASE]
     */
    async sendPoolCapacityChange(poolId: string, sourceSymbol: string,
                                 sourceAmount: number, capacityAction: string) {
        return this.send("post",this.url + POOL_CAPACITY_CHANGE,{
            poolId:poolId,
            sourceSymbol:sourceSymbol,
            sourceAmount:sourceAmount,
            capacityAction:capacityAction
        });
    }

    /**
     * Destroys the fund pool and returns the available amount to the base account.
     * @param poolId The unique identifier of the capital pool
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     */
    async sendPoolFundDestroy(poolId: string, sourceSymbol: string, targetSymbol: string) {
        return this.send("post",this.url + POOL_FUND_DESTROY,{
            poolId:poolId,
            sourceSymbol:sourceSymbol,
            targetSymbol:targetSymbol
        });
    }

    /**
     * Modify the active status of the capital pool.
     * @param poolId The unique identifier of the capital pool
     * @param sourceSymbol Token name on the left
     * @param targetSymbol Token name on the right
     * @param poolStatus Pool status [ApiVars.POOL_STATUS_ACTIVE,ApiVars.POOL_STATUS_INACTIVE]
     */
    async sendPoolStatusChange(poolId: string, sourceSymbol: string, targetSymbol: string, poolStatus: string) {
        return this.send("post",this.url + POOL_STATUS_CHANGE,{
            poolId:poolId,
            sourceSymbol:sourceSymbol,
            targetSymbol:targetSymbol,
            poolStatus:poolStatus
        });

    }

    /**
     * Get all unfinished transactions.
     */
    async getTradePendingList() {
        return this.send("get",this.url + TRADE_PENDING_LIST,{});
    }

    /**
     * Get details according to trade ID.
     * @param tradeId Unique identifier of the trade
     */
    async getTradePendingDetail(tradeId: string) {
        return this.send("post",this.url + TRADE_PENDING_DETAIL,{
            tradeId:tradeId
        });
    }

    /**
     * The trade of purchasing the specified ID will deduct the corresponding funds from the market account.
     * Please confirm whether the funds are sufficient when calling.
     * @param tradeId Unique identifier of the trade
     */
    async sendTradeDealBuy(tradeId: string) {
        return this.send("post",this.url + TRADE_DEAL_BUY,{
            tradeId:tradeId
        });

    }
}