# 快速修复参考 - 立即可用的JSON修改示例

## 🎯 本文件包含: 可以直接复制粘贴使用的JSON修改代码

---

## ⚡ 紧急修复1: MuzzleDeviceTemplates.json

### 问题: 贝叶特数值过度惩罚

### 修复代码 (查找并替换)

#### M1 Garand 刺刀修复
```json
// ===== 查找这个 =====
"6783afddef9d6f5d579c43f1": {
    "$type": "RealismMod.WeaponMod, RealismMod",
    "ItemID": "6783afddef9d6f5d579c43f1",
    "Name": "mosin_bayonet",
    "ModType": "bayonet",
    "VerticalRecoil": 5,
    "HorizontalRecoil": 0,
    "Dispersion": 5,
    "CameraRecoil": -1,
    "AutoROF": 0,
    "SemiROF": 0,
    "ModMalfunctionChance": 0,
    "CanCycleSubs": false,
    "Accuracy": -12,
    "HeatFactor": 1.5,
    "CoolFactor": 0,
    "DurabilityBurnModificator": 0,
    "Velocity": 0,
    "RecoilAngle": 3,
    "ConflictingItems": [],
    "Ergonomics": -5,
    "Weight": 0.5,
    "Loudness": 0,
    "Convergence": 5,
    "LoyaltyLevel": 1,
    "MeleeDamage": 112,
    "MeleePen": 40
}

// ===== 替换为这个 =====
"6783afddef9d6f5d579c43f1": {
    "$type": "RealismMod.WeaponMod, RealismMod",
    "ItemID": "6783afddef9d6f5d579c43f1",
    "Name": "mosin_bayonet",
    "ModType": "bayonet",
    "VerticalRecoil": 1,
    "HorizontalRecoil": 0,
    "Dispersion": 2,
    "CameraRecoil": 0,
    "AutoROF": 0,
    "SemiROF": 0,
    "ModMalfunctionChance": 0,
    "CanCycleSubs": false,
    "Accuracy": -3,
    "HeatFactor": 1.5,
    "CoolFactor": 0,
    "DurabilityBurnModificator": 0,
    "Velocity": 0,
    "RecoilAngle": 1,
    "ConflictingItems": [],
    "Ergonomics": -2,
    "Weight": 0.5,
    "Loudness": 0,
    "Convergence": 5,
    "LoyaltyLevel": 1,
    "MeleeDamage": 112,
    "MeleePen": 40
}
```

#### M9 刺刀修复
```json
// ===== 查找这个 =====
"6783b041281387d669fd3722": {
    "$type": "RealismMod.WeaponMod, RealismMod",
    "ItemID": "6783b041281387d669fd3722",
    "Name": "m9_bayonet",
    "ModType": "bayonet",
    "VerticalRecoil": 5,
    "HorizontalRecoil": 0,
    "Dispersion": 5,
    "CameraRecoil": -1,
    "AutoROF": 0,
    "SemiROF": 0,
    "ModMalfunctionChance": 0,
    "CanCycleSubs": false,
    "Accuracy": -12,
    "HeatFactor": 1,
    "CoolFactor": 0,
    "DurabilityBurnModificator": 0,
    "Velocity": 0,
    "RecoilAngle": 3,
    "ConflictingItems": [],
    "Ergonomics": -10,
    "Weight": 0.35,
    "Loudness": 0,
    "Convergence": 5,
    "LoyaltyLevel": 1,
    "MeleeDamage": 60,
    "MeleePen": 25
}

// ===== 替换为这个 =====
"6783b041281387d669fd3722": {
    "$type": "RealismMod.WeaponMod, RealismMod",
    "ItemID": "6783b041281387d669fd3722",
    "Name": "m9_bayonet",
    "ModType": "bayonet",
    "VerticalRecoil": 1,
    "HorizontalRecoil": 0,
    "Dispersion": 2,
    "CameraRecoil": 0,
    "AutoROF": 0,
    "SemiROF": 0,
    "ModMalfunctionChance": 0,
    "CanCycleSubs": false,
    "Accuracy": -2,
    "HeatFactor": 1,
    "CoolFactor": 0,
    "DurabilityBurnModificator": 0,
    "Velocity": 0,
    "RecoilAngle": 0,
    "ConflictingItems": [],
    "Ergonomics": -3,
    "Weight": 0.35,
    "Loudness": 0,
    "Convergence": 5,
    "LoyaltyLevel": 1,
    "MeleeDamage": 60,
    "MeleePen": 25
}
```

---

## ⚡ 紧急修复2: Flash值标准化

### 问题: 某些消焰器和消音器的Flash值为正数（+30）

### 修复规则
```
✓ 消焰器应该有: Flash: -10 到 -30
✓ 消音器应该有: Flash: -20 到 -40
✗ 任何 Flash: +30 都应该改为 Flash: -30
```

### 找到使用正则表达式的所有问题
**在JSON编辑器中搜索**: `"Flash": 3` 或 `"Flash": 30`

然后将其改为负数：
```json
// 示例
"Flash": 30   →   "Flash": -30
"Flash": 3    →   "Flash": -3
```

---

## ⚡ 紧急修复3: 删除枪管中的SemiROF负数

### 问题: BarrelTemplates.json 中有很多 `"SemiROF": -1.7` 这样的负数

