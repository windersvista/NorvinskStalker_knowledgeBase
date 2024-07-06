## Changes


### EFT CHANGES
* `Unheard` profile
* New PMC outfits
* Added `Ref` Trader (Partially implemented in SPT)
* Adjustments to sound system
* Added `BTR-82A` to Woods
* Added first iteration of seasons system
* New trader barters
* Body hitbox penetration rework
* Armor penetration rework
* New sandbox map for level 20+
    * Better loot
    * `Kollontay` boss
* Significantly reduced fog on all maps
* GP coins are now a currency and stack to 20
* New achievements
* Reduced inertia
* Removed `Found In Raid` requirement for listing items in flea market
* Enabled `Spring` season

### ADDED
* New Server and Launcher icons from competition winner (Rasdow) https://dev.sp-tarkov.com/SPT/Server/commit/41b047e43657e8a38d5748ec7435add4d69edf16
* Regenerated map loot using 3.5 months worth of data dumps
* Added quests `Easy Money. Part 1`, `Easy Money part 2`, `Balancing Part 1`, `Balancing Part 2`,  `A Key to Salvation`, `Gendarmerie District Patrol`, `Test Drive Part 3` and `Hustle`
* Item/quest/trader icons are now stored separately from live inside the SPT folder (spt/user/sptAppData) https://dev.sp-tarkov.com/SPT/Modules/pulls/133
* Added `TarkovTV` gift codes `KILLA, BITCOIN, GROUNDZERO1, OBDOLBOS, THICC` https://dev.sp-tarkov.com/SPT/Server/commit/910189d4254cc301a9e8b9deda65f241a8dda3ae
* Added `Tournament` profile (Unique secure container + flea and fence ban) https://dev.sp-tarkov.com/SPT/Server/commit/eba65cdd834f72d72d9e910681319b070a09c57d
    * Added tournament profile gift code. Send `TOURNAMENTGIFT` to SPT on friend list https://dev.sp-tarkov.com/SPT/Server/commit/885a2abcab56fcabfe49e60776be539b9f820089
* PMCs will sometimes send player a pity gift code if they die and feel bad https://dev.sp-tarkov.com/SPT/Server/commit/e0717daa996af8647c5e7ba9358c6d1b109625b0
* Added per-location static loot https://dev.sp-tarkov.com/SPT-AKI/Server/commit/57557d60633a2a56e4f75fd38f0919d35abf95a1
    * Each maps containers are filled with loot data generated using only that map
    * Results in more live-accurate loot being found
* Added new data structure for `sandbox_high` https://dev.sp-tarkov.com/SPT-AKI/Server/commit/3e99f6761f12c45296ca160112cddfa8a2a5eb33
* Added system to set the minimum level of a generated bot on a map https://dev.sp-tarkov.com/SPT-AKI/Server/commit/297e35a1ffe78da86146ab7f07bea9009cc48be1
    * Utilized by `sandbox_high` to prevent PMCs below level 20 appearing
* Added system to set max level of a generated bot on a map https://dev.sp-tarkov.com/SPT-AKI/Server/commit/06b35ddde8171d7a953881b1ce3b142d7dcdd514
    * Utilized by `sandbox` to prevent PMCs above level 20 appearing
