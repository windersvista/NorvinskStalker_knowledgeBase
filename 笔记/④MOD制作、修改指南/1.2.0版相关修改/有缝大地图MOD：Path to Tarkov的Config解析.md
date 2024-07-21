
> [!NOTE] 好奇猫注：
> 以下内容是我个人的对MOD功能的个人理解，如有错误，请及时反馈。
> 整套设置最重要的部分是《第六部分：入局点》的设置，要对默认路线进行大修，先改第6部分，再改第5部分，再依次改其他部分。
---

##### 第一部分：基础设置
```
"enabled": true, //MOD的总开关
  "debug": false,  //是否开启Debug模式
  "initial_offraid_position": "PlayerHideout",   //设置玩家的主家位置
  "reset_offraid_position_on_player_die": true,   //设置死亡后是否会主家
  "traders_access_restriction": true,    //商人访问受限，默认开
  "hideout_multistash_enabled": true,    //多个仓库，默认开
  "vanilla_exfils_requirements": false, //必须原版撤离点，默认关。具体功能未知
  "laboratory_access_restriction": true, //实验室进入受限，默认开
  "laboratory_access_via": ["Car", "UnderpasstoLabs", "CatacombsHangar"],//设置实验室进入受限，默认开
  "player_scav_move_offraid_position": false, //玩家scav能否进入主家，默认不能
  "workbench_always_enabled": true, //工作台总是开启
  "bypass_keep_found_in_raid_tweak": true, //保持物品总是打勾。
  "bypass_uninstall_procedure": false,  //卸载流程，如要关闭这个mod，请把他true
  "bypass_luas_custom_spawn_points_tweak": false, //自定义生成点修改（？）
```

##### 第二部分：恢复设置
```
"restrictions_in_raid": {    //战局内限制，现在只是带入战局的现金上限，不知道是否未来会加功能
    "5449016a4bdc2d6f028b456f": {
      "// type = roubles": true,
      "Value": 10000000
    },
    "5696686a4bdc2da3298b456a": {
      "// type = dollars": true,
      "Value": 100000
    },
    "569668774bdc2da2298b4568": {
      "// type = euros": true,
      "Value": 100000
    }
  },
  "offraid_regen_config": {//战局外恢复设置
    "hydration": {//水量恢复
      "access_via": [//在哪些位置可以享受这个恢复
        "FactoryZB-1011",
        "FactoryZB-1012",
        "FactoryZB-1013",
        "Car",
        "PlayerHideout",
        "TherapistHideout",
        "EmercomToKlimov"
      ]
    },
    "energy": {//能量恢复
      "access_via": [//在哪些位置可以享受这个恢复
        "FactoryZB-1011",
        "FactoryZB-1012",
        "FactoryZB-1013",
        "WoodsCustoms",
        "PlayerHideout",
        "TherapistHideout",
        "EmercomToKlimov"
      ]
    },
    "health": {//血量恢复
      "access_via": [//在哪些位置可以享受这个恢复
        "FactoryZB-1011",
        "FactoryZB-1012",
        "FactoryZB-1013",
        "WoodsFactoryGate",
        "PlayerHideout",
        "TherapistHideout",
        "EmercomToKlimov"
      ]
    }
  },
```

##### 第三部分：藏身处仓库设置
```
"hideout_main_stash_access_via": ["PlayerHideout", "TherapistHideout"],//PTT仅提供两套供玩家存放物品的仓库，这里设置主藏身处的仓库可以在哪里访问。
  "hideout_secondary_stashes": [//PTT仅提供两套供玩家存放物品的仓库，这里设置第二套仓库可以在哪里访问。
    {
      "id": "PathToTarkov_Car_stash",//可访问第二套仓库的点位ID
      "size": 16,//这个ID点位的仓库大小
      "access_via": ["Car"]//这里的"Car"在下面的《第六点入局点》部分进行设置和自定义，"access_via"的都是入局点，
    },
内容过多，略……
  ],
```

