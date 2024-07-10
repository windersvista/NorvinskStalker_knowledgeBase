# 哥布林王的mod.ts拆解

> [!NOTE] 好奇猫注：
> 以下内容是根据copilot对哥布林王的src/GoblinKing.ts中每一段代码的解释所归纳，如有错误，均由Copilot负责（bushi
> 之所以要做拆解，是因为在移植代码前，起码我们要知道它是怎么工作的。

## 总结

**先说结论，这个文件里的代码大概可以归结为一条编写代码的逻辑链条：**
**创建商人——>注册商人——>将商人相关的所有信息注入到游戏——>定义单个物品的属性、定义以物易物物品的属性、定义一组物品的属性 ——>将已定义属性的物品加入售卖列表——>将这个售卖列表添加给商人。**

---
### 导入模块

```
/* eslint-disable @typescript-eslint/naming-convention */
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import { IBarterScheme, ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { QuestController } from "../controllers/QuestController";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { Money } from "@spt-aki/models/enums/Money";
import { QuestRewardType } from "@spt-aki/models/enums/QuestRewardType";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { RagfairPriceService } from "@spt-aki/services/RagfairPriceService";
import { ImporterUtil } from "@spt-aki/utils/ImporterUtil";
import { DependencyContainer} from "tsyringe";
import { Traders } from "@spt-aki/models/enums/Traders";

import * as ConfigJson from "../config/config.json";
import * as GoblinKingJson from "../db/GoblinKing.json";
import * as QuestAssortJson from "../db/questassort.json";
```

这段代码是 TypeScript 语言编写的，主要做了以下几件事情：

1. **禁用了一条 ESLint 规则**：`/* eslint-disable @typescript-eslint/naming-convention */` 这行代码是用来禁用 ESLint 中的一个命名规则的。ESLint 是一个用来检查 JavaScript 代码质量和风格的工具，`@typescript-eslint/naming-convention` 是它的一个规则，用来检查变量、函数等的命名是否符合一定的规范。
    
2. **导入了一些模块**：`import { ... } from "...";` 这些行代码是用来导入其他模块中的功能或数据的。例如，`import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";` 这行代码导入了 `@spt-aki/loaders/PreAkiModLoader` 模块中的 `PreAkiModLoader` 功能。
    
3. **导入了一些 JSON 文件**：`import * as ConfigJson from "../config/config.json";` 这类代码是用来导入 JSON 文件的。`* as ConfigJson` 表示将导入的 JSON 文件的所有内容赋值给 `ConfigJson` 变量。

---
### 创建商人类

```
class GoblinKing implements IPreAkiLoadMod, IPostDBLoadMod
{
    modName: string;
    logger: ILogger;
    mydb: any;
    constructor()
    {
        this.modName = "GoblinKing";
    }
```

这段代码正在创建一个名为 `GoblinKing` 的类，它实现了 `IPreAkiLoadMod` 和 `IPostDBLoadMod` 接口。这个类有三个属性：`modName`、`logger` 和 `mydb`。在构造函数中，你已经将 `modName` 初始化为 “GoblinKing”。

---
### 注册商人

```
preAkiLoad(container: DependencyContainer): void
    {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.modName}] preAki Loading... `);
        this.setupTraderUpdateTime(container);
        this.registerProfileImage(container);
        this.registerStaticRouter(container);

        //Chomp made me add this to get messages to work. Say "thank you." In Sicilia we say, "vaffenculo," In Espania we say, "vete a la mierda."
        Traders[GoblinKingJson._id] = GoblinKingJson._id;
        this.logger.debug(`[${this.modName}] preAki Loaded`);
    }
```

这是 `GoblinKing` 类的 `preAkiLoad` 方法，它接收一个名为 `container` 的 `DependencyContainer` 类型参数。这个方法主要做了以下几件事情：

1. 使用 `container.resolve<ILogger>("WinstonLogger")` 来获取一个 `ILogger` 类型的 `logger` 实例，并将其赋值给 `this.logger`。
    
2. 使用 `this.logger.debug` 输出一条调试信息，表示 `preAki` 正在加载。
    
3. 调用 `this.setupTraderUpdateTime(container)`、`this.registerProfileImage(container)` 和 `this.registerStaticRouter(container)` 这三个方法。这些方法可能是用来设置交易者更新时间、注册个人资料图片和注册静态路由的。
    
4. 将 `GoblinKingJson._id` 的值赋给 `Traders[GoblinKingJson._id]`。这可能是为了在交易者列表中添加一个新的交易者。
    
5. 最后，再次使用 `this.logger.debug` 输出一条调试信息，表示 `preAki` 已经加载完成。

---
### 将商人添加进本地

```
postDBLoad(container: DependencyContainer): void

    {
        this.logger.debug(`[${this.modName}] postDB Loading... `);
        this.loadMyDB(container);
        this.add556SludgeToGuns(container);
        this.addQuestZones(container);
        this.addTraderToDb(container);
        this.addTraderToLocales(
            container,
            GoblinKingJson.name,
            "Goblin",
            GoblinKingJson.nickname,
            GoblinKingJson.location,
            "Originally from El Paso, Texas. Oscar Vasquez ended up in Tarkov during a supply drop off during the Contract Wars when his chopper was shot down by anti air missles. Unable to get home Oscar decided to take advantage of the crisis in the region setting up a network of medical supplies and storage. Don't be fooled by his cheery candor. Oscar isn't particular with how he gains product and will use any means necessary. Many question his true motive and goal in Norvinsk and his prices aren't exactly fair. This reputation and being only five foot five, earned him the nickname 'Goblin'"
        );
        this.addTraderToFleaMarket(container);
        this.addItemsToDb(container);
        this.addItemsToLocales(container);
        this.addHandbookToDb(container);
        this.addBuffsToDb(container);
        this.logger.debug(`[${this.modName}] postDB Loaded`);
        this.logger.log(`[${this.modName}] Goblin King Active`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] Spreading marigolds and painting sugar skulls for the ofrenda.`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] Passing the blizzy to Hephaestus.`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] Please report bugs in the mod's comments or support thread.`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] Special thanks to the boys`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] Pour one for the dead homies`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] Bienvenido a Tarkov`, LogTextColor.RED);
    }
