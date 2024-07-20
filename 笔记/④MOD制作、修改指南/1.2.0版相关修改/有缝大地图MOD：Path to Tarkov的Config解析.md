
> [!NOTE] 好奇猫注：
> 以下内容是我个人的对MOD功能的个人理解，如有错误，请及时反馈。
---

##### 第一部分：
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

##### 第二部分：
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

##### 第三部分：
```

```