### 查找模式
```
搜索: "SemiROF": -
替换为: (删除这整行)
```

### 需要处理的示例

#### 问题1: 搜索所有负数SemiROF
```javascript
// 这些都需要删除或改为0
"SemiROF": -1.7,
"SemiROF": -1,
"SemiROF": -1.25,
"SemiROF": -1.5,
"SemiROF": -0.5,
"SemiROF": -0.75,
"SemiROF": -1.2,
"SemiROF": -4,
"SemiROF": -3,
"SemiROF": -2,
```

#### 推荐做法: 完全删除这个字段
```json
// BEFORE (错误)
"BarrelTemplates.json" 中的某个枪管:
{
    "Name": "some_barrel",
    "VerticalRecoil": -1,
    "SemiROF": -1.7,    // ❌ 删除这行
    "ModMalfunctionChance": 0
}

// AFTER (正确)
{
    "Name": "some_barrel", 
    "VerticalRecoil": -1,
    // SemiROF 字段完全删除
    "ModMalfunctionChance": 0
}
```

---

## 📝 步骤式修复指南

### 步骤1: 在VS Code或类似编辑器中打开MuzzleDeviceTemplates.json

### 步骤2: 使用查找和替换（Ctrl+H）

#### 替换所有 Flash: 正数 为负数
```
查找: "Flash": (\d+)
替换为: "Flash": -$1

勾选"使用正则表达式"
```

#### 删除所有负数SemiROF（枪管文件中）
```
查找: ,\s*"SemiROF": -[0-9.]+
替换为: (留白)

勾选"使用正则表达式"
```

### 步骤3: 使用JSON验证工具验证格式
```
在线工具: jsonlint.com
或使用: VS Code 的 JSON 验证
```

### 步骤4: 保存文件

---

## 🔄 批量修复脚本参考

### 使用Python进行批量修改

```python
import json

# 修复MuzzleDeviceTemplates.json
with open('MuzzleDeviceTemplates.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item_id, item_data in data.items():
    # 修复1: 贝叶特数值
    if 'bayonet' in item_data.get('Name', '').lower():
        if item_data.get('VerticalRecoil', 0) > 3:
            item_data['VerticalRecoil'] = 1
        if item_data.get('Accuracy', 0) < -5:
            item_data['Accuracy'] = -3
        if item_data.get('Ergonomics', 0) < -3:
            item_data['Ergonomics'] = -2
    
    # 修复2: Flash值标准化  
    if 'Flash' in item_data and item_data['Flash'] > 0:
        item_data['Flash'] = -item_data['Flash']
    
    # 修复3: 移除SemiROF负数
    if 'SemiROF' in item_data and item_data['SemiROF'] < 0:
        del item_data['SemiROF']

# 保存修改
with open('MuzzleDeviceTemplates.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("修复完成!")
```

---

## 📋 修复验证清单

修改后检查以下内容:

- [ ] 所有第二大括号闭合正确
- [ ] 没有尾部多余的逗号
- [ ] 所有字符串用双引号引起
- [ ] VerticalRecoil 在 -20 ~ +5 范围
- [ ] 贝叶特 Accuracy 在 -5 ~ 0 范围
- [ ] 所有 Flash 值都是负数或0
- [ ] JSON 格式验证通过
- [ ] 游戏内成功加载配置

---

## ⚠️ 备份和回滚

### 修改前必须备份
```
1. 复制整个 attatchments 文件夹
   → 创建 attatchments_backup 文件夹
   → 将所有JSON文件复制到备份文件夹

2. 使用版本控制
   → 如果使用Git: git commit -m "backup before fix"
```

### 如果出现问题需要回滚
```
1. 删除有问题的JSON文件
2. 从备份复制相应的文件回来
3. 重启游戏
```

---

## 🧪 修改后的测试步骤

### 测试1: JSON格式验证
```
右键点击JSON文件 → 用VS Code打开
检查是否有红色波浪线（错误下划线）
```

### 测试2: 游戏加载测试
```
1. 启动游戏
2. 进入装备界面
3. 尝试装备相关配件
4. 检查参数显示是否正确
```

### 测试3: 功能测试
```
1. 装备一把带贝叶特的步枪（如Mosin）
2. 检查后坐力、精度、人体工程学修正是否合理
3. 尝试使用各种消焰器/消音器
4. 检查闪光值是否合理显示
```

---

## 💡 常见问题解决

### 问题1: 修改后游戏崩溃
```
原因: JSON格式有误
解决: 
1. 检查是否有缺失的逗号或引号
2. 使用JSON验证工具
3. 对比原文件找出差异
```

### 问题2: 修改没有生效
```
原因: 游戏缓存或未重启
解决:
1. 完全关闭游戏
2. 清除游戏缓存文件
3. 重新启动游戏
4. 进入装备界面检查
```

### 问题3: 某些配件消失
```
原因: ItemID 可能被修改了
解决:
1. 检查 ItemID 是否保持不变
2. 使用搜索工具找到该ItemID
3. 恢复到正确的ItemID
```

---

## 📞 需要帮助？

检查清单:
- [ ] 备份已创建
- [ ] JSON 格式有效
- [ ] ItemID 保持不变
- [ ] 所有修改都有对应的"改前/改后"记录
- [ ] 游戏重启后再测试

---

*快速参考版本: 1.0*
*适用日期: 2026-02-08*