```

这是 `GoblinKing` 类的 `postDBLoad` 方法，它接收一个名为 `container` 的 `DependencyContainer` 类型参数。这个方法主要做了以下几件事情：

1. 使用 `this.logger.debug` 输出一条调试信息，表示 `postDB` 正在加载。
    
2. 调用 `this.loadMyDB(container)` 方法，可能是用来加载数据库。
    
3. 调用 `this.add556SludgeToGuns(container)`、`this.addQuestZones(container)` 和 `this.addTraderToDb(container)` 这三个方法。这些方法可能是用来给枪添加556污泥、添加任务区域和将交易者添加到数据库中。
    
4. 调用 `this.addTraderToLocales` 方法，将一个交易者添加到本地。这个交易者的名字是 `GoblinKingJson.name`，昵称是 `GoblinKingJson.nickname`，位置是 `GoblinKingJson.location`，并且有一个背景故事。
    
5. 调用 `this.addTraderToFleaMarket(container)` 方法，可能是将交易者添加到跳蚤市场。
    
6. 调用 `this.addItemsToDb(container)` 和 `this.addItemsToLocales(container)` 方法，可能是将物品添加到数据库和本地。
    
7. 调用 `this.addHandbookToDb(container)` 和 `this.addBuffsToDb(container)` 方法，可能是将手册和增益效果添加到数据库。
    
8. 最后，使用 `this.logger.debug` 输出一条调试信息，表示 `postDB` 已经加载完成。
    
9. 使用 `this.logger.log` 输出一些日志信息，可能是用来记录一些状态或者给用户一些提示。

---
### 设定商人的更新时间

```
private setupTraderUpdateTime(container: DependencyContainer): void

    {
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const updateTime: UpdateTime = {
            traderId: GoblinKingJson._id,
            seconds: 3600
        };
        traderConfig.updateTime.push(updateTime);
    }
```

这是 `GoblinKing` 类的 `setupTraderUpdateTime` 方法，它接收一个名为 `container` 的 `DependencyContainer` 类型参数。这个方法主要做了以下几件事情：

1. 使用 `container.resolve<ConfigServer>("ConfigServer")` 来获取一个 `ConfigServer` 类型的 `configServer` 实例。
    
2. 使用 `configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)` 来获取一个 `ITraderConfig` 类型的 `traderConfig` 实例。
    
3. 创建一个名为 `updateTime` 的对象，其中 `traderId` 是 `GoblinKingJson._id`，`seconds` 是 `3600`。这可能是用来设置交易者的更新时间。
    
4. 将 `updateTime` 对象添加到 `traderConfig.updateTime` 数组中。

---
### 设置商人的头像

```
private registerProfileImage(container: DependencyContainer): void

    {
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const imageFilepath = `./${preAkiModLoader.getModPath(this.modName)}res`;
        imageRouter.addRoute(GoblinKingJson.avatar.replace(".png", ""), `${imageFilepath}/GoblinKingMidJourneythumbnail.png`);
    }
```

这是 `GoblinKing` 类的 `registerProfileImage` 方法，它接收一个名为 `container` 的 `DependencyContainer` 类型参数。这个方法主要做了以下几件事情：

1. 使用 `container.resolve<PreAkiModLoader>("PreAkiModLoader")` 来获取一个 `PreAkiModLoader` 类型的 `preAkiModLoader` 实例。
    
2. 使用 `container.resolve<ImageRouter>("ImageRouter")` 来获取一个 `ImageRouter` 类型的 `imageRouter` 实例。
    
3. 创建一个名为 `imageFilepath` 的字符串，它是 `preAkiModLoader.getModPath(this.modName)` 和 `"res"` 的组合。这可能是用来获取图片的文件路径。
    
4. 调用 `imageRouter.addRoute` 方法，将 `GoblinKingJson.avatar.replace(".png", "")` 作为路由，将 `${imageFilepath}/GoblinKingMidJourneythumbnail.png` 作为该路由的图片路径。这可能是用来注册个人资料图片的。

---
### 静态路由

```
private registerStaticRouter(container: DependencyContainer): void
    {
        const staticRouterModService: StaticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        staticRouterModService.registerStaticRouter(
            "GoblinKingUpdateLogin",
            [
                {
                    url: "/launcher/profile/login",
                    action: (url: string, info: any, sessionId: string, output: string) =>
                    {
                        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
                        const databaseTables: IDatabaseTables = databaseServer.getTables();
                        databaseTables.traders[GoblinKingJson._id].assort = this.createAssortTable(container, sessionId);
                        return output;
                    }
                }
            ],
            "aki"
        );
        staticRouterModService.registerStaticRouter(
            "GoblinKingUpdate",
            [
                {
                    url: "/client/game/profile/items/moving",
                    action: (url: string, info: any, sessionId: string, output: string) =>
                    {
                        if (info.data[0].Action != "Examine")
                        {
                            const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
                            const databaseTables: IDatabaseTables = databaseServer.getTables();
                            databaseTables.traders[GoblinKingJson._id].assort = this.createAssortTable(container, sessionId);

                        }
                        return output;
                    }
                }
            ],
            "aki"
        );
    }
