# 哥布林王的mod.ts拆解

> [!NOTE] 注
> 以下内容是根据copilot对哥布林王的src/GoblinKing.ts中每一段代码的解释所归纳，如有错误，均由Copilot负责（bushi
> 之所以要做拆解，是因为在移植代码前，起码我们要知道它是怎么工作的。

## 导入模块

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
    

## 创建商人类

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

## 注册商人

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

## 将商人添加进本地

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

## 设定商人的更新时间

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

## 设置商人的头像

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

## 静态路由

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

## 向商人售卖列表添加单个以物易物的商品

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

这样，就完成了向交易者的商品排序表中添加单个商品，并设置其交易方案的操作。希望这个解释对你有所帮助！