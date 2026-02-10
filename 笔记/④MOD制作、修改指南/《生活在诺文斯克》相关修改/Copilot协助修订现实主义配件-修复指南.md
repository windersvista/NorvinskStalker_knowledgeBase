# 武器配件数值修复指南

## 🎯 优先修复清单

### 第一阶段：紧急修复(需要立即执行)

---

#### 1. MuzzleDeviceTemplates.json - 贝叶特匕首修复

**文件**: `MuzzleDeviceTemplates.json`
**问题**: 贝叶特数值过于惩罚

**需要修改的条目**:
```
- "mosin_bayonet" (ItemID: 6783afddef9d6f5d579c43f1)
- "m9_bayonet" (ItemID: 6783b041281387d669fd3722)
- 其他所有bayonet条目
```

**修改内容**:
| 字段 | 原值 | 新值 | 理由 |
|---|---|---|---|
| VerticalRecoil | +5 | +1 | 贝叶特不应该增加5点后坐力 |
| HorizontalRecoil | 0 | 0 | 保持不变 ✓ |
| Accuracy | -12 | -3 | -12太严重，-3足够表示精度降低 |
| Dispersion | 5 | 2 | 分散度过高 |
| CameraRecoil | -1 | 0 | 建议移除 |
| RecoilAngle | 3 | 1 | 太高 |
| Ergonomics | -5 | -2 | 人体工程学惩罚过度 |
| Weight | 0.5 | 0.5 | 保持 ✓ |
| MeleeDamage | 112 | 112 | 保持 ✓ |
| MeleePen | 40 | 40 | 保持 ✓ |

**范例修改**:
```json
// 原配置
"6783afddef9d6f5d579c43f1": {
    "Name": "mosin_bayonet",
    "VerticalRecoil": 5,
    "Accuracy": -12,
    "Ergonomics": -5,
}

// 新配置
"6783afddef9d6f5d579c43f1": {
    "Name": "mosin_bayonet",
    "VerticalRecoil": 1,
    "Accuracy": -3,
    "Ergonomics": -2,
}
```

---

#### 2. MuzzleDeviceTemplates.json - Flash值标准化

**问题**: Flash值（枪口闪光）应该总是负数或0，但出现了+30

**需要修复的模式**:
```
- 所有 Flash: 30 的条目应该改为 Flash: -30
- 所有 Flash: -10 ~ -30 的保持
- 检查所有 Flash: 正数 的条目
```

**修改规则**:
```
消焰器 (Muzzle Brake):      Flash: 0 ~ -10
消音器 (Suppressor):       Flash: -15 ~ -30
补偿器 (Compensator):      Flash: -5 ~ -15
消焰补偿器 (Silencer+Comp): Flash: -20 ~ -35
```

---

#### 3. BarrelTemplates.json - SemiROF负数清理

**问题**: 枪管中出现 SemiROF: -0.5 ~ -4 的负数

**查找所有这样的条目并删除或改为0**:

```javascript
// 需要清理的示例
- SemiROF: -1.7 → 删除该字段或改为 0
- SemiROF: -1.25 → 删除该字段或改为 0
- SemiROF: -4 → 删除该字段或改为 0
```

**为什么删除**: 射速修正应该通过AutoROF/SemiROF的正数表示增强，不应该用负数表示惩罚。这应该用专门的字段如`ROFPenalty`或`SemiROFModifier`

---

### 第二阶段：结构性改进

---

#### 4. BarrelTemplates.json - Velocity值重新计算

**现状分析**:
```
100mm短枪管: Velocity: -1（太轻）
400mm标准: Velocity: 0（正确）
300mm标准: Velocity: 0（应该 -0.5）
600mm长: Velocity: 0（应该 +1～+2）
```

**建议的对应表**:
| 枪管长度 | 类型示例 | Velocity值 |
|---|---|---|
| <100mm | Micro barrel | -5 ~ -3 |
| 100-150mm | PDW barrel | -3 ~ -2 |
| 150-200mm | Pistol/SMG | -1 ~ 0 |
| 200-300mm | Shorter AR | -0.5 ~ 0 |
| 300-400mm | Standard | 0 |
| 400-500mm | Rifle | +1 ~ +2 |
| 500-600mm | Long rifle | +2 ~ +3 |
| 600mm+ | DMR/Sniper | +3 ~ +4 |

**需要逐个检查并调整的枪口装置**

---

#### 5. StockTemplates.json - 人体工程学分级系统

**现状**: 所有枪托的Ergonomics都是10（无差异）

**建议分级**:
```json
// 基础固定枪托
{
    "Name": "stock_ak_izhmash_std",
    "Ergonomics": 8,
    "CameraRecoil": -5,
    "AimSpeed": 3
}

// 标准可调枪托
{
    "Name": "stock_ar15_std_mil_spec",
    "Ergonomics": 10,
    "CameraRecoil": -6,
    "AimSpeed": 4
}

// 高级战术枪托
{
    "Name": "stock_ar15_ops_core_sup",
    "Ergonomics": 12,
    "CameraRecoil": -8,
    "AimSpeed": 5
}
```

---

#### 6. GasblockTemplates.json - 移除不适当的SemiROF

**问题**: 气体块中不应该有射速修正