##### 第四部分：商人设置
```
"traders_config": {
    "54cb50c76803fa8b248b4571": {//这里是每个商人的base.json里的"_id"，推断想增加受控的商人就增加这里即可。
      "// Trader name": "Prapor",//只是备注
      "override_description": true,//是否将下面的"location_description"的内容覆盖到原版描述中
      "location_description": {//这里是每个语言用到的描述，ch是中文，en是英文
        "ch": "Between woods and factory",
        "en": "Between woods and factory"
      },
      "access_via": ["WoodsFactoryGate"]//设置在哪个入局点可以访问到这个商人
    },
    "54cb57776803fa99248b456e": {
      "// Trader name": "Therapist",
      "override_description": true,
      "location_description": {
        "ch": "在 “地面零点 ”的拾荒者营地",
        "en": "In the Scav Camp at Ground Zero"
      },
      "access_via": ["TherapistHideout"]
    },
	过多，略……
    "579dc571d53a0658a154fbec": {//黑商的设置比上面其他商人多了更多设置
      "// Trader name": "Fence",
      "// Fence is accessible everywhere": true,//是否让黑商可以在任意地区都可访问，默认是
      "access_via": "*",
      "insurance_always_enabled": true,//设置黑商可以投保，不清楚这些功能能否直接复制给其他商人用
      "insurance_config": {//黑商投保的各个属性
        "insuranceMultiplier": 0.3,
        "insurance_price_coef": 1,
        "min_payment": 0,
        "min_return_hour": 1,
        "max_return_hour": 2,
        "max_storage_time": 480
      },
      "repair_always_enabled": true,//设置黑商可以维修装备，，不清楚这些功能能否直接复制给其他商人用
      "repair_config": {//黑商维修的各个属性
        "quality": 1,
        "currency": "5449016a4bdc2d6f028b456f",
        "currency_coefficient": 12,
        "repair_price_coef": 0
      }
    },
    "Priscilu": {//MOD商人的部分，内容跟原版商人一样，id在它们各自的db/base.json里找
      "// mod integration for Priscilu": true,
      "// Priscilu is available after extracting from Outskirts (woods map)": true,
      "disable_warning": true,
      "override_description": true,
      "location_description": {
        "ch": "Somewhere between woods, military reserve and shoreline",
        "cz": "Somewhere between woods, military reserve and shoreline",
        "en": "Somewhere between woods, military reserve and shoreline"
      },
      "access_via": ["WoodsReserveShoreline"]
    },
    内容过多，略……
  },
```

##### 第五部分：各地图撤离点联通设置

> [!NOTE] 撤离点明细
> 这里的撤离点明细可查看[【诺文斯克潜行者】撤离点ID和对应的名字](../【诺文斯克潜行者】撤离点ID和对应的名字.md)