```

这段代码定义了一个名为 `registerStaticRouter` 的方法，该方法用于在 `StaticRouterModService` 中注册静态路由。这些路由用于处理特定的 URL 请求。每个静态路由都有一个唯一的名称，一个或多个 URL，以及一个对应的动作函数。

在这个例子中，注册了两个静态路由：`GoblinKingUpdateLogin` 和 `GoblinKingUpdate`。

1. `GoblinKingUpdateLogin`：当 URL 为 `/launcher/profile/login` 时，会执行对应的动作函数。这个函数会从容器中获取 `DatabaseServer`，然后获取数据库表 `databaseTables`。然后，它会更新 `GoblinKingJson._id` 对应的交易者的商品排序表 `assort`。最后，函数返回 `output`。
    
2. `GoblinKingUpdate`：当 URL 为 `/client/game/profile/items/moving` 时，会执行对应的动作函数。这个函数首先检查 `info.data[0].Action` 是否不等于 `"Examine"`。如果不等于，那么它会执行类似 `GoblinKingUpdateLogin` 的操作：从容器中获取 `DatabaseServer`，获取数据库表 `databaseTables`，更新 `GoblinKingJson._id` 对应的交易者的商品排序表 `assort`。最后，函数返回 `output`。

这样，每当有一个请求到达这些注册的 URL 时，就会执行相应的动作函数，从而实现特定的功能。这是一种常见的路由注册和处理模式，用于处理不同的网络请求。在这个特定的情况下，它被用于更新游戏中的交易者的商品排序表。

---
### 向商人售卖列表添加单个以物易物的商品

```
private addSingleItemToAssortWithBarterScheme(assortTable: ITraderAssort, itemTpl: string, unlimitedCount: boolean, stackCount: number, loyaltyLevel: number, barterSchemes: IBarterScheme[][]): void

    {

        const newItem: Item = {
            _id: itemTpl,
            _tpl: itemTpl,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: unlimitedCount,
                StackObjectsCount: stackCount
            }
        };
        assortTable.items.push(newItem);
        assortTable.barter_scheme[itemTpl] = barterSchemes;

        if (loyaltyLevel)
        {
            assortTable.loyal_level_items[itemTpl] = loyaltyLevel;
        }
    }
```

这段代码定义了一个名为 `addSingleItemToAssortWithBarterScheme` 的方法，该方法用于向交易者的商品排序表 `assortTable` 中添加单个商品，并设置其交易方案 `barterSchemes`。

这个方法接收以下参数：

- `assortTable`：交易者的商品排序表。
- `itemTpl`：商品的模板 ID。
- `unlimitedCount`：一个布尔值，表示商品的数量是否无限。
- `stackCount`：商品的堆叠数量。
- `loyaltyLevel`：需要的忠诚度等级。
- `barterSchemes`：商品的交易方案。

在方法体中，首先创建了一个新的商品对象 `newItem`，并设置其 `_id`、`_tpl`、`parentId`、`slotId` 和 `upd` 属性。其中，`upd` 属性包含了 `UnlimitedCount` 和 `StackObjectsCount` 两个字段，分别对应商品的数量是否无限和商品的堆叠数量。

然后，将新创建的商品对象 `newItem` 添加到 `assortTable.items` 数组中。

接着，将商品的交易方案 `barterSchemes` 添加到 `assortTable.barter_scheme` 对象中，键为商品的模板 ID `itemTpl`。

最后，如果提供了 `loyaltyLevel` 参数，那么将其添加到 `assortTable.loyal_level_items` 对象中，键也为商品的模板 ID `itemTpl`。

这样，就完成了向交易者的商品排序表中添加单个商品，并设置其交易方案的操作。

---
### 向商人的售卖列表添加单个商品

```
private addSingleItemToAssort(assortTable: ITraderAssort, itemTpl: string, unlimitedCount: boolean, stackCount: number, loyaltyLevel: number, currencyType: Money | string, currencyValue: number): void
    {
        this.addSingleItemToAssortWithBarterScheme(assortTable, itemTpl, unlimitedCount, stackCount, loyaltyLevel, [
            [
                {
                    count: currencyValue,
                    _tpl: currencyType
                }
            ]
        ]);
    }
```

这段代码定义了一个名为 `addSingleItemToAssort` 的方法，该方法用于向交易者的商品排序表 `assortTable` 中添加单个商品，并设置其交易方案。

这个方法接收以下参数：

- `assortTable`：交易者的商品排序表。
- `itemTpl`：商品的模板 ID。
- `unlimitedCount`：一个布尔值，表示商品的数量是否无限。
- `stackCount`：商品的堆叠数量。
- `loyaltyLevel`：需要的忠诚度等级。
- `currencyType`：交易货币的类型。
- `currencyValue`：交易货币的数量。

在方法体中，它调用了 `addSingleItemToAssortWithBarterScheme` 方法，将商品添加到 `assortTable` 中，并设置其交易方案。交易方案是一个二维数组，其中每个元素是一个对象，包含 `count`（交易货币的数量）和 `_tpl`（交易货币的类型）两个字段。

这样，就完成了向交易者的商品排序表中添加单个商品，并设置其交易方案的操作。这个方法提供了一种方便的方式，可以直接使用货币类型和数量来设置交易方案，而不需要手动创建交易方案对象。

---
### 向商人的售卖列表添加一组商品

```
private addCollectionToAssort(assortTable: ITraderAssort, items: Item[], unlimitedCount: boolean, stackCount: number, loyaltyLevel: number, currencyType: Money | string, currencyValue: number): void

    {
        const collectionToAdd: Item[] = JSON.parse(JSON.stringify(items));
        collectionToAdd[0].upd = {
            UnlimitedCount: unlimitedCount,
            StackObjectsCount: stackCount
        };
        collectionToAdd[0].parentId = "hideout";
        collectionToAdd[0].slotId = "hideout";
        assortTable.items.push(...collectionToAdd);
        assortTable.barter_scheme[collectionToAdd[0]._id] = [
            [
                {
                    count: currencyValue,
                    _tpl: currencyType
                }
            ]
        ];
        assortTable.loyal_level_items[collectionToAdd[0]._id] = loyaltyLevel;

    }
