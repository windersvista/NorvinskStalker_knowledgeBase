# 武器后坐力数据审查报告

## 严重问题（Critical Issues）

### 1. **手枪类（大口径）- 后坐力严重过高**
所有Desert Eagle变体和.357 Magnum都设置了离谱的后坐力值，远超过现实和游戏平衡：

| 武器 | VerticalRecoil | HorizontalRecoil | 问题 |
|------|----------------|------------------|------|
| Desert Eagle 9x33R | 580 | 515 | **极端** |
| Desert Eagle .50 AE | 600 | 540 | **极端** |
| .357 Magnum variants | 600 | 525-525 | **极端** |
| Glock Gochd | 340 | 775 | **HorizontalRecoil极端离谱** |

**现实分析**: 一个手枪的后坐力不应该比突击步枪高7倍！即使是大口径手枪。
**建议**: 
- Desert Eagle 9x33R: VR 580→240, HR 515→180
- Desert Eagle .50 AE: VR 600→280, HR 540→200
- .357 Magnum variants: VR 600→220, HR 525→160
- Glock Gochd: VR 340→150, HR 775→210 (**HorizontalRecoil是主要问题！**)

---

### 2. **机枪HorizontalRecoil - 离谱的水平后坐力**

| 武器 | VerticalRecoil | HorizontalRecoil | 问题 |
|------|----------------|------------------|------|
| Negev/unknown | 160 | **1300** | **完全不合理** |
| M249 | 100 | 350 | HR太高 |

**现实分析**: HorizontalRecoil 1300意味着什么？这是双挺枪还是特殊武器？即使M60和PKM的HR 340-370也似乎偏高。

**建议**:
- Negev/unknown: HR 1300→450
- 所有7.62x51机枪: HR 340→280

---

### 3. **狙击步枪 - HorizontalRecoil不一致**

| 武器 | VerticalRecoil | HorizontalRecoil | 问题 |
|------|----------------|------------------|------|
| Mosin-Nagant variant 1 | 90 | 420 | HR过高 |
| Mosin-Nagant variant 2 | 150 | 240 | HR反而较低？ |
| Remington 700 | 140 | 480 | HR过高 |
| SV-98 | 140 | 480 | HR过高 |
| AWM | 270 | 700 | **HR极端** |

**问题**: 同一类型武器，HR差异巨大（240-700）且没有逻辑关联

**建议**: 所有7.62x54R狙击步枪统一:
- VerticalRecoil: 140-150
- HorizontalRecoil: 380-420（而非240-700）

---

## 数据范围总结（By Category）

### 突击步枪（5.56mm）
- **VerticalRecoil**: 60-65 ✓（合理）
- **HorizontalRecoil**: 160-200 ✓（合理）
- **CameraRecoil**: 0.037-0.055 ✓（合理）

### 突击步枪（7.62x39）
- **VerticalRecoil**: 60-84 ✓（合理）
- **HorizontalRecoil**: 195 ✓（合理）
- **CameraRecoil**: 0.043-0.055 ✓（合理）

### SMG（9mm/.45ACP）
- **VerticalRecoil**: 23-50 ✓（合理）
- **HorizontalRecoil**: 75-156 ✓（合理）
- **CameraRecoil**: 0.034-0.052 ✓（合理）

### 霰弹枪
- **VerticalRecoil**: 115-210 ⚠️（偏高但可接受）
- **HorizontalRecoil**: 280-500 ⚠️（偏高但可接受）
- **CameraRecoil**: 0.055-0.135 ⚠️（偏高但可接受）

### 机枪
- **VerticalRecoil**: 90-175 ✓（合理）
- **HorizontalRecoil**: 190-1300 ❌（1300离谱，190-350较合理）
- **CameraRecoil**: 0.045-0.087 ✓（合理）

### 狙击步枪
- **VerticalRecoil**: 90-270 ⚠️（270太高，应该140-150）
- **HorizontalRecoil**: 240-700 ❌（极端差异，应该380-420）
- **CameraRecoil**: 0.125 ✓（合理）

### 标兵步枪
- **VerticalRecoil**: 60-180 ⚠️（60过低，应该100-120）
- **HorizontalRecoil**: 110-650 ❌（650太高，应该200-300）
- **CameraRecoil**: 0.033-0.175 ⚠️（变化太大）

### 手枪（9mm/.45ACP）
- **VerticalRecoil**: 300-460 ❌（应该150-250）
- **HorizontalRecoil**: 160-330 ⚠️（应该120-200）
- **CameraRecoil**: 0.002-0.006 ❌（应该0.008-0.015）

### 手枪（大口径）
- **VerticalRecoil**: 580-600 ❌（应该200-280）
- **HorizontalRecoil**: 515-540 ❌（应该150-200）
- **CameraRecoil**: 0.012-0.019 ⚠️（应该0.02-0.03）

### 榴弹发射器
- **VerticalRecoil**: 70-400 ⚠️（400太高，应该180-250）
- **HorizontalRecoil**: 200-1000 ❌（1000太高，应该350-500）
- **CameraRecoil**: 0.088 ✓（合理）

---

## 调整建议优先级

### P1 - 必须修复（游戏平衡破裂）
1. ❌ Desert Eagle系列 (VR 580-600)
2. ❌ .357 Magnum variants (VR 600, HR 775)
3. ❌ Negev/Unknown机枪 (HR 1300)
4. ❌ 狙击步枪AWM (HR 700)
5. ❌ 标兵步枪SCAR-H (HR 650)

### P2 - 应该修复（数据不一致）
1. ⚠️ 狙击步枪群组 (HR范围240-700，应统一)
2. ⚠️ 机枪HR值 (M60 E4: 170 VR但HR 340似乎不对应)
3. ⚠️ 标兵步枪群组 (VR 60-180，应该60-120)
4. ⚠️ 手枪群组 (CameraRecoil过低0.002-0.006)

### P3 - 可选调整（微调平衡）
1. 霰弹枪VR调低 (210→180-190)
2. 榴弹发射器Recoil调低 (VR 400→250)

---

## 统计异常

**最大离谱系数（Anomaly Factor）**:
- Glock Gochd HR: 775 / (平均HR 200) = **3.87倍异常**
- Desert Eagle VR: 580 / (5.56步枪VR 65) = **8.9倍异常**
- Negev HR: 1300 / (平均机枪HR 280) = **4.6倍异常**

**结论**: 这些值不是"游戏平衡"，而是明显的数据输入错误。

---

## 实施计划

建议按以下顺序修复：
1. **第一批**: 修复P1问题（5个武器）
2. **第二批**: 修复狙击步枪群组不一致性
3. **第三批**: 修复所有手枪CameraRecoil
4. **第四批**: 精微调整其他类别

预计共需调整: **40-60个武器条目**