```
"exfiltrations": {//撤离点设置
    "factory4_day": {
      "Gate 3": "FactoryZB-1013",
      "Gate m": "FactoryZB-1012",
      "Cellars": "FactoryZB-1011",
      "Camera Bunker Door": "FactoryZB-1011",
      "Office Window": "WoodsFactoryGate",
      "Gate 0": "WoodsFactoryGate"
    },
    "factory4_night": {
      "Gate 3": "FactoryZB-1013",
      "Gate m": "FactoryZB-1012",
      "Cellars": "FactoryZB-1011",
      "Camera Bunker Door": "FactoryZB-1011",
      "Office Window": "WoodsFactoryGate",
      "Gate 0": "WoodsFactoryGate"
    },
    "bigmap": {
      "Military Checkpoint": "CustomsMilitaryBaseCP",
      "Railroad To Military Base": "MilitaryBaseRail",
      "Railroad To Port": "ShorelineCustoms",
      "EXFIL_ZB013": "FactoryZB-1013",
      "ZB-1012": "FactoryZB-1012",
      "ZB-1011": "FactoryZB-1011",
      "Dorms V-Ex": "Car",
      "Sniper Roadblock": "ShorelineCustoms",
      "Smuggler's Boat": "Boat",
      "RUAF Roadblock": "WoodsCustoms",
      "Crossroads": "InterchangeCustoms",
      "Old Gas Station": "PilgrimTrail",
      "Railroad To Tarkov": "CustomsTarkovRail",
      "Administration Gate": "WoodsMilitaryPath",
      "Factory Far Corner": "ScavWindow"
    },
    "woods": {
      "un-sec": "WoodsCustoms",
      "Factory Gate": "WoodsFactoryGate",
      "ZB-014": "FactoryZB-1013",
      "Outskirts": "WoodsReserveShoreline",
      "The Boat": "Boat",
      "South V-Ex": "Car",
      "RUAF Gate": "WoodsMilitaryPath"
    },
    "rezervbase": {
      "EXFIL_ScavCooperation": "CustomsMilitaryBaseCP",
      "EXFIL_Train": "MilitaryBaseRail",
      "Exit1": "WoodsReserveShoreline",
      "Exit2": "WoodsReserveShoreline",
      "Exit3": "WoodsReserveShoreline",
      "Exit4": "WoodsReserveShoreline",
      "Alpinist": "ShorelineNorthMoutains",
      "EXFIL_Bunker_D2": "SafeRoom",
      "EXFIL_vent": "ManHoleToReserve"
    },
    "interchange": {
      "PP Exfil": "Car",
      "Hole Exfill": "InterchangeCustoms",
      "Saferoom Exfil": "SafeRoom",
      "NW Exfil": "CustomsTarkovRail",
      "SE Exfil": "StreetsEvac"
    },
    "shoreline": {
      "exit_scav_NORTH_fencepassage": "ShorelineNorthMoutains",
      "Road to Customs": "ShorelineCustoms",
      "Pier Boat": "Boat",
      "Tunnel": "ShorelineLighthouseTunnel",
      "Lighthouse_pass": "ShorelineLighthousePath"
    },
    "lighthouse": {
      " V-Ex_light": "Car",
      "Shorl_free": "ShorelineLighthousePath",
      "tunnel_shared": "ShorelineLighthouseTunnel"
    },
    "tarkovstreets": {
      "E1": "UnderpasstoLabs",
      "E4": "StreetsEvac",
      "E7_car": "Car",
      "E9_sniper": "SniperPath",
      "scav_e1": "EmercomToKlimov",
      "scav_e2": "CatacombsHangar",
      "scav_e4": "ManHoleToReserve"
    },
    "laboratory": {
      "lab_Parking_Gate": "UnderpasstoLabs",
      "lab_Hangar_Gate": "CatacombsHangar",
      "lab_Elevator_Med": "Car",
      "lab_Under_Storage_Collector": "Car",
      "lab_Elevator_Main": "Car",
      "lab_Elevator_Cargo": "Car"
    },
    "sandbox": {
      "Unity_free_exit": "EmercomToKlimov",
      "Sandbox_VExit": "Car",
      "Nakatani_stairs_free_exit": "PlayerHideout",
      "Sniper_exit": "SniperPath",
      "Scav_coop_exit": "TherapistHideout"
    }
  },
```

