
## 测试
```json
  "masDev": {
      "type": "development",
      "hardenedRuntime": false,
      "entitlements": "build/entitlements.mas.plist",
      "entitlementsInherit": "build/entitlements.mas.inherit.plist",
      "provisioningProfile": "build/pngdev.provisionprofile"
    },
 
```

## appStore
```json
   "mas": {
      "type": "distribution",
      "hardenedRuntime": false,
      "entitlements": "build/entitlements.mas.plist",
      "entitlementsInherit": "build/entitlements.mas.inherit.plist",
      "provisioningProfile": "build/pngprod.provisionprofile"
    },
```

## 签名
windows打包时移除
```json
"build":{
  "afterSign": "./build/notarize.js",
}
```

## 1、开始
```
electron-windows-store
```

## 配置
```
C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64
```

## windows商店
```
electron-windows-store --input-directory E:\独立开发项目\png-ting\pkg\win-unpacked --output-directory E:\独立开发项目\png-ting\pkg --version 1.0.0.0 --package-name ‘TinyJpg’ --package-display-name ‘TinyJpg’ --package-description ‘Image compression’ --publisher-display-name ‘jiuDuanDaoKe’ —-identity-name ‘3928jiuDuanDaoKe.TinyJpg’  -a E:\独立开发项目\png-ting\build\Resources
```