* Added `Unheard` profile preset https://dev.sp-tarkov.com/SPT-AKI/Server/commit/0d00fb5370a40cee9f26ff56a3916953be648f6e
* Added different redeem times for mail rewards based on profile type https://dev.sp-tarkov.com/SPT-AKI/Server/commit/597ea96f34335f3d2ff6a1665c98d37b08896499
* Added support for `Mark of the Unheard` insurance return time buff https://dev.sp-tarkov.com/SPT/Server/commit/bf528fd1dec738133e5a5f91d073b4951cddbc1a
* Added gift code `HIDEOUTCAT`, rewards `Mr Kerman's cat hologram` https://dev.sp-tarkov.com/SPT/Server/commit/7f0d740a1775559e3549fdd900475d03fab0b245
* Added system to purchase all clothing from trader on profile creation - enabled for `Tournament` profile
* Added new lootable item blacklist and added checks to bot and map loot generator code https://dev.sp-tarkov.com/SPT/Server/commit/0574392f28b7b949013c02ff31af9d5b8ea23420
* Added ability for quests to reward achievements https://dev.sp-tarkov.com/SPT/Server/commit/e5398f5e4d332d876001d3736b2788fc04f14ea7
* Added `Ironsights` to SMG attachment whitelist https://dev.sp-tarkov.com/SPT/Server/commit/7c1613c33160e9b23ff7b01165c15a28cfd5d937
* Added `M48 Tactical Kukri` to PMC loot blacklist https://dev.sp-tarkov.com/SPT/Server/commit/020c30d55bc95da64f30ec39b3f26ac0cb9fa697
* Added `Cultist top` to PMC clothing pool https://dev.sp-tarkov.com/SPT/Server/commit/8f3a065e2d458f9736281bdae5e492c46cd7f2f6
* Added `masterMod (barrels/pistol grips/handguards/receivers)` item types to single stack only when listed on ragfair https://dev.sp-tarkov.com/SPT/Server/commit/158258a3985589777653e0978482c340fe7c015f
* Added additional skills to `Commando` chat bot https://dev.sp-tarkov.com/SPT/Server/commit/01d38641057c0074c27daf4bdbdb4ee287a09ba1
* Added menu during game load that displays bundle loading progress https://dev.sp-tarkov.com/SPT/Modules/commit/d9747c16cc5300283a62fe1a254aec24ad666bb5
* Added `Mr Kerman's cat hologram` to reward blacklist https://dev.sp-tarkov.com/SPT/Server/commit/06cc13c94143c931827a53b6aee6b3a68d20831a
* Added WIP ability to convert all scavs into bosses
* Added additional PMC names (modders + `3.9.0` contributors / translators)

### MODIFIED
* Regenerated all bot data using new dumps https://dev.sp-tarkov.com/SPT-AKI/Server/commit/5d4fb70e474fcd523b7c8961f616f0b71ef4fba3
* Updated trader and quest data https://dev.sp-tarkov.com/SPT-AKI/Server/commit/8f4919a9c7a8a92c8d27f57cfa1d6c7ee802907f
* Reduced low level `sandbox` max level to be 20 https://dev.sp-tarkov.com/SPT-AKI/Server/commit/d6cd99b8abc4ecc49812f1f09885854c8c7eb0f0
* 	Adjusted `sendInsuredItems()` to use the globals property `Insurance.MaxStorageTimeInHour` https://dev.sp-tarkov.com/SPT-AKI/Server/commit/65e2b87190ef89529393c1b3824b8a2692c34644
* Improved how handbook and flea prices are cached https://dev.sp-tarkov.com/SPT-AKI/Server/commit/fcabd68dfc3f704c4c9331f959b5bcac6aeac032
* 	Improved locale text for `modloader-outdated_sptversion_field`
* Localized many additional error and warning messages https://dev.sp-tarkov.com/SPT/Server/commit/139b139581b3ae4a1c7e1f63359df54f6937f507 https://dev.sp-tarkov.com/SPT/Server/commit/a48e130f1bfa1b5bb475d65825cb5f03fcc746ce
* Attempted to reduce times weapon spawns with a large gas block that obscures optics https://dev.sp-tarkov.com/SPT/Server/commit/cd965bb733ab8f2fb9e6a6ae539b4eeef25f5f86
* 	Adjusted `followerBoar` generation weights https://dev.sp-tarkov.com/SPT/Server/commit/b29d5f957da5cc3f4fa5821ad027f8b1ce81f2dd
* Adjusted seasonal start times https://dev.sp-tarkov.com/SPT/Server/commit/e38ad6dc3e30c2c373b7806467e4acb3fd721158 https://dev.sp-tarkov.com/SPT/Server/commit/ff39d733e985129a4a517264506a10ca632f1f2b
* Updated unheard profiles to have 72 hours to open mail https://dev.sp-tarkov.com/SPT/Server/commit/597ea96f34335f3d2ff6a1665c98d37b08896499
* Improved accuracy of flea offer data https://dev.sp-tarkov.com/SPT/Server/commit/4081508bf3a53c5e29ac8e892087f022300d0711
* Improved how PMC difficulty values are generated to improve PMC vs PMC interactions https://dev.sp-tarkov.com/SPT/Server/commit/6623a86d0ffd2b91e0af744c7799f882d84fdb48
* Improved insurance calculation accuracy https://dev.sp-tarkov.com/SPT/Server/commit/82c6add9ab670ef6481343b2aad9f7446ba35d13
* Removed duplicate PMC names https://dev.sp-tarkov.com/SPT/Server/commit/1c8805c3657c16daac81234d93b9acd79a1ef71b
* Localized many warnings and errors throughout the server into various languages
* Updated `SaveServer.load()` to log the total time taken to load profiles on server started instead of per profile https://dev.sp-tarkov.com/SPT/Server/commit/5bd49ded593c6c6900340c300ceeaaabb016cff8
* Adjusted PMC weapon choices at low and high levels https://dev.sp-tarkov.com/SPT/Server/commit/3341faacdff378c7aa3aa8e83bafff3c699dfaee
* Server will now show an error when a config file cannot be correctly read due to typos https://dev.sp-tarkov.com/SPT/Server/commit/b645e6f51b124b8ecdf82e3af5cd88b2adc14350
* Gift system changes:
    * Gifts can be received multiple times (configurable) https://dev.sp-tarkov.com/SPT/Server/commit/75a34f5ca2b00cb94dd119318f2eac8493d969ff
    * Stash expansion gift can be used 5 times
    * Dev balaclava gift can be used 5 times
    * Prapor day1/2 gift can be used 5 times