```

这段代码定义了一个名为 `addCollectionToAssort` 的方法，该方法用于向交易者的商品排序表 `assortTable` 中添加一组商品，并设置它们的交易方案。

这个方法接收以下参数：

- `assortTable`：交易者的商品排序表。
- `items`：一个商品对象的数组。
- `unlimitedCount`：一个布尔值，表示商品的数量是否无限。
- `stackCount`：商品的堆叠数量。
- `loyaltyLevel`：需要的忠诚度等级。
- `currencyType`：交易货币的类型。
- `currencyValue`：交易货币的数量。

在方法体中，首先创建了一个新的商品数组 `collectionToAdd`，这是 `items` 的深拷贝。

然后，设置 `collectionToAdd` 中第一个商品的 `upd` 属性，其中包含了 `UnlimitedCount` 和 `StackObjectsCount` 两个字段，分别对应商品的数量是否无限和商品的堆叠数量。同时，设置该商品的 `parentId` 和 `slotId` 为 `"hideout"`。

接着，将 `collectionToAdd` 中的所有商品添加到 `assortTable.items` 数组中。

然后，将商品的交易方案添加到 `assortTable.barter_scheme` 对象中，键为 `collectionToAdd` 中第一个商品的 `_id`。交易方案是一个二维数组，其中每个元素是一个对象，包含 `count`（交易货币的数量）和 `_tpl`（交易货币的类型）两个字段。

最后，将 `loyaltyLevel` 添加到 `assortTable.loyal_level_items` 对象中，键也为 `collectionToAdd` 中第一个商品的 `_id`。

这样，就完成了向交易者的商品排序表中添加一组商品，并设置它们的交易方案的操作。这个方法提供了一种方便的方式，可以直接使用货币类型和数量来设置交易方案，而不需要手动创建交易方案对象。

---
## ==向商人的售卖列表添加玩家武器预设==

```
private getPresets(container: DependencyContainer, assortTable, currency, profiles) {
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const RagfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService");
        let pool = [];
        for (let p in (profiles || [])) {
            for (let wbk in profiles[p].userbuilds.weaponBuilds) {
                let wb = profiles[p].userbuilds.weaponBuilds[wbk];
                let preItems = wb.items;
                let id = preItems[0]._id;
                let tpl = preItems[0]._tpl;
                if (pool.includes(id)) {
                    continue;
                }
                pool.push(id)
                preItems[0] = {
                    "_id": id,
                    "_tpl": tpl,
                    "parentId": "hideout",
                    "slotId": "hideout",
                    "BackgroundColor": "yellow",
                    "upd": {
                        "UnlimitedCount": true,
                        "StackObjectsCount": 2000
                    },
                    "preWeapon": true
                };
                let preItemsObj = jsonUtil.clone(preItems);
                for (let preItemObj of preItemsObj) {
                    assortTable.items.push(preItemObj);
                }
                let config;
                try {
                    config = require(`../config/config.json`);
                } catch (e) {
                }
                let price = (config || {}).cost || 7500;
                try {
                    price = RagfairPriceService.getDynamicOfferPriceForOffer(preItems,currency);
                } catch (error) {
                }
                let offerRequire = [
                    {
                        "count": price,
                        "_tpl": currency
                    }
                ];
                assortTable.barter_scheme[id] = [offerRequire];
                assortTable.loyal_level_items[id] = 1;
            }
        };
        return assortTable;
    }
```

这段代码定义了一个名为 `getPresets` 的方法，该方法用于向交易者的商品排序表 `assortTable` 中添加一组预设的商品，并设置它们的交易方案。

这个方法接收以下参数：

- `container`：依赖容器，用于解析和获取服务。
- `assortTable`：交易者的商品排序表。
- `currency`：交易货币的类型。
- `profiles`：包含用户构建的武器的配置文件。

在方法体中，首先从容器中解析并获取 `JsonUtil` 和 `RagfairPriceService` 两个服务。然后，遍历 `profiles` 中的每个配置文件和每个武器构建。

对于每个武器构建，首先检查其第一个商品的 `_id` 是否已经在 `pool` 中。如果已经存在，则跳过当前循环。否则，将 `_id` 添加到 `pool` 中，并设置商品的各种属性，包括 `_id`、`_tpl`、`parentId`、`slotId`、`BackgroundColor` 和 `upd`。然后，将商品添加到 `assortTable.items` 中。

接着，尝试从 `../config/config.json` 文件中读取配置。如果读取失败，则使用默认的价格 `7500`。然后，尝试使用 `RagfairPriceService.getDynamicOfferPriceForOffer` 方法获取动态的报价价格。如果获取失败，则使用之前的价格。

然后，创建一个交易要求 `offerRequire`，包含交易货币的数量和类型。将交易要求添加到 `assortTable.barter_scheme` 中，键为商品的 `_id`。同时，将忠诚度等级 `1` 添加到 `assortTable.loyal_level_items` 中，键也为商品的 `_id`。

最后，返回更新后的 `assortTable`。

这样，就完成了向交易者的商品排序表中添加一组预设的商品，并设置它们的交易方案的操作。这个方法提供了一种方便的方式，可以直接使用货币类型和数量来设置交易方案，而不需要手动创建交易方案对象。

---
## 一个无意义的空模块

```
private getContainers(container: DependencyContainer, assortTable, currency, profiles) {
        for (let p in (profiles || [])) {
        }
    }