**查找并删除**:
```
- SemiROF: -3 → 删除
- SemiROF: -6 → 删除
- SemiROF: -1 ~ -1.5 → 删除
```

**保留字段**: 只保留正常的能量/热量相关修正

---

### 第三阶段：优化性改进

---

#### 7. AuxiliaryModTemplates.json - 双脚架优化

**现状双脚架对比**:
```
所有双脚架数值几乎相同，没有区分
```

**建议优化**:
| 双脚架 | 重量(kg) | VerticalRecoil | Accuracy | 用途 |
|---|---|---|---|---|
| Harris BRM | 0.277 | -8 | +15 | 轻量便携 |
| M60标准 | 0.537 | -10 | +20 | 重型机枪 |
| SV-98 | 0.472 | -10 | +20 | 狙击专用 |

**修改主要是Accuracy值的差异化**

---

#### 8. HandguardTemplates.json - 删除M60重复

**问题**: 约30%的内容是M60的不同颜色变种

**建议**:
- 保留M60标准版本（黑色/FDE）
- 删除所有其他纯色变种
- 保留功能性不同的版本（Mod1, Mod4等）

**预期删除行数**: ~1200行

---

#### 9. MagazineTemplates.json - 故障率调整

**修改这些条目**:
```json
// 原配置
"mag_uzi_iwi_9x19_40": {
    "MalfunctionChance": 0.002  // ❌ 太低
}

// 新配置
"mag_uzi_iwi_9x19_40": {
    "MalfunctionChance": 0.008  // ✓ 与其他40弹容量一致
}
```

**故障率参考标准**:
| 容量 | 故障率 | 解释 |
|---|---|---|
| 10-15发 | 0.01 | 小容量稳定 |
| 20-25发 | 0.01 | 标准稳定 |
| 30-40发 | 0.015 | 容量增加风险 |
| 50+发 | 0.08-0.15 | 大容量高风险 |

---

#### 10. MountTemplates.json - 添加Accuracy修正

**建议**:
```json
// 基础挂载
"mount_uzi_pro_iwi_rail_adapter": {
    "Accuracy": 0  // 保持
}

// 精密挂载
"mount_zenit_b50_precision": {
    "Accuracy": 1  // 添加精度加成
}
```

---

## 📋 检查清单

### 通用检查项
- [ ] 所有VerticalRecoil值在 -20 ~ +5 范围内
- [ ] 所有HorizontalRecoil值在 -20 ~ +5 范围内
- [ ] Ergonomics值在 -10 ~ +15 范围内
- [ ] Weight值为正数
- [ ] AimSpeed/Vision值合理（-5 ~ +5）
- [ ] LoyaltyLevel在 1 ~ 5 之间
- [ ] 所有JSON引号匹配
- [ ] 没有重复的ItemID

### 特定检查
- [ ] 贝叶特数值已调整
- [ ] Flash值标准化
- [ ] SemiROF负数已移除
- [ ] 枪管Velocity重新计算
- [ ] 枪托人体工程学分级
- [ ] M60重复删除

---

## 📊 修改前后对比示例

### 示例1: 贝叶特修复

```json
// BEFORE (错误)
"6783afddef9d6f5d579c43f1": {
    "Name": "mosin_bayonet",
    "VerticalRecoil": 5,
    "HorizontalRecoil": 0,
    "Dispersion": 5,
    "CameraRecoil": -1,
    "Accuracy": -12,
    "Ergonomics": -5,
    "Weight": 0.5,
    "MeleeDamage": 112,
    "MeleePen": 40
}

// AFTER (正确)
"6783afddef9d6f5d579c43f1": {
    "Name": "mosin_bayonet",
    "VerticalRecoil": 1,
    "HorizontalRecoil": 0,
    "Dispersion": 2,
    "CameraRecoil": 0,
    "Accuracy": -3,
    "Ergonomics": -2,
    "Weight": 0.5,
    "MeleeDamage": 112,
    "MeleePen": 40
}
```

### 示例2: 双脚架优化

```json
// BEFORE (无差异)
所有双脚架:
  Accuracy: +20
  Ergonomics: -8

// AFTER (差异化)
轻型双脚架:
  Accuracy: +15
  Ergonomics: -5

中型双脚架:
  Accuracy: +20
  Ergonomics: -8

重型双脚架:
  Accuracy: +25
  Ergonomics: -10
```

---

## 🚀 实施步骤

### 第1步: 备份
```
复制整个 attatchments 文件夹到安全位置
```

### 第2步: 紧急修复(30分钟)
1. 修复MuzzleDeviceTemplates中的贝叶特
2. 标准化Flash值
3. 删除所有SemiROF负数

### 第3步: 结构优化(1小时)
4. 重新计算Velocity值
5. 分级枪托属性
6. 优化双脚架配置

### 第4步: 验证(20分钟)
7. 使用JSON验证工具检查语法
8. 验证所有ItemID唯一性
9. 测试游戏内加载

### 第5步: 回归测试
10. 检查所有配件能否正常装备
11. 测试火力参数是否合理

---

## 📞 需要帮助?

如果遇到问题，检查:
1. JSON格式是否正确（开头闭合、逗号、引号）
2. ItemID是否与游戏数据库一致
3. 字段名称是否正确拼写
4. 数值范围是否合理

---

*修复指南版本: 1.0*
*最后更新: 2026-02-08*