* Updated `Revenge` values for bots https://dev.sp-tarkov.com/SPT/Server/commit/dd8824a042417dbfeafb07cf456e9203ba3a64b5
* Updated hideout tick calculation to check if crafts hideout area needs power or not https://dev.sp-tarkov.com/SPT/Server/commit/86380e845ae4c9904441dce3dad1508c7a6f6ebf
* Updated PMC game version weights https://dev.sp-tarkov.com/SPT/Server/commit/6f646d03e88ddbba3492855f0df93a1d7baf16a5
* Adjusted PMC loot generation to allow for 1x2 sized items to be added to the pocket pool to account for UhD bots' large pockets https://dev.sp-tarkov.com/SPT/Server/commit/928f9068a37a129df420faac123f75ac69423817
* Added all dogtags to `rewardItemBlacklist` https://dev.sp-tarkov.com/SPT/Server/commit/d0aca73611285c5c81dd9ccc9af570523a8465ef
* Adjusted how sell chance % is calculated for player flea offers for items below max durability https://dev.sp-tarkov.com/SPT/Server/commit/cf5411336f172e1bdd6d518136187f5775b054df
* Gift boxes no longer reward items on the `reward item` blacklist https://dev.sp-tarkov.com/SPT/Server/commit/7891db84def97cae144fc5e0d2dcfe05d5c5b410
* Reduced occurrences when bots fly upwards on death https://dev.sp-tarkov.com/SPT/Modules/commit/cd190061cff783393c2f32bb265eeecbbb810572
* Updated `createRandomLoot()` to make use of `rewardItemBlacklist` blacklist https://dev.sp-tarkov.com/SPT/Server/commit/7891db84def97cae144fc5e0d2dcfe05d5c5b410
* Plates in armors listed by `Fence` now have individual chances to be removed before listing based on plate protection level
    * Higher level plates have a higher chance of being removed

