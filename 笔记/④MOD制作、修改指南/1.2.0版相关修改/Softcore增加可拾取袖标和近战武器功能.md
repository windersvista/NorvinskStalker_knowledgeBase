在《现实化诺文斯克》v0.9.0版Softcore沉浸感增强设置\\user\\mods\\odt-softcore\\src\\mod.ts添加以下代码：
```
if (config.OtherTweaks.Lootable_Armbands_Melee.enabled) {
				try {
					for (const itemID in items) {
						const item = items[itemID]
						if (item?._parent == "5447e1d04bdc2dff2f8b4567" && item?._props?.Unlootable != undefined) {
							item._props.Unlootable = false
							item._props.UnlootableFromSide = [];
						}
					}
					for (const itemID in items) {
						const item = items[itemID]
						if (item?._parent == "5b3f15d486f77432d0509248" && item?._props?.Unlootable != undefined) {
							item._props.Unlootable = false
							item._props.UnlootableFromSide = [];
						}
					}
				} catch (error) {
					logger.warning("\nOtherTweaks.Lootable_Armbands_Melee failed bacause of the other mod. Send bug report. Continue safely.")
					log(error)
				}
			}
```

并在：《现实化诺文斯克》v0.9.0版Softcore沉浸感增强设置\\user\\mods\\odt-softcore\\config\\config.jsonc添加以下代码：

```
"Lootable_Armbands_Melee": {
			// 可以拾取袖章和近战武器
			"enabled": true
		},
```