```

这段代码定义了一个名为 `getContainers` 的函数，它接受四个参数：`container`、`assortTable`、`currency` 和 `profiles`。然而，函数的主体部分（即 `{}` 中的内容）是空的，所以目前这个函数并没有实现任何功能。

在这个函数中，有一个 `for...in` 循环，它试图遍历 `profiles` 参数。如果 `profiles` 是 `undefined` 或 `null`，那么它会被转换为一个空数组（`[]`）。然而，由于函数体是空的，所以即使 `profiles` 中有元素，这个循环也不会执行任何操作。

总的来说，这个函数的目的不清楚，因为它没有实现任何功能。

---
### 将之前和需要写死的物品放进售货清单

```
private createAssortTable(container: DependencyContainer, sessionId?: string): ITraderAssort
    {
        const importer = container.resolve("ImporterUtil");
        let assortTable: ITraderAssort = {
            nextResupply: 0,
            items: [],
            barter_scheme: {},
            loyal_level_items: {},
        }
        let currency = "5696686a4bdc2da3298b456a"
        let config;
        try {
            config = require(`../config/config.json`);
        } catch (e) {
        }
        let profiles = {};
        if (sessionId) {
            let t = container.resolve("ProfileHelper").getFullProfile(sessionId)
            profiles = { [sessionId]: t };
        } else {
            profiles = importer.loadRecursive('user/profiles/');
        }
        try {
            assortTable = this.getPresets(container, assortTable, (config || {}).currency || currency, profiles);
            console.log(assortTable)
        } catch (error) {
            console.error(error);
        };

        const MILK_ID = "575146b724597720a27126d5";
        const SICCP_ID = "5d235bb686f77443f4331278";
        const THWEAPON_ID = "5b6d9ce188a4501afc1b2b25";
        const THITEMCASE_ID = "5c0a840b86f7742ffa4f2482";
        const CASEITEM_ID = "59fb042886f7746c5005a7b2";
        const WEAPONCASE_ID = "59fb023c86f7746d0d4b423c";
        const MEDCASE_ID = "5aafbcd986f7745e590fff23";
        const MONEYCASE_ID = "59fb016586f7746d0d4b423a";
        const FOODCASE_ID = "5c093db286f7740a1b2617e3";
        const MAGBOX_ID = "5c127c4486f7745625356c13";
        const AMMOCASE_ID = "5aafbde786f774389d0cbc0f";
        const PACA_ID = "62a09d79de7ac81993580530";
		……

        this.addSingleItemToAssortWithBarterScheme(assortTable, "GoblinsIfak", true, 999999999, 1, [ConfigJson.items.GoblinsIfak.map((value) => ({ _tpl: value.BarterItem, count: value.BarterPrice }))]);
        this.addSingleItemToAssortWithBarterScheme(assortTable, "GoblinsMedCase", true, 999999999, 2, [ConfigJson.items.AbuelasPillBox.map((value) => ({ _tpl: value.BarterItem, count: value.BarterPrice }))]);
        this.addSingleItemToAssortWithBarterScheme(assortTable, "GoblinsBoltHole", true, 999999999, 1, [ConfigJson.items.TiosChest.map((value) => ({ _tpl: value.BarterItem, count: value.BarterPrice }))]);
        this.addSingleItemToAssortWithBarterScheme(assortTable, "GoblinsBackpack", true, 999999999, 1, [ConfigJson.items.TreasureBag.map((value) => ({ _tpl: value.BarterItem, count: value.BarterPrice }))]);
        this.addSingleItemToAssortWithBarterScheme(assortTable, "lightningstim", true, 999999999, 2, [ConfigJson.items.AbuelosLightingJuice.map((value) => ({ _tpl: value.BarterItem, count: value.BarterPrice }))]);
        this.addSingleItemToAssortWithBarterScheme(assortTable, "ElDiablosBlood", true, 999999999, 3, [ConfigJson.items.ElDiablosBlood.map((value) => ({ _tpl: value.BarterItem, count: value.BarterPrice }))]);
……

type SingleItemBarterScheme = { itemTpl: string; unlimitedCount: boolean; stackCount: number; loyaltyLevel: 1 | 2 | 3 | 4; currencyType: Money | string; currencyValue: number };

const singleItemBarterSchemes: SingleItemBarterScheme[] = [
            { itemTpl: xtg12_id, unlimitedCount: false, stackCount: 10, loyaltyLevel: 1, currencyType: Money.ROUBLES, currencyValue: 20000 },
            { itemTpl: obdolbos_id, unlimitedCount: false, stackCount: 10, loyaltyLevel: 1, currencyType: Money.ROUBLES, currencyValue: 50000 },
            { itemTpl: meldonin_id, unlimitedCount: false, stackCount: 10, loyaltyLevel: 2, currencyType: Money.ROUBLES, currencyValue: 75000 },
            { itemTpl: zagustin_id, unlimitedCount: false, stackCount: 10, loyaltyLevel: 3, currencyType: Money.ROUBLES, currencyValue: 150000 },
            { itemTpl: etg_id, unlimitedCount: false, stackCount: 10, loyaltyLevel: 3, currencyType: Money.ROUBLES, currencyValue: 100000 },
            { itemTpl: l1_id, unlimitedCount: false, stackCount: 10, loyaltyLevel: 3, currencyType: Money.ROUBLES, currencyValue: 100000 },
……
        ];
        singleItemBarterSchemes.forEach((singleItemBarterScheme: SingleItemBarterScheme) =>
            this.addSingleItemToAssort(
                assortTable,
                singleItemBarterScheme.itemTpl,
                singleItemBarterScheme.unlimitedCount,
                singleItemBarterScheme.stackCount,
                singleItemBarterScheme.loyaltyLevel,
                singleItemBarterScheme.currencyType,
                singleItemBarterScheme.currencyValue
            )
        );
        return assortTable;
    }
```

这段代码定义了一个名为 `createAssortTable` 的函数，它接受两个参数：`container` 和 `sessionId`。这个函数的主要功能是创建一个交易商的商品表（assortment table）。

以下是这个函数的主要步骤：

1. 首先，它创建了一个名为 `assortTable` 的对象，该对象包含了交易商的商品表的初始状态，包括 `nextResupply`、`items`、`barter_scheme` 和 `loyal_level_items`。
    
2. 然后，它尝试从 `../config/config.json` 文件中加载配置信息。如果加载失败，它会捕获异常并继续执行。
    
3. 接下来，它根据 `sessionId` 是否存在来获取用户的配置文件。如果 `sessionId` 存在，它会获取对应的完整配置文件；否则，它会递归加载 `user/profiles/` 目录下的所有配置文件。
    
4. 然后，它尝试调用 `getPresets` 方法来获取预设的商品表，并将结果赋值给 `assortTable`。如果在这个过程中发生错误，它会捕获异常并打印错误信息。
    
5. 最后，它会调用 `addSingleItemToAssortWithBarterScheme` 和 `addSingleItemToAssort` 方法来向 `assortTable` 中添加商品。这些商品的信息是硬编码在函数中的。
    

函数的最后，返回了填充了商品信息的 `assortTable`。

总的来说，这个函数的主要功能是根据给定的参数和预设的商品信息，创建一个交易商的商品表。这个商品表可以用于在游戏中展示交易商的商品供玩家购买。

---
### 创建商人数据库

```
private loadMyDB(container: DependencyContainer)
    {
        const databaseImporter: ImporterUtil = container.resolve<ImporterUtil>("ImporterUtil");
        const preAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");

        this.mydb = databaseImporter.loadRecursive(`${preAkiModLoader.getModPath(this.modName)}db/`);
    }
