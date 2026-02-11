# 塔科夫工艺

## 这是什么？
这是一个针对 [SPT](https://www.sp-tarkov.com "该项目的主要目标是为官方 BSG 客户端提供单人离线体验和现成的进程。现在，您可以在等待其服务器重新上线、离线或需要远离作弊者休息时玩《逃离塔科夫》。") 的模组，您可以使用它来为游戏添加自定义配方。

## 使用方法
### 添加配方
要添加配方，请进入 `crafts` 文件夹，并将您的配方放入 `crafts.json` 中。(您可以使用 [此工具](https://vinihns.github.io/TarkovCraft/) 来创建 JSON)。 
###### 如果您的 `crafts.json` 中已经有配方，只需在 `[ ]` 中添加您的配方，但请小心逗号的使用，例如：[ {"craft1"}, {"craft2"} ]。

配方必须是具有以下结构的 JSON 文件：

```json
// 区域类型：
    |-----------------------------------------------------|
    |     **名称**          | **区域ID** | **最大等级**   |
    | --------------------- | ---------- | -----------    |
    | 通风口                | 0          | 3              |
    | 安全门                  | 1          | 3              |
    | 卫生间                | 2          | 3              |
    | 仓库                | 3          | 4              |
    | 发电机                | 4          | 3              |
    | 供暖                  | 5          | 3              |
    | 集水器                | 6          | 3              |
    | 医疗站                | 7          | 3              |
    | 营养单位              | 8          | 3              |
    | 休息室                | 9          | 3              |
    | 工作台                | 10         | 3              |
    | 情报中心              | 11         | 3              |
    | 射击场                | 12         | 3              |
    | 图书馆                | 13         | 1              |
    | 掠夺箱                | 14         | 1              |
    | 照明                  | 15         | 3              |
    | 名人堂                | 16         | 3              |
    | 空气过滤单位          | 17         | 1              |
    | 太阳能                | 18         | 1              |
    | 酒精生成器            | 19         | 1              |
    | 比特币农场            | 20         | 3              |
    | 圣诞树                | 21         | 1              |
    | 破碎的墙              | 22         | 6              |
    | 体育馆                | 23         | 1              |
    | 武器架                | 24         | 3              |
    | 武器架-辅助           | 25         | 3              |
    | 装备架                | 26         | 3              |
    | 邪教圈                | 27         | 1              |
    |-----------------------------------------------------|

// 以下是一个常见工艺配方的示例，您可以使用 [此工具](https://vinihns.github.io/TarkovCraft/) 来创建 JSON。

// JSON 结构：
[
    {
    "_id": "unique_id_mongoID",
    "areaType": "area_type_number",
    "requirements": [
        {
        "areaType": "area_type_number",
        "requiredLevel": "required_level_number",
        "type": "Area" // 请勿修改
        },

        // 这里你可以放置配方所需的物品
        {
        "templateId": "item_id",
        "count": 1, // 所需物品数量
        "isFunctional": false, // 请勿修改
        "isEncoded": false, // 请勿修改
        "type": "Item" // 请勿修改
        },

        // 这是可选的，但如果你想向配方添加工具，可以这样做：
        { 
        "templateId": "item_id",
        "type": "Tool"
        }
    ],
    "productionTime": 3600, // 以秒为单位
    "needFuelForAllProductionTime": false, // 不言自明
    "locked": false, // 请勿修改
    "endProduct": "unique_id_mongoID", // 最终产品的物品 ID
    "continuous": false,
    "count": 1, // 最终产品的数量
    "productionLimitCount": 0, 
    "isEncoded": false,
    "isCodeProduction": false
    }, <- //如果要添加多个配方，请记住在它们之间放置逗号
]
```

## 安装

只需将 `user` 文件夹放入您的 `SPT` 游戏安装目录中即可。

## 许可证

该模组采用 [MIT 许可证](LICENSE) 授权。