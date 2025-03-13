在《现实化诺文斯克》v0.9.0版Softcore沉浸感增强设置\\user\\mods\\odt-softcore\\src\\mod.ts添加以下代码：
```
if (config.OtherTweaks.Disable_FleaBlacklist.enabled) {
				ragfairConfig.dynamic.blacklist.enableBsgList = false;
			}
```

并在：《现实化诺文斯克》v0.9.0版Softcore沉浸感增强设置\\user\\mods\\odt-softcore\\config\\config.jsonc添加以下代码：

```
"Disable_FleaBlacklist": {
			// 关闭跳蚤黑名单
			"enabled": true
		},
```