```

这段代码定义了一个名为 `loadMyDB` 的函数，它接受一个参数：`container`。这个函数的主要功能是加载数据库。
以下是这个函数的主要步骤：

1. 首先，它从 `container` 中解析出 `ImporterUtil` 和 `PreAkiModLoader` 两个实例，分别赋值给 `databaseImporter` 和 `preAkiModLoader`。
    
2. 然后，它调用 `databaseImporter.loadRecursive` 方法来递归加载数据库。加载的路径是由 `preAkiModLoader.getModPath(this.modName)` 和 `'db/'` 拼接而成的。
    
3. 最后，它将加载的结果赋值给 `this.mydb`。
    

总的来说，这个函数的主要功能是加载并存储数据库。这个数据库可能包含了游戏的各种数据，例如物品信息、角色信息等。

### 让游戏内武器和弹夹可以使用556Sludge子弹

```
private add556SludgeToGuns(container: DependencyContainer): void
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();

        const weapons: string[] = [
            "5ac66cb05acfc40198510a10", // ak101
            "5ac66d015acfc400180ae6e4", // ak102
            "62e7c4fba689e8c9c50dfc38", // augA1
            "63171672192e68c5460cebc5", // augA3
            "5c488a752e221602b412af63", // dtmdr
            ……
        ];
        for (const weapon of weapons)
        {
databaseTables.templates.items[weapon]._props.Chambers[0]._props.filters[0].Filter.push("556Sludge");
        }
        const magazines: string[] = [
            "5ac66c5d5acfc4001718d314", // ak101mag
            "630e295c984633f1fb0e7c30", // steyraug42
            "62e7c98b550c8218d602cbb4", // steyraug30
            "630e1adbbd357927e4007c09", // steyraug10
            "5d1340bdd7ad1a0e8d245aab", // stanag40fde
            "544a378f4bdc2d30388b4567", // stanag40
            "544a37c44bdc2d25388b4567", // stanag60
            ……
        ];
        for (const magazine of magazines)
        {
databaseTables.templates.items[magazine]._props.Cartridges[0]._props.filters[0].Filter.push("556Sludge");
        }
    }
```

这段代码定义了一个名为 `add556SludgeToGuns` 的函数，它接受一个参数：`container`。这个函数的主要功能是向特定的武器和弹匣添加 “556Sludge”。

以下是这个函数的主要步骤：

1. 首先，它从 `container` 中解析出 `DatabaseServer` 实例，并获取数据库表。
    
2. 然后，它定义了两个数组 `weapons` 和 `magazines`，分别包含了需要添加 “556Sludge” 的武器和弹匣的 ID。
    
3. 对于 `weapons` 数组中的每一个武器，它将 “556Sludge” 添加到该武器的 `Chambers` 属性的 `filters` 数组中。
    
4. 对于 `magazines` 数组中的每一个弹匣，它将 “556Sludge” 添加到该弹匣的 `Cartridges` 属性的 `filters` 数组中。
    

总的来说，这个函数的主要功能是向特定的武器和弹匣添加 “556Sludge”。这可能是一种特殊的子弹或者弹药类型。

---
### 在游戏里添加任务区域

```
private addQuestZones(container: DependencyContainer): void
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        databaseTables.globals["QuestZones"].push(
            //Visit
            {
                zoneId: "dormSupply",
                zoneName: "dormSupply",
                zoneType: "Visit",
                zoneLocation: "bigmap",
                position: {
                    x: "174.2927",
                    y: "2.8297",
                    z: "173.2282"
                },
                rotation: {
                    x: "0",
                    y: "0",
                    z: "0"
                },
                scale: {
                    x: "2.3",
                    y: "0.9",
                    z: "2.7"
                }
            },
            //PlaceItem
            {
                zoneId: "dormBed_204",
                zoneName: "dormBed_204",
                zoneType: "PlaceItem",
                zoneLocation: "bigmap",
                position: {
                    x: "169.92757",
                    y: "3.4624",
                    z: "149.9001"
                },
                rotation: {
                    x: "0",
                    y: "0",
                    z: "0"
                },
                scale: {
                    x: "2.3",
                    y: "0.9",
                    z: "2.7"
                }
            }
        );
    }
```

这段代码的功能是向游戏中添加任务区域。这些任务区域分为两种类型：“Visit”和“PlaceItem”。

- “Visit”类型的任务区域要求玩家访问指定的地点。例如，`dormSupply`、`gk_16cosmo`和`gk_20LightH`都是这种类型的任务区域。每个任务区域都有一个唯一的`zoneId`和`zoneName`，以及它在游戏地图上的位置(`position`)、旋转(`rotation`)和缩放(`scale`)信息。
    
- “PlaceItem”类型的任务区域要求玩家在指定的地点放置某个物品。例如，`dormBed_204`、`gk_16bilbo`等都是这种类型的任务区域。同样，每个任务区域都有一个唯一的`zoneId`和`zoneName`，以及它在游戏地图上的位置(`position`)、旋转(`rotation`)和缩放(`scale`)信息。
    

这些任务区域的信息会被添加到`databaseTables.globals["QuestZones"]`数组中，以便在游戏中使用。这段代码是在游戏的初始化阶段运行，以设置游戏的任务系统。

---
### 添加商人进游戏

```
private addTraderToDb(container: DependencyContainer): void
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        databaseTables.traders[GoblinKingJson._id] = {
            assort: this.createAssortTable(container),
            base: JSON.parse(JSON.stringify({ ...GoblinKingJson, unlockedByDefault: !ConfigJson.settings.UnlockGoblinAfterCollector })) as ITraderBase,
            questassort: JSON.parse(JSON.stringify(QuestAssortJson))
        };
        if (ConfigJson.settings.UnlockGoblinAfterCollector)
        {
            this.lockTraderBehindCollector(container);
        }
    }
