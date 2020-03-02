export const createBitmapByName = function(name: string): egret.Bitmap {
  let result = new egret.Bitmap();
  let texture: egret.Texture = RES.getRes(name);
  result.texture = texture;
  return result;
}

export class AssetAdapter implements eui.IAssetAdapter {
  /**
   * @language zh_CN
   * 解析素材
   * @param source 待解析的新素材标识符
   * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
   * @param thisObject callBack的 this 引用
   */
  public getAsset(source: string, compFunc:Function, thisObject: any): void {
      function onGetRes(data: any): void {
          compFunc.call(thisObject, data, source);
      }
      if (RES.hasRes(source)) {
          let data = RES.getRes(source);
          if (data) {
              onGetRes(data);
          }
          else {
              RES.getResAsync(source, onGetRes, this);
          }
      }
      else {
          RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
      }
  }
}

export class ThemeAdapter implements eui.IThemeAdapter {

  /**
   * 解析主题
   * @param url 待解析的主题url
   * @param onSuccess 解析完成回调函数，示例：compFunc(e:egret.Event):void;
   * @param onError 解析失败回调函数，示例：errorFunc():void;
   * @param thisObject 回调的this引用
   */
  public getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void {
      function onResGet(e: string): void {
          onSuccess.call(thisObject, e);
      }
      function onResError(e: RES.ResourceEvent): void {
          if (e.resItem.url == url) {
              RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
              onError.call(thisObject);
          }
      }

      if (typeof generateEUI !== 'undefined') {
          egret.callLater(() => {
              onSuccess.call(thisObject, generateEUI);
          }, this);
      }
      else if (typeof generateEUI2 !== 'undefined') {
          RES.getResByUrl("resource/gameEui.json", (data, url) => {
              window["JSONParseClass"]["setData"](data);
              egret.callLater(() => {
                  onSuccess.call(thisObject, generateEUI2);
              }, this);
          }, this, RES.ResourceItem.TYPE_JSON);
      }
      else if (typeof generateJSON !== 'undefined') {
          if (url.indexOf(".exml") > -1) {
              let dataPath = url.split("/");
              dataPath.pop();
              let dirPath = dataPath.join("/") + "_EUI.json";
              if (!generateJSON.paths[url]) {
                  RES.getResByUrl(dirPath, (data) => {
                      window["JSONParseClass"]["setData"](data);
                      egret.callLater(() => {
                          onSuccess.call(thisObject, generateJSON.paths[url]);
                      }, this);
                  }, this, RES.ResourceItem.TYPE_JSON);
              } else {
                  egret.callLater(() => {
                      onSuccess.call(thisObject, generateJSON.paths[url]);
                  }, this);
              }
          }
          else {
              egret.callLater(() => {
                  onSuccess.call(thisObject, generateJSON);
              }, this);
          }
      }
      else {
          RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
          RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
      }
  }
}

declare var generateEUI: { paths: string[], skins: any }
declare var generateEUI2: { paths: string[], skins: any }
declare var generateJSON: { paths: string[], skins: any }