### FIXED
* 	Fixed`drawAmmoTpl()` failures killing loot generation when cartridge data cannot be found inside `staticAmmoDist` https://dev.sp-tarkov.com/SPT-AKI/Server/commit/bddf87a4e276162f06be52a036450d459baa4618
* Expanded fallback of client locale handling to include the region code (now Handles Czech and Korean locales) https://dev.sp-tarkov.com/SPT-AKI/Server/commit/adab18e3fb22a84e842bb52ac42c0cddcb7d41fb
* Fixed an issue where getting difficulty settings of a bot type that doesn't exist would error https://dev.sp-tarkov.com/SPT-AKI/Server/commit/1d8bc4537c9db3a657c68bfe61692670f6290921
* Fixed `Commando` friend giving items with missing inserts https://dev.sp-tarkov.com/SPT-AKI/Server/commit/7dc17acb971bdf96bf7c81e139d6c2827917d1d6
* Fixed issue with server failing to generate a green flare as its a weapon without a default preset https://dev.sp-tarkov.com/SPT-AKI/Server/commit/f581b8ff2adefc9c30edb240a5f8d4c65bff6ca7
* Fixed `PenetrationDamageMod` being a required property https://dev.sp-tarkov.com/SPT-AKI/Server/commit/fcabd68dfc3f704c4c9331f959b5bcac6aeac032
* Fixed `swapItem()` not supporting scav items https://dev.sp-tarkov.com/SPT-AKI/Server/commit/66cac910c3fe9f20d2a7d1b1da5b456e2df2f2b9
* Fixed the Mod Dependency Installer throwing an error when spaces are found on the mod path https://dev.sp-tarkov.com/SPT-AKI/Server/commit/d437b5b9222a3da306adba81d2e8278726871e33
* Fixed context menu appear in middle of screen when clicking a pmc flea seller https://dev.sp-tarkov.com/SPT/Server/commit/37f4a23acf9b4b046431486206fc41d140601f4a
* Fixed `Bloodhounds` lacking soft-inserts inside their `Ops-Core FAST MT Super High Cut helmet` https://dev.sp-tarkov.com/SPT/Server/commit/81bb920b164d3ef9e5ff4bbb1fbadc16c9023755
* Fixed quest items placed as part of an objective being returned as insurance https://dev.sp-tarkov.com/SPT/Server/commit/c0d3c5384f4002e4cae2679a6669125494f57d77 https://dev.sp-tarkov.com/SPT/Modules/commit/6ae825ee6a55dfd0fad33e57d5190648c59b048c
* Fixed `sendGiftToPlayer()` not correctly sending profile change events https://dev.sp-tarkov.com/SPT/Server/commit/e505f8613773be16aacfa9b9ead4f4160c7b01d5
* Fixed `profileChangeEvent()` `Skill` failing when invalid skill passed in https://dev.sp-tarkov.com/SPT/Server/commit/aa03a002ed545e65d36a8eea09637840b9126efb
* Fixed issue with `redeemProfileReward()` not correctly levelling up traders, causing player to only see level 1 trader items until a restart https://dev.sp-tarkov.com/SPT/Server/commit/ef8307540b67ad7986c323b0e61c6a5f4dc065eb
* Fixed `getLocalesGlobal()` not correctly falling back to English when desired locale not found https://dev.sp-tarkov.com/SPT/Server/commit/e2dd677b40edbfe628130a29d3d7ef9da2b3f496
* Fixed `Prapor` day 1/2 gifts not being sent https://dev.sp-tarkov.com/SPT/Server/commit/ca642b94a7f884875dfb56a586bc45f7c563f367
* Fixed PMCs not sending post-raid messages sometimes https://dev.sp-tarkov.com/SPT/Server/commit/2a9cbab762b6beb523cfd8910a8172f7bc2be396
* Added flea sorting by barter item https://dev.sp-tarkov.com/SPT/Server/commit/836910c1d5a6fb21b10f348f723fe64a10d54116
* Fixed `EoD` PMCs not having their `memberCategory` set to the correct value https://dev.sp-tarkov.com/SPT/Server/commit/d315414136b06a35141f1001046f6e94fdf33e74
* Fixed `Prapor` starting gifts not sending https://dev.sp-tarkov.com/SPT/Server/commit/5d0cfd797119911beea02e3aca0bf2008298cc74
* Fixed accepting/completing `Network Provider - Part 2` causing a server error https://dev.sp-tarkov.com/SPT/Server/commit/836df0ce9d5abbe288794d524016161e34bec571
* Fixed non-stackable items being stacked for gift `PraporGiftDay2` https://dev.sp-tarkov.com/SPT/Server/commit/bc31d47efaebef2a40df584d31c20256b017083c
* Fixed fence assort generation system not removing armor plates when instructed