```

这段代码的功能是向游戏数据库中添加一个新的交易者（Trader）。

- 首先，它从依赖容器（DependencyContainer）中获取`DatabaseServer`实例，并从中获取数据库表（DatabaseTables）。
    
- 然后，它在`traders`表中添加一个新的交易者。这个新的交易者的ID是`GoblinKingJson._id`。这个交易者有三个主要的属性：
    
    - `assort`：这是通过调用`this.createAssortTable(container)`方法创建的商品分类表。
    - `base`：这是交易者的基本信息，包括`GoblinKingJson`中的所有信息，以及一个`unlockedByDefault`属性，该属性的值取决于配置文件`ConfigJson.settings.UnlockGoblinAfterCollector`中的设置。
    - `questassort`：这是任务商品分类表，它是`QuestAssortJson`的一个副本。
- 最后，如果配置文件`ConfigJson.settings.UnlockGoblinAfterCollector`中的设置为`true`，则会调用`this.lockTraderBehindCollector(container)`方法，将这个新的交易者锁定在收藏家（Collector）任务之后。
    

总的来说，这段代码的主要目的是在游戏的初始化阶段，向游戏数据库中添加一个新的交易者，并根据配置文件中的设置，决定是否将这个新的交易者锁定在收藏家任务之后。

---
### 收藏家完成后解锁哥布林王的功能

```
private lockTraderBehindCollector(container: DependencyContainer)
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        const questCollector: QuestController = databaseTables.templates.quests["5c51aac186f77432ea65c552"];
        questCollector.rewards.Success.push({
            _id: "",
            _tpl: "",
            id: `${GoblinKingJson._id}_UNLOCK`,
            type: QuestRewardType.TRADER_UNLOCK,
            index: 2,
            target: GoblinKingJson._id
        });
        this.logger.log(`[${this.modName}] Goblin will be unlocked after 'Collector'`, LogTextColor.BLUE);
    }
```

这段代码的功能是将新的交易者（Goblin King）锁定在收藏家（Collector）任务之后。

- 首先，它从依赖容器（DependencyContainer）中获取`DatabaseServer`实例，并从中获取数据库表（DatabaseTables）。
    
- 然后，它获取收藏家任务的控制器（QuestController）。这个任务的ID是`5c51aac186f77432ea65c552`。
    
- 接着，它向收藏家任务的成功奖励列表中添加一个新的奖励。这个奖励的类型是`TRADER_UNLOCK`，目标是新的交易者（Goblin King）。这意味着，当玩家完成收藏家任务后，新的交易者（Goblin King）将被解锁。
    
- 最后，它使用日志记录器（logger）记录一条信息，表明新的交易者（Goblin King）将在收藏家任务之后被解锁。
    

总的来说，这段代码的主要目的是在游戏的初始化阶段，根据配置文件中的设置，将新的交易者（Goblin King）锁定在收藏家任务之后。

---
### 将商人本地化信息注入游戏

```
private addTraderToLocales(container: DependencyContainer, fullName: string, firstName: string, nickName: string, location: string, description: string): void
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        const locales: Record<string, Record<string, string>> = databaseTables.locales.global;
        for (const locale in locales)
        {
            locales[locale][`${GoblinKingJson._id} FullName`] = fullName;
            locales[locale][`${GoblinKingJson._id} FirstName`] = firstName;
            locales[locale][`${GoblinKingJson._id} Nickname`] = nickName;
            locales[locale][`${GoblinKingJson._id} Location`] = location;
            locales[locale][`${GoblinKingJson._id} Description`] = description;
        }
    }
```

这段代码的功能是向游戏的本地化（locales）数据库中添加一个新的交易者（Goblin King）的信息。

- 首先，它从依赖容器（DependencyContainer）中获取`DatabaseServer`实例，并从中获取数据库表（DatabaseTables）。
    
- 然后，它获取全局的本地化（locales）信息。
    
- 接着，它遍历所有的本地化（locales），并为每一种本地化添加新的交易者（Goblin King）的信息。这些信息包括交易者的全名（fullName）、名字（firstName）、昵称（nickName）、位置（location）和描述（description）。
    

总的来说，这段代码的主要目的是在游戏的初始化阶段，向游戏的本地化数据库中添加一个新的交易者（Goblin King）的信息。这样，无论玩家选择哪种语言，都能看到这个新的交易者的信息。

---
### 将商人加入跳蚤市场

```
private addTraderToFleaMarket(container: DependencyContainer)
    {
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const ragfairConfig: IRagfairConfig = configServer.getConfig(ConfigTypes.RAGFAIR);
        ragfairConfig.traders[GoblinKingJson._id] = true;
    }
```

这段代码的功能是将"GoblinKing"交易者添加到虚拟游戏市场（Flea Market）中。具体步骤如下：

1. 通过`container.resolve<ConfigServer>("ConfigServer")`获取配置服务器（ConfigServer）的实例。
2. 使用`configServer.getConfig(ConfigTypes.RAGFAIR)`获取Ragfair（虚拟游戏市场）的配置信息。
3. 在Ragfair的交易者列表中，通过`ragfairConfig.traders[GoblinKingJson._id] = true`将"GoblinKing"交易者设置为激活状态。

总的来说，这段代码的目的是在虚拟游戏市场中启用"GoblinKing"交易者。这样，玩家就可以在市场中看到并与"GoblinKing"交易者进行交易。

---
### 将所有商品加入游戏数据库

```
private addItemsToDb(container: DependencyContainer)
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        if (ConfigJson.settings.RebalanceItemsForMoreRealism) this.rebalanceItemsForMoreRealism();

        for (const item in this.mydb.templates.items.items.templates)
        {
            databaseTables.templates.items[item] = this.mydb.templates.items.items.templates[item];
        }
    }
```

这段代码的功能是将一些物品添加到数据库中。具体步骤如下：

1. 通过`container.resolve<DatabaseServer>("DatabaseServer")`获取数据库服务器（DatabaseServer）的实例。
2. 使用`databaseServer.getTables()`获取数据库的表格信息。
3. 如果`ConfigJson.settings.RebalanceItemsForMoreRealism`为真，那么就会调用`this.rebalanceItemsForMoreRealism()`方法来重新平衡物品，以增加游戏的真实感。
4. 在`for`循环中，遍历`this.mydb.templates.items.items.templates`中的每一个物品，并将其添加到数据库的表格中。

总的来说，这段代码的目的是将一些预定义的物品添加到数据库中，这样在游戏中就可以使用这些物品了。

---
### MOD物品的平衡性调整

```
private rebalanceItemsForMoreRealism()

    {
this.mydb.templates.items.items.templates["CursedMask"]._props.CanRequireOnRagfair = false;
        this.mydb.templates.items.items.templates["CursedMask"]._props.CanSellOnRagfair = false;
this.mydb.templates.items.items.templates["GoblinsIfak"]._props.effects_health.Energy.value = 25;
        this.mydb.templates.items.items.templates["GoblinsIfak"]._props.hpResourceRate = 0;
        this.mydb.templates.items.items.templates["GoblinsIfak"]._props.MaxHpResource = 15;
        this.mydb.templates.items.items.templates["GoblinsIfak"]._props.Rarity = "SuperRare";
        this.logger.log(`[${this.modName}] Items rebalanced for more realism`, LogTextColor.BLUE);
    }
