import Settings from "./settings";
import TestingStore from "./testing";
import Record from "./record";
import Client from "./client";
import Common from "./common";

let settings = new Settings();
let testingStore = new TestingStore();
let record = new Record();
let client = new Client();
let common = new Common();
// const stores = {
//   settings,
//   testing,
// };
/// 默认导出接口
export { settings, testingStore, record, client, common };