##### 第六部分：“入局点”设置
```
"infiltrations": {
    "ShorelineLighthousePath": {
      "shoreline": ["Path to Lighthouse"],
      "lighthouse": ["Path to Shoreline"],
      "rezervbase": ["CP Fence"]
    },
    "ShorelineLighthouseTunnel": {
      "shoreline": ["Tunnel"],
      "lighthouse": ["Lighthouse tunnel"]
    },
    "ShorelineNorthMoutains": {
      "rezervbase": ["Cliff"],
      "shoreline": ["North Fence Passage"]
    },
    "WoodsReserveShoreline": {
      "woods": ["Outskirts"],
      "rezervbase": ["CP Fence"]
    },
    "InterchangeCustoms": {
      "bigmap": ["Crossroads"],
      "interchange": ["Scav Camp"]
    },
    "CustomsTarkovRail": {
      "bigmap": ["MallTrain"],
      "interchange": ["Railway"]
    },
    "WoodsCustoms": {
      "woods": ["UN Roadblock"],
      "bigmap": ["RUAF Roadblock"]
    },
    "Boat": {
      "bigmap": ["Smuggler's Boat"],
      "woods": ["The Boat"],
      "shoreline": ["Pier Boat"],
      "lighthouse": ["Lighthouse Docks Boat"]
    },
    "ShorelineCustoms": {
      "bigmap": ["Sniper Roadblock"],
      "shoreline": ["Road to Customs"]
    },
    "Car": {
      "bigmap": ["Dorms Car"],
      "interchange": ["Car at Power Station"],
      "woods": ["Bridge Car"],
      "lighthouse": ["Lighthouse Vehicle Extract"],
      "tarkovstreets": ["Primorsky Vehicle Extract"],
      "sandbox": ["hideout_gz"]
    },
    "CustomsMilitaryBaseCP": {
      "bigmap": ["Military Base CP"],
      "rezervbase": ["Scav lands"]
    },
    "PilgrimTrail": {
      "bigmap": ["PraveenGasoline"],
      "tarkovstreets": ["Crane"]
    },
    "MilitaryBaseRail": {
      "bigmap": ["Railroad To Military Base"],
      "rezervbase": ["Train Station"]
    },
    "FactoryZB-1013": {
      "bigmap": ["ZB-1013"],
      "woods": ["ZB-1014"],
      "factory4_day": ["Gate 3"],
      "factory4_night": ["Gate 3"]
    },
    "FactoryZB-1012": {
      "bigmap": ["ZB-1012"],
      "factory4_day": ["Med tent gates"],
      "factory4_night": ["Med tent gates"]
    },
    "FactoryZB-1011": {
      "bigmap": ["ZB-1011"],
      "factory4_day": ["Cellars"],
      "factory4_night": ["Cellars"]
    },
    "ScavWindow": {
      "bigmap": ["OfficePath"],
      "factory4_day": ["OfficeWindow"],
      "factory4_night": ["OfficeWindow"]
    },
    "WoodsFactoryGate": {
      "woods": ["Factory Gate"],
      "factory4_day": ["Gate 0"],
      "factory4_night": ["Gate 0"]
    },
    "WoodsMilitaryPath": {
      "woods": ["RUAFRoadblock"],
      "bigmap": ["RUAFAdmin"]
    },
    "SafeRoom": {
      "rezervbase": ["D-2"],
      "interchange": ["Safe Room"]
    },
    "TherapistHideout": {
      "sandbox": ["Crow Hideout"]
    },
    "PlayerHideout": {
      "sandbox": ["hideout_gz"]
    },
    "EmercomToKlimov": {
      "sandbox": ["Crow Hideout"],
      "tarkovstreets": ["Basement Descent"]
    },
    "SniperPath": {
      "sandbox": ["From Streets"],
      "tarkovstreets": ["Klimov Street"]
    },
    "UnderpasstoLabs": {
      "tarkovstreets": ["Underpass"],
      "laboratory": ["Parking Gate"]
    },
    "ManHoleToReserve": {
      "tarkovstreets": ["Streets Manhole"],
      "rezervbase": ["Reserve Manhole"]
    },
    "StreetsEvac": {
      "tarkovstreets": ["Evacuation Zone"],
      "interchange": ["EmercomMall"],
      "bigmap": ["Old Gas Scav"]
    },
    "CatacombsHangar": {
      "tarkovstreets": ["Catacombs"],
      "laboratory": ["Hangar Gate"]
    }
  }
  }
```