```

这段代码的功能是重新平衡一些物品的属性，以增加游戏的真实感。具体步骤如下：

1. 将"CursedMask"（诅咒面具）的属性`CanRequireOnRagfair`和`CanSellOnRagfair`都设置为`false`，这意味着这个物品不能在虚拟游戏市场（Flea Market）上被要求或出售。
2. 修改"GoblinsIfak"（地精急救包）的一些属性：
    - `effects_health.Energy.value`被设置为`25`，这可能影响了使用这个物品后玩家的能量值。
    - `hpResourceRate`被设置为`0`，这可能影响了这个物品的恢复速度。
    - `MaxHpResource`被设置为`15`，这可能影响了这个物品的最大恢复量。
    - `Rarity`被设置为"SuperRare"，这可能影响了这个物品的稀有程度。
3. 最后，使用`this.logger.log`输出一条日志，表明物品已经被重新平衡。
总的来说，这段代码的目的是修改一些物品的属性，以使游戏更加真实。

---
### 将物品信息添加到不同语言的本地化和ai类型中

```
private addItemsToLocales(container: DependencyContainer): void
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        const locales: Record<string, Record<string, string>> = databaseTables.locales.global;
        const types: Record<string, Record<string, string>> = databaseTables.bots.types;

        locales.en = {
            ...locales.en,
            ...this.mydb.locales.en
        };
        locales.ge = {
            ...locales.ge,
            ...this.mydb.locales.ge
        };
        locales.ru = {
            ...locales.ru,
            ...this.mydb.locales.ru
        };
        types.usec = {
            ...types.usec,
            ...this.mydb.locales.usec
        },
        types.bear = {
            ...types.bear,
            ...this.mydb.locales.bear
        },
        types.exusec = {
            ...types.exusec,
            ...this.mydb.locales.exusec
        };
        }
```

这段代码的功能是将一些物品添加到不同的地点（locales）。具体步骤如下：

1. 通过`container.resolve<DatabaseServer>("DatabaseServer")`获取数据库服务器（DatabaseServer）的实例。
2. 使用`databaseServer.getTables()`获取数据库的表格信息。
3. 获取全局地点（locales）和机器人类型（bots types）的信息。
4. 使用扩展运算符（`...`）将`this.mydb.locales`中的物品添加到对应的地点和机器人类型中。

这段代码修改了以下地点和机器人类型的信息：

- 英语地点（`locales.en`）
- 德语地点（`locales.ge`）
- 俄语地点（`locales.ru`）
- USEC机器人类型（`types.usec`）
- BEAR机器人类型（`types.bear`）
- ExUSEC机器人类型（`types.exusec`）

总的来说，这段代码的目的是将一些预定义的物品添加到不同的地点和机器人类型中，这样在游戏中就可以在不同的地点和机器人类型中使用这些物品。

---
### 将mod物品信息添加到游戏手册中

```
private addHandbookToDb(container: DependencyContainer)
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        for (const handbook of this.mydb.templates.handbook.Items)
        {
            if (!databaseTables.templates.handbook.Items.find((i) => i.Id == handbook.Id)) databaseTables.templates.handbook.Items.push(handbook);
        }
    }
```

这段代码的功能是将一些手册（handbook）添加到数据库中。具体步骤如下：

1. 通过`container.resolve<DatabaseServer>("DatabaseServer")`获取数据库服务器（DatabaseServer）的实例。
2. 使用`databaseServer.getTables()`获取数据库的表格信息。
3. 在`for`循环中，遍历`this.mydb.templates.handbook.Items`中的每一个手册，并检查它是否已经存在于数据库的手册列表中。如果不存在，则将其添加到数据库的手册列表中。

总的来说，这段代码的目的是将一些预定义的手册添加到数据库中，这样在游戏中就可以使用这些手册了。

---
### 将MOD的buff合并到游戏的buff列表

```
private addBuffsToDb(container: DependencyContainer)
    {
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const databaseTables: IDatabaseTables = databaseServer.getTables();
        const buffs = databaseTables.globals.config.Health.Effects.Stimulator.Buffs;
        const myBuffs = this.mydb.globals.config.Health.Effects.Stimulator.Buffs;
        for (const buff in myBuffs)
        {
            buffs[buff] = myBuffs[buff];
        }
    }
```

这段代码的功能是将`myBuffs`中的数据添加到`buffs`中。具体来说，它执行以下步骤：

1. 从`DependencyContainer`中解析出`DatabaseServer`实例。
2. 从`DatabaseServer`获取数据库表。
3. 从数据库表中获取`buffs`，这是一个对象，其属性是全局配置中的健康效果刺激器的buffs。
4. 从`mydb`（可能是另一个数据库或数据源）中获取`myBuffs`，这也是一个类似的对象。
5. 对于`myBuffs`中的每一个`buff`（属性），将其值复制到`buffs`中的相应属性。

简单来说，这个函数的目的是将`myBuffs`中的数据合并到`buffs`中。如果`buffs`和`myBuffs`中有相同的属性，那么`myBuffs`中的值将覆盖`buffs`中的值。这可能是为了更新或同步两个数据源中的数据。

---
### 模块导出（整个mod的代码的结尾）

```
}
module.exports = { mod: new GoblinKing() };
```

这段代码是在Node.js环境中使用的模块导出语句。它的功能是创建一个新的`GoblinKing`对象，并将其导出为模块的一部分。

具体来说：

- `module.exports`是Node.js中的一个特殊对象，它用于定义一个模块公开的接口，也就是说，其他文件可以通过`require`关键字导入这个模块，并访问`module.exports`中定义的属性和方法。
- `{ mod: new GoblinKing() }`是一个对象字面量，它定义了一个属性`mod`，并将其值设置为一个新的`GoblinKing`对象。这意味着当其他文件导入这个模块时，它们可以访问到这个`GoblinKing`对象。

所以，如果有另一个文件包含了`const goblinKingMod = require('./path/to/this/file');`，那么`goblinKingMod.mod`就会是一个`GoblinKing`的实例。