### MODDERS
* Added support for adjustable mail return times based on profile type of player https://dev.sp-tarkov.com/SPT/Server/commit/597ea96f34335f3d2ff6a1665c98d37b08896499
* Added ability to insert custom text into the server watermark at the bottom via core.json config https://dev.sp-tarkov.com/SPT/Server/commit/f68827bdc27a172b43edc33bf63613648d970768
* Added `DatabaseService` as safer alternate to `DatabaseServer` for accessing db https://dev.sp-tarkov.com/SPT/Server/commit/e78087818fd4b4070632f1ea966992f7be645715 https://dev.sp-tarkov.com/SPT/Server/commit/7cdac4e38bcb3e6c821d946a62bb249a625b7ec9 https://dev.sp-tarkov.com/SPT/Server/commit/584eade5302278385b4c2861254c55b9895caec0
* Added ability to flag a profile template as flea banned via the `fleaBlockedDays` property https://dev.sp-tarkov.com/SPT/Server/commit/ca737d2f626d47ec21a4f0a9aa40dcf2b4892b88
* Updated routers to be asynchronous https://dev.sp-tarkov.com/SPT-AKI/Server/commit/2172c296405d4344540ec27f8ea1319640d2ecce
* Added support for new endpoint `client/game/mode` https://dev.sp-tarkov.com/SPT-AKI/Server/commit/001def56a5b8e2c9b97e8be7d7cfaeb781c4a606
* Reworked bot generation to be asynchronous https://dev.sp-tarkov.com/SPT-AKI/Server/commit/2172c296405d4344540ec27f8ea1319640d2ecce
* Added `locationSpecificPmcLevelOverride` to `pmc.json`
* Added new `ICloner` interface to replace `jsonUtil.Clone()` https://dev.sp-tarkov.com/SPT-AKI/Server/commit/f8d1227dfd6047895763db6dec01a83f6ad9e6d2
* Removed locale check from give command (Now handled in `localeService`) https://dev.sp-tarkov.com/SPT-AKI/Server/compare/master...3.9.0-DEV
* Rewrote `LocaleService.getPlatformForClientLocale()` to not depend on `serverSupportedLocales` instead just use the tables for validity checking https://dev.sp-tarkov.com/SPT-AKI/Server/commit/adab18e3fb22a84e842bb52ac42c0cddcb7d41fb
* Extracted code into their own functions from `generateBotsFirstTime()` and `returnSingleBotFromCache()` https://dev.sp-tarkov.com/SPT-AKI/Server/commit/81c7b8751bf93829ff3f186dcd1abd323d9104b8 https://dev.sp-tarkov.com/SPT-AKI/Server/commit/ed6e81ab521d92b5cd5781fb52a96cafeb76a6a2
* Added WebSocket handlers for new connections and messages received through the default EFT socket https://dev.sp-tarkov.com/SPT-AKI/Server/pulls/339
* Restructured Notification interfaces https://dev.sp-tarkov.com/SPT-AKI/Server/commit/f147bb64eb210b533df4e7032985c1cbd19f753a
* Removed docker files from server https://dev.sp-tarkov.com/SPT-AKI/Server/commit/493a54759b02b6a3de3f34eeea7ea5a6e9eb51f5
* Renamed SPT DLLs to improve consistency https://dev.sp-tarkov.com/SPT-AKI/Modules/commit/5a828f9bb7446743bee1c15f369c9154882ee207 https://dev.sp-tarkov.com/SPT-AKI/Modules/pulls/127 https://dev.sp-tarkov.com/SPT-AKI/Modules/commit/311acf54cdecc83e05fbc22f77e5e9089102479d
* Refactored 2 functions `generateModsForWeapon()` and `chooseModToPutIntoSlot()` to reduce their parameter count https://dev.sp-tarkov.com/SPT/Server/commit/cd965bb733ab8f2fb9e6a6ae539b4eeef25f5f86
* Weapon generation now tracks if iron sights/optics were added, stored in `IWeaponStats` https://dev.sp-tarkov.com/SPT/Server/commit/cd965bb733ab8f2fb9e6a6ae539b4eeef25f5f86
* Added `getPmcNicknameOfMaxLength()` to `botHelper` https://dev.sp-tarkov.com/SPT/Server/commit/4081508bf3a53c5e29ac8e892087f022300d0711
* Moved difficulty-related into `BotDifficultyHelper` https://dev.sp-tarkov.com/SPT/Server/commit/6623a86d0ffd2b91e0af744c7799f882d84fdb48
* Made `typeBeingEdited` property in `addBotToEnemyList()` optional https://dev.sp-tarkov.com/SPT/Server/commit/6623a86d0ffd2b91e0af744c7799f882d84fdb48
* Added `validateTraderStandingsAndPlayerLevelForProfile()` to `TraderHelper` https://dev.sp-tarkov.com/SPT/Server/commit/ef8307540b67ad7986c323b0e61c6a5f4dc065eb
* Added `disableLootOnBotTypes` property to `bot.json` config to allow disabling loot on bots by their type https://dev.sp-tarkov.com/SPT/Server/commit/673256e5fac0685963d466df8bf7f8001c677936
* Removed `insuranceMultipler` from `config/insurance.json`, no longer necessary https://dev.sp-tarkov.com/SPT/Server/commit/82c6add9ab670ef6481343b2aad9f7446ba35d13
* Updated `_proto` inside `ITemplateItem` to be nullable https://dev.sp-tarkov.com/SPT/Server/commit/edbb6cec19464828fe368cd142a2dc7a73b76e8b
* Added `ItemType` enum for `_type` property in  `ITemplateItem` https://dev.sp-tarkov.com/SPT/Server/commit/edbb6cec19464828fe368cd142a2dc7a73b76e8b
* Enabled no implicit nulls in server and fixed various issues that arose https://dev.sp-tarkov.com/SPT/Server/commit/aee391ec1dabd5636a939799441939061a0b73d5
*  Added `getTrader()` https://dev.sp-tarkov.com/SPT/Server/commit/7cdac4e38bcb3e6c821d946a62bb249a625b7ec9
* Added `IHideout` interface https://dev.sp-tarkov.com/SPT/Server/commit/d6f7374a9afa3101c489e31e80c73d474bb737e8
* Added `ITemplates` interface https://dev.sp-tarkov.com/SPT/Server/commit/3d4447c978b72299873ed1e3599a61c08d1d24d7
* Expanded `getItemName()` to return short name when full name is not found https://dev.sp-tarkov.com/SPT/Server/commit/b7a9296faccfd36264d0701bfa620100db8ee1b6
* Improved `EventOutputHolder` to store event data per `sessionId` to ensure cross-talk between multiple profiles does not occur https://dev.sp-tarkov.com/SPT/Server/commit/97efad0a79fab4c87f10a7dbc93822461bc89fa6 https://dev.sp-tarkov.com/SPT/Server/commit/a1955d4e7e0c8660e5aa0e6e3aa640fb6fb5402b
* Renamed module class `SptBotsPrePatcher.cs` to `SptPrePatcher.cs`
* Stored free daily quest resets in profile per-daily-type https://dev.sp-tarkov.com/SPT/Server/commit/7842167595535cd73442afe4ce756a1c9c319d8a
* Updated various node packages https://dev.sp-tarkov.com/SPT/Server/commit/dcf816702eedc46c036459d07fdfdc320d4b9fb1
* Introduced Set to speed up calls to `isItemBlacklisted()`  https://dev.sp-tarkov.com/SPT/Server/commit/5b4b0c147196004bf5af43681e5348cd753a848b
* Data from itemFilterService is cloned before being returned https://dev.sp-tarkov.com/SPT/Server/commit/dde78b30eb6c666a97803a94513a9ebd2d52b31f
* 	Updated `getItemPrices()` to return each traders next refresh timestamp https://dev.sp-tarkov.com/SPT/Server/commit/aebe1ab60684022c215ea67432334982dac00760
* Expanded `GiftService` to include methods to get gift by id / all gifts / all gift ids https://dev.sp-tarkov.com/SPT/Server/commit/ca642b94a7f884875dfb56a586bc45f7c563f367
* Added `maxToSendPlayer` property to `IGiftsConfig`
* Added `commandUseLimits` dictionary property to `ICoreConfig`
* Renamed `timestampAccepted` to `timestampLastAccepted` in `ReceivedGift`
* Added `current` property to `ReceivedGift` (count of how many times gift has been given)
* Added `TraderHelper.getAccountTypeAdjustedTraderPurchaseLimit()` to assist with working out correct value of traders `upd.BuyRestrictionMax` property when player is EoD/U https://dev.sp-tarkov.com/SPT/Server/commit/f263f8b0cb3aa7fc0d584fb04d5af9a389208c88
* 	Added ARMOR_PLATE type to getItemSkillType() check https://dev.sp-tarkov.com/SPT/Server/commit/f475d4f6f3aab9f0ca17d4548f5f749fe4fe48de
* Refactored `repeatableQuestRewardGenerator.generateReward()` https://dev.sp-tarkov.com/SPT/Server/commit/bb4bfc6dcb1f4f3249879c16263b67ebdacacb99
* Added craft count check to `findAndAddHideoutProductionIdToProfile()` https://dev.sp-tarkov.com/SPT/Server/commit/ccb351a2dd0baf611ef90824a34bcd7293765e99
* Added `itemHelper.getItemFromPoolByTpl()` and `itemHelper.hasItemWithTpl()` https://dev.sp-tarkov.com/SPT/Server/commit/3327bc916a3185929e78b62fd38a32e03b5da0d8
* Added `itemTpl` enum https://dev.sp-tarkov.com/SPT/Server/commit/edfe995c5209ff21a03644c34ad8e1b7b02fc28a
* Added additional `Skill` enum values https://dev.sp-tarkov.com/SPT/Server/commit/01d38641057c0074c27daf4bdbdb4ee287a09ba1
* Added additional event names to `NotificationEventType` https://dev.sp-tarkov.com/SPT/Server/commit/e65b75261fc18f77e489830a30895c0fd3078ab1
* Fixed `InventoryHelper.canPlaceItemInContainer()` result being reversed
