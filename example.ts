import {PlanXSDK} from "./planx_sdk";

var Planxsdk = new PlanXSDK("http://192.168.1.200:8886","cg7Zqpb4","842c2d804f5b5e9bba7a35436d9585b26bca4c69");

async function test(){
    var _data = await Planxsdk.getGiftSourceInfoBatch(["1E44BA0A-6D95-450B-9D0D-9F934FC5EFCA",
    "215FF713-D8C5-44DD-9597-9CCD722BE39E","498DDBA1-E4AD-45CD-A9A1-27A11DDC201B"]);
    console.log(_data);
}

test();