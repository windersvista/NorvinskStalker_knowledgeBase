# WTT 商人生成工具使用说明

(SPT4版开发中)

这是一个用于快速生成符合 WTTCommonLib 规范的塔科夫自定义商人模组的自动化 Python 脚本。它能够解析本地的参考表（Markdown 格式），并自动转换人类可读的名称为游戏内部 ID。

## 核心功能

*   **参考表自动映射**：自动从 `地图地点参考表.md`、`商人参考表.md` 等文件中提取 ID。
*   **任务线生成**：支持 `PickUp` (拾取/上交)、`Elimination` (击杀)、`Exploration` (访问区域) 等任务类型。
*   **多语言支持**：自动生成 `Locales` 映射文件。
*   **哈希 ID 生成**：基于名称生成确定性的 MongoID，避免模组冲突。
*   **完整脚手架**：生成包括 `db/base.json`、`assort.json`、`CustomQuests` 在内的完整目录结构。

## 环境要求

*   Python 3.6+
*   工作目录中需包含以下参考文件：
    *   `地图地点参考表.md`
    *   `商人参考表.md`
    *   `技能参考表.md`
    *   `BOT信息参考表.md`
    *   `任务值参考表.md`

## 使用步骤

### 1. 准备配置文件

创建一个名为 `trader_config.json` 的文件（或参考 `trader_config_sample.json`）。
**配置示例：**

```json

{

    "trader_name": "MyCustomTrader",

    "description": "商人描述文本",

    "location": "Streets Of Tarkov",

    "quests": [

        {

            "name": "第一个任务",

            "type": "Elimination",

            "location": "Customs",

            "AvailableForFinish": [

                {

                    "type": "Elimination",

                    "target_bot": "Scav",

                    "value": 5

                }

            ],

            "rewards": { "standing": 0.01 }

        }

    ]

}

```


### 2. 运行脚本

在终端中执行：

```powershell

python generate_trader.py

```

### 3. 安装模组

1.  脚本会生成一个 `generated_[商人名]` 文件夹。
2.  将其内部的 `db` 等文件夹合并到你的 WTT 模组模板中。
3.  确保将对应的头像文件放入 `db/CustomQuests/[ID]/Images/`。

  

## 支持的任务条件 (AvailableForFinish)

*   `HandoverItem`: 上交物品。需提供 `target` (物品模板ID) 和 `value` (数量)。
*   `Elimination`: 击杀目标。需提供 `target_bot` (参考表中代号或友好名称) 和 `value` (数量)。
*   `VisitPlace`: 访问区域。需提供 `target_zone` (触发区域 ID)。

---

*注：本工具是为减少手动查找 ID 的繁琐工作而设计的助手。*