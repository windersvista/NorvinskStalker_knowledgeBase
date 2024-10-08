
> [!NOTE] 备注
> 这个文档所使用的解说样例是ShadowXtrex-CustomProfiles-v394.0.1的27_Custom_TASBot.json。
> 用来解释SPT新建存档时需要选择的Profile的内部结构，为我构想的类似“职业”的游戏体验做准备。

---

### Key

```
"descriptionLocaleKey": "customprofile-zhTASBot",
```
解读：这段是用来让Custom Profiles Loader识别档案名并注入到游戏本体的。customprofile-zhTASBot是档案的名字或者ID。

### 档案主体


> [!NOTE] 注
> 档案文件的主体主要分为"bear"和"usec"两个部分，其实就是定义玩家选择的两个阵营后人物该自带哪些东西。两个阵营的人物各不相同。
> 这里有一些需要用到的资料：
> 	藏身处设施ID：https://hub.sp-tarkov.com/doc/entry/4-resources-hideout-areas-ids/
> 	塔科夫ID搜索器：https://db.sp-tarkov.com/search


```
"bear": {
        "character": {
            "TaskConditionCounters": {},
            "Bonuses": [//设定初始仓库大小
                {
                    "id": "64f5b9e5fa34f11b380756c0",
                    "templateId": "566abbc34bdc2d92178b4576",
                    "type": "StashSize"
                }
            ],
            "Customization": {//设定人物的穿着和头模
                "Body": "5cc0858d14c02e000c6bea66",
                "Feet": "5cc085bb14c02e000e67a5c5",
                "Hands": "5cc0876314c02e000c6bea6b",
                "Head": "__REPLACEME__"
            },
            "Encyclopedia": {//未知
                "5448bd6b4bdc2dfc2f8b4569": false,
                "5448be9a4bdc2dfd2f8b456a": true,
                "5448c12b4bdc2d02308b456f": false,
                "5448fee04bdc2dbc018b4567": false,
                "5449016a4bdc2d6f028b456f": false,
                "544a11ac4bdc2d470e8b456a": false,
                "544a5caa4bdc2d1a388b4568": false,
                "544a5cde4bdc2d39388b456b": false,
                "544fb25a4bdc2dfb738b4567": false,
                "544fb3364bdc2d34748b456a": false,
                "544fb37f4bdc2dee738b4567": false,
                "544fb3f34bdc2d03748b456a": true,
                "544fb45d4bdc2dee738b4568": true,
                "54527a984bdc2d4e668b4567": false,
                "545cdae64bdc2d39198b4568": true,
                "545cdb794bdc2d3a198b456a": true,
                "557ff21e4bdc2d89578b4586": false,
                "557ffd194bdc2d28148b457f": false,
                "55801eed4bdc2d89578b4588": true,
                "55802d5f4bdc2dac148b458e": false,
                "559ba5b34bdc2d1f1a8b4582": true,
                "55d480c04bdc2d1d4e8b456a": false,
                "55d4887d4bdc2d962f8b4570": false,
                "55d7217a4bdc2d86028b456d": false,
                "56083e1b4bdc2dc8488b4572": true,
                "56083eab4bdc2d26448b456a": true,
                "560d5e524bdc2d25448b4571": false,
                "560e620e4bdc2d724b8b456b": true,
                "5644bd2b4bdc2d3b4c8b4572": true,
                "5645bc214bdc2d363b8b4571": true,
                "5645bcc04bdc2d363b8b4572": false,
                "5648a7494bdc2d9d488b4583": false,
                "5648b0744bdc2d363b8b4578": false,
                "5648b1504bdc2d9d488b4584": false,
                "5649aa744bdc2ded0b8b457e": false,
                "5649ad3f4bdc2df8348b4585": false,
                "5649ade84bdc2d1b2b8b4587": false,
                "5649af094bdc2df8348b4586": false,
                "5649b0544bdc2d1b2b8b458a": true,
                "5649b1c04bdc2d16268b457c": false,
                "564ca99c4bdc2d16268b4589": false,
                "567143bf4bdc2d1a0f8b4567": true,
                "5696686a4bdc2da3298b456a": false,
                "569668774bdc2da2298b4568": false,
                "56d59d3ad2720bdb418b4577": false,
                "56dfef82d2720bbd668b4567": true,
                "56dff3afd2720bba668b4567": false,
                "56e294cdd2720b603a8b4575": false,
                "56ea8222d2720b69698b4567": true,
                "570fd6c2d2720bc6458b457f": false,
                "5710c24ad2720bc3458b45a3": false,
                "57347d7224597744596b4e72": false,
                "57347da92459774491567cf5": false,
                "573718ba2459775a75491131": false,
                "5751a25924597722c463c472": false,
                "5755356824597772cb798962": false,
                "5755383e24597772cb798966": false,
                "576a581d2459771e7b1bc4f1": true,
                "576a5ed62459771e9c2096cb": false,
                "576a63cd2459771e796e0e11": false,
                "576a7c512459771e796e0e17": true,
                "57cd379a24597778e7682ecf": false,
                "57dc2fa62459775949412633": false,
                "57dc324a24597759501edc20": true,
                "57dc32dc245977596d4ef3d3": false,
                "57dc334d245977597164366f": true,
                "57dc347d245977596754e7a1": false,
                "5811ce772459770e9e5f9532": false,
                "584984812459776a704a82a6": true,
                "5857a8bc2459772bad15db29": false,
                "58864a4f2459770fcc257101": true,
                "5887431f2459777e1612938f": true,
                "58948c8e86f77409493f7266": true,
                "58949dea86f77409483e16a8": true,
                "58949edd86f77409483e16a9": true,
                "5894a05586f774094708ef75": false,
                "5894a13e86f7742405482982": true,
                "5894a2c386f77427140b8342": true,
                "5894a42086f77426d2590762": true,
                "5894a51286f77426d13baf02": true,
                "5894a5b586f77426d2590767": true,
                "5894a73486f77426d259076c": true,
                "5894a81786f77427140b8347": true,
                "590c5d4b86f774784e1b9c45": false,
                "590c657e86f77412b013051d": true,
                "590c661e86f7741e566b646a": false,
                "590c678286f77426c9660122": true,
                "590c695186f7741e566b64a2": false,
                "592c2d1a86f7746dbe2af32a": true,
                "595cf16b86f77427440c32e2": true,
                "59984ab886f7743e98271174": true,
                "5998517986f7746017232f7e": false,
                "599851db86f77467372f0a18": false,
                "5998597786f77414ea6da093": false,
                "59985a8086f77414ec448d1a": true,
                "599860ac86f77436b225ed1a": false,
                "599860e986f7743bb57573a6": true,
                "59bffbb386f77435b379b9c2": true,
                "59bffc1f86f77435b128b872": true,
                "59c6633186f7740cf0493bb9": true,
                "59ccd11386f77428f24a488f": true,
                "59ccfdba86f7747f2109a587": true,
                "59d36a0086f7747e673f3946": true,
                "59e770b986f7742cbd762754": false,
                "5a0c27731526d80618476ac4": false,
                "5aa2b87de5b5b00016327c25": false,
                "5aa7cfc0e5b5b00015693143": false,
                "5aafbde786f774389d0cbc0f": false,
                "5ab8f39486f7745cd93a1cca": false,
                "5ac4cd105acfc40016339859": false,
                "5ac50c185acfc400163398d4": false,
                "5ac50da15acfc4001718d287": false,
                "5ac72e475acfc400180ae6fe": false,
                "5ac7655e5acfc40016339a19": false,
                "5af0454c86f7746bf20992e8": false,
                "5b40e5e25acfc4001a599bea": false,
                "5b432b965acfc47a8774094e": false,
                "5b432d215acfc4771e1c6624": false,
                "5bed625c0db834001c062946": false,
                "5beec1bd0db834001e6006f3": false,
                "5beec3420db834001b095429": false,
                "5beec3e30db8340019619424": false,
                "5beec8b20db834001961942a": false,
                "5beec8c20db834001d2c465c": false,
                "5beec8ea0db834001a6f9dbf": false,
                "5beec91a0db834001961942d": false,
                "5beec9450db83400970084fd": false,
                "5beecbb80db834001d2c465e": false,
                "5beed0f50db834001c062b12": false,
                "5bf3f59f0db834001a6fa060": false,
                "5bffdc370db834001d23eca8": false,
                "5c0505e00db834001b735073": false,
                "5c0e530286f7747fa1419862": false,
                "5c0e53c886f7747fa54205c7": false,
                "5c0e722886f7740458316a57": false,
                "5c488a752e221602b412af63": false,
                "5c48a14f2e2216152006edd7": false,
                "5c48a2852e221602b21d5923": false,
                "5c48a2a42e221602b66d1e07": false,
                "5c48a2c22e221602b313fb6c": false,
                "5ca20abf86f77418567a43f2": false,
                "5ca20d5986f774331e7c9602": false,
                "5d02778e86f774203e7dedbe": false,
                "5d02797c86f774203f38e30a": false,
                "5d0a29fed7ad1a002769ad08": false,
                "5d0a3e8cd7ad1a6f6a3d35bd": false,
                "5d1b36a186f7742523398433": false,
                "5d1b371186f774253763a656": false,
                "5d40407c86f774318526545a": false,
                "5d5d85c586f774279a21cbdb": false,
                "5d5d940f86f7742797262046": false,
                "5d5e9c74a4b9364855191c40": false,
                "5e2af47786f7746d404f3aaa": false,
                "5e2af4a786f7746d3f3c3400": false,
                "5e831507ea0a7c419c2f9bd9": false,
                "5e8488fa988a8701445df1e4": false,
                "5e870397991fd70db46995c8": false,
                "5e87071478f43e51ca2de5e1": false,
                "5e87076ce2db31558c75a11d": false,
                "5e87080c81c4ed43e83cefda": false,
                "5e8708d4ae379e67d22e0102": false,
                "5e87114fe2db31558c75a120": false,
                "5e87116b81c4ed43e83cefdd": false,
                "5f4f9eb969cdc30ff33f09db": false
            },
            "Health": {//身体各部位的血量上限
                "BodyParts": {
                    "Chest": {
                        "Health": {
                            "Current": 85,
                            "Maximum": 85
                        }
                    },
                    "Head": {
                        "Health": {
                            "Current": 35,
                            "Maximum": 35
                        }
                    },
                    "LeftArm": {
                        "Health": {
                            "Current": 60,
                            "Maximum": 60
                        }
                    },
                    "LeftLeg": {
                        "Health": {
                            "Current": 65,
                            "Maximum": 65
                        }
                    },
                    "RightArm": {
                        "Health": {
                            "Current": 60,
                            "Maximum": 60
                        }
                    },
                    "RightLeg": {
                        "Health": {
                            "Current": 65,
                            "Maximum": 65
                        }
                    },
                    "Stomach": {
                        "Health": {
                            "Current": 70,
                            "Maximum": 70
                        }
                    }
                },
                "Energy": {//能量上限
                    "Current": 100,
                    "Maximum": 100
                },
                "Hydration": {//水量上限
                    "Current": 100,
                    "Maximum": 100
                },
                "Temperature": {//体温上限
                    "Current": 36.6,
                    "Maximum": 40
                },
                "UpdateTime": 1608815684
            },
            "Hideout": {//设定初始的藏身处设施，每个"type"对应不同的设施
                "Areas": [
                    {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 1, //设施的初始等级
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 3//type3是仓库
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 0//通风
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 1//安全门
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 2//厕所
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 4//发电机
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 5//暖气
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 6//水收集器
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 7//医疗站
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 8//厨房
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 9//休息间
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 10//工作台
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 11//情报中心
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 12//靶场
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 13//书架
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 14//Scav宝箱
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 15//照明
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 16//名人堂
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": false,
                        "slots": [],
                        "type": 17//空滤
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 18//太阳能
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 19//酿酒器
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 20//挖矿机
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 21//圣诞树
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 22//可破坏的墙
                    }, {
                        "active": true,
                        "completeTime": 0,
                        "constructing": false,
                        "lastRecipe": "",
                        "level": 0,
                        "passiveBonusesEnabled": true,
                        "slots": [],
                        "type": 23//健身房
                    }
                ],
                "Improvement": {},
                "Production": {}
            },
            "Info": {//人物基本信息，一般不改。
                "AccountType": 0,
                "BannedState": false,
                "BannedUntil": 0,
                "Bans": [],
                "Experience": 0,
                "GameVersion": "standard",
                "IsStreamerModeAvailable": false,
                "LastTimePlayedAsSavage": 0,
                "Level": 1,
                "LowerNickname": "__REPLACEME__",
                "MemberCategory": 0,
                "isMigratedSkills": false,
                "SelectedMemberCategory": 0,
                "Nickname": "__REPLACEME__",
                "NicknameChangeDate": 0,
                "RegistrationDate": "__REPLACEME__",
                "SavageLockTime": 0,
                "Settings": {
                    "BotDifficulty": "easy",
                    "Experience": -1,
                    "Role": "assault"
                },
                "Side": "Bear",
                "SquadInviteRestriction": false,
                "HasCoopExtension": false,
                "Voice": "__REPLACEME__",
                "lockedMoveCommands": true
            },
            "InsuredItems": [],
            "Inventory": {//这里设置人物出生时的身上的初始装备和物品
                "equipment": "5fe49444ae6628187a2e77b8",
                "fastPanel": {},
                "hideoutAreaStashes": {},
                "items": [
                    {
                        "_id": "5fe49444ae6628187a2e77b8",
                        "_tpl": "55d7217a4bdc2d86028b456d"
                    }, {
                        "_id": "63db64cbf9963741dc0d741f",
                        "_tpl": "6401c7b213d9b818bf0e7dd7"
                    }, {
                        "_id": "f5e6bdac05e699d687993249",
                        "_tpl": "544a11ac4bdc2d470e8b456a",
                        "parentId": "5fe49444ae6628187a2e77b8",
                        "slotId": "SecuredContainer"
                    }, {
                        "_id": "01e9d751f10e4e9aebdd94d5",
                        "_tpl": "627a4e6b255f7527fb05a0f6",
                        "parentId": "5fe49444ae6628187a2e77b8",
                        "slotId": "Pockets"
                    }, {
                        "_id": "5fe49444ae6628187a2e78b8",
                        "_tpl": "566abbc34bdc2d92178b4576"
                    }, {
                        "_id": "5fe49444ae6628187a2e78ba",
                        "_tpl": "5963866b86f7747bfa1c4462"
                    }, {
                        "_id": "5fe49444ae6628187a2e78b9",
                        "_tpl": "5963866286f7747bf429b572"
                    }, {
                        "_id": "60dca3da42ad9b706b369aca",
                        "_tpl": "602543c13fee350cd564d032"
                    }, {
                        "_id": "5fe4977574f15b4ad31b661b",
                        "_tpl": "5bffdc370db834001d23eca8",
                        "parentId": "5fe49444ae6628187a2e77b8",
                        "slotId": "Scabbard",
                        "upd": {
                            "Repairable": {
                                "Durability": 80,
                                "MaxDurability": 80
                            }
                        }
                    }
                ],
                "questRaidItems": "5fe49444ae6628187a2e78b9",
                "questStashItems": "5fe49444ae6628187a2e78ba",
                "sortingTable": "60dca3da42ad9b706b369aca",
                "stash": "5fe49444ae6628187a2e78b8"
            },
            "Notes": {
                "Notes": []
            },
            "Quests": [],
            "RagfairInfo": {
                "isRatingGrowing": true,
                "offers": [],
                "rating": 0.2
            },
            "Skills": {//这里设置人物出生时的技能等级
                "Common": [
                    {
                        "Id": "BotReload",
                        "LastAccess": -2147483648,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "BotSound",
                        "LastAccess": -2147483648,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Endurance",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Strength",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Vitality",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Health",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "StressResistance",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Metabolism",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Immunity",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Perception",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Intellect",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Attention",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Charisma",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Memory",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Pistol",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Revolver",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "SMG",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Assault",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Shotgun",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Sniper",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "LMG",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "HMG",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Launcher",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "AttachedLauncher",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Throwing",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Melee",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "DMR",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "RecoilControl",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "AimDrills",
                        "LastAccess": -2147483648,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "TroubleShooting",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Surgery",
                        "LastAccess": -2147483648,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "CovertMovement",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Search",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "MagDrills",
                        "LastAccess": -2147483648,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Sniping",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "ProneMovement",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "FieldMedicine",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "FirstAid",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "LightVests",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "HeavyVests",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "WeaponModding",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "AdvancedModding",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "NightOps",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "SilentOps",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Lockpicking",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "WeaponTreatment",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Freetrading",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Auctions",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Cleanoperations",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Barter",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Shadowconnections",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Taskperformance",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "Crafting",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "HideoutManagement",
                        "LastAccess": 0,
                        "PointsEarnedDuringSession": 0,
                        "Progress": 0
                    }, {
                        "Id": "BearAssaultoperations",
                        "Progress": 0,
                        "PointsEarnedDuringSession": 0,
                        "LastAccess": 0
                    }, {
                        "Id": "BearAuthority",
                        "Progress": 0,
                        "PointsEarnedDuringSession": 0,
                        "LastAccess": 0
                    }, {
                        "Id": "BearAksystems",
                        "Progress": 0,
                        "PointsEarnedDuringSession": 0,
                        "LastAccess": 0
                    }, {
                        "Id": "BearHeavycaliber",
                        "Progress": 0,
                        "PointsEarnedDuringSession": 0,
                        "LastAccess": 0
                    }, {
                        "Id": "BearRawpower",
                        "Progress": 0,
                        "PointsEarnedDuringSession": 0,
                        "LastAccess": 0
                    }
                ],
                "Mastering": [],
                "Points": 0
            },
            "Stats": {
                "Eft": {
                    "Aggressor": null,
                    "CarriedQuestItems": [],
                    "DamageHistory": {
                        "BodyParts": [],
                        "LethalDamage": null,
                        "LethalDamagePart": "Head"
                    },
                    "DroppedItems": [],
                    "ExperienceBonusMult": 0,
                    "FoundInRaidItems": [],
                    "LastPlayerState": null,
                    "LastSessionDate": 0,
                    "OverallCounters": {
                        "Items": []
                    },
                    "SessionCounters": null,
                    "SessionExperienceMult": 0,
                    "SurvivorClass": "Unknown",
                    "TotalInGameTime": 0,
                    "TotalSessionExperience": 0,
                    "Victims": []
                }
            },
            "TradersInfo": {},
            "UnlockedInfo": {
                "unlockedProductionRecipe": []
            },
            "moneyTransferLimitData": {
                "nextResetTime": 1717779074,
                "remainingLimit": 1000000,
                "totalLimit": 1000000,
                "resetInterval": 86400
            },
            "WishList": [],
            "_id": "__REPLACEME__",
            "aid": "__REPLACEME__",
            "savage": "__REPLACEME__"
        },
        "dialogues": {},
        "equipmentBuilds": {},
        "suits": [
            "5cd946231388ce000d572fe3",
            "5cd945d71388ce000a659dfb",
            "666841a02537107dc508b704"
        ],
        "trader": {
            "initialLoyaltyLevel": {
                "54cb50c76803fa8b248b4571": 1,
                "54cb57776803fa99248b456e": 1,
                "579dc571d53a0658a154fbec": 1,
                "58330581ace78e27b8b10cee": 1,
                "5935c25fb3acc3127c3d8cd9": 1,
                "5a7c2eca46aef81a7ca2145d": 1,
                "5ac3b934156ae10c4430e83c": 1,
                "5c0647fdd443bc2504c2d371": 1,
                "638f541a29ffd1183d187f57": 1
            },
            "initialStanding": {
                "default": 0
            },
            "initialSalesSum": 0,
            "jaegerUnlocked": false,
            "lockedByDefaultOverride": [
                "579dc571d53a0658a154fbec"
            ]
        },
        "weaponbuilds": {}
    },
```
