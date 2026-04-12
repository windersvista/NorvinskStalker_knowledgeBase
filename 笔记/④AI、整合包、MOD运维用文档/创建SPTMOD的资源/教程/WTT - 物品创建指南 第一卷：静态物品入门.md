# WTT - 物品创建指南 第一卷：静态物品入门

> 本页面适用于任何 SPT 版本

![婴儿](https://i.ibb.co/nsqLjRn4/AA8i-VLt-JUP9fe-Cgw9f-Tz-We9mpzhf-Zhuk-T05z-Z-1h-Ua-XXVR79o-W1x-HEz-Ch-T9j6-CZ14c-Aiq-HSMx-RCcm-MK72.png)

## 先决条件

- [Blender（推荐版本 3.0 及以上）](https://www.blender.org/)
- [Unity Hub](https://unity.com/unity-hub)
- [逃离塔科夫 SDK](https://github.com/S3RAPH-1M/EscapeFromTarkov-SDK)
- 3D模型来源：
    - [Sketchfab](https://sketchfab.com/)（按低多边形+免费下载筛选）
    - [TurboSquid](https://www.turbosquid.com/)（搜索 Game Ready 模型）
    - 创建模型，或者自己寻找模型！
- 服务器模组已准备就绪，您可以添加物品并在游戏中进行测试。

**注意：本指南不涉及服务器修改，仅涉及物品创建。**

## 1. 你将学到什么

本指南将教你如何使用 Blender 和 Unity 向《逃离塔科夫》中添加静态物体（战利品、任务物品等）。完成本指南后，你将能够：

- 导入并缩放 3D 模型以匹配 Tarkov 的比例。
- 在 Unity 中配置 Tarkov 专用脚本来准备你的物品。
- 构建一个自定义资源包，可供游戏内使用。

难度：初级

所需时间：30分钟至1小时

## 2. 寻找模型

该怎么办：

1. 准备好你的 3D 模型，创建一个，或者从 Sketchfab/TurboSquid 下载一个低多边形模型（`.fbx`，，`.obj`或）。`.blend`
    - 尽量避免使用超过 1 万个三角形的模型（可以使用 Blender 的统计面板进行检查）。特殊情况可以接受，但请尽量保持低多边形模型。
2. 搜索词示例：“低多边形钥匙卡”、“军事箱子游戏就绪”。

在本教程中，我们将使用这些[俄罗斯GP5过滤器](https://sketchfab.com/3d-models/russian-gp5-filters-695d7745151b4796a46b4e070811a596)。

![气体过滤器](https://i.ibb.co/hFgB56qh/Screenshot-2025-02-24-064041.png)

> **专业提示**：务必查看型号的许可证。

## 3. 导入 Blender

该怎么办：

1. 首先清理场景：选择所有默认对象并将其删除。
2. 导入您的自定义模型：
    - 文件方面`.blend`：`File > Open`
    - 文件方面`.fbx/.obj/etc`：`File > Import`

![进口](https://i.ibb.co/NzZ11Km/Screen-Recording-2025-02-24-162322.gif)

3. 导入 Tarkov PMC 示例模型作为比例参考：
    - 您可以在内部找到此模型`Escape From Tarkov SDK/Assets/Examples/Models/ExampleCharacter.fbm/ExampleCharacter.fbx`。
    - 在 Blender 中：`File`>> `Import`→`FBX`选择`ExampleCharacter`文件。

![模型导入](https://i.ibb.co/Z6qksNf6/Screen-Recording-2025-02-24-163455.gif)

4. 规模与位置：
    - 按下S按钮缩放。使用S+ X/ Y/Z调整各个轴。
    - 按下按钮G即可抓取模型。使用G+ X/ Y/ 键Z可移动各个轴。
    - 尽可能使你的物体与 PMC 的比例尺相匹配。

![规模](https://i.ibb.co/tTDP5hDp/Screen-Recording-2025-02-24-163541.gif)

5. 应用转换：
    - 右键单击模型 → `Set Origin`→ `Origin to Geometry`。这将把对象的原点设置为其几何体的中心。
    - 按Ctrl+ A→ 应用`Rotation & Scale`以最终确定对象大小。

![转换](https://i.ibb.co/CKJjrNvF/Screen-Recording-2025-02-24-163615.gif)

6. 将对象居中并保存：
    - 按Alt+G清除所有变换，将对象恢复到 Blender 的世界原点`0, 0, 0`。
    - 完成后，请删除示例角色（骨架和网格）。
    - 保存文件！Blender部分已经完成！

![转换](https://i.ibb.co/v4Yj5B0N/Screen-Recording-2025-02-24-164033.gif)

> **故障排除**：如果 Unity 中的缩放看起来不正确，请在 Blender 中重新应用变换。

## 4. 导入到 Unity

该怎么办：

1. 将`.blend`文件拖入 Unity 的**Assets**文件夹。

![资产](https://i.ibb.co/gnWBhZh/Screen-Recording-2025-02-24-195229.gif)

2. 从模型中提取材质（以及纹理，如果有的话）：
    - 点击`.blend`文件 → `Inspector > Materials > Extract Embedded Materials`。您可以选择一个文件夹来解压它们，或者直接点击确定，它们将解压到与`.blend`文件相同的位置。

![提炼](https://i.ibb.co/7tMwn4Nw/Screen-Recording-2025-02-24-195310.gif)

3. 为 Tarkov 着色器分配：
    - 选择材质 → `Shader > Bumped Specular Smap`（塔科夫最常用的着色器）。
    - 如果你还没有分配纹理，现在就应该把它们拖到材质上。包括漫反射（高光）、法线和光泽度（如果有的话）。塔科夫使用的是高光着色器，这意味着高光效果已经烘焙到实际的漫反射纹理中。
    - 每张纹理都会有所不同，尤其是当你拥有带有烘焙高光贴图的正式纹理时。然而，对于_没有_正式纹理的物品（例如我们示例中的GP5模型），我通常从以下几点开始：

|-|-|  
| 主色 | 白色 |  
| 镜面反射 | `0.35`|  
| 光泽度 | `1`|  
| 反射颜色 | 黑色（或接近黑色） |  
| 镜面反射值 | `1 1 0 0`|  
| 漫反射值 | `1 1 0 0`|

- 接下来，你需要调整每种材质的值，才能达到你想要的效果。
- 设置好着色器并应用纹理后，它应该会自动应用到导入的模型上。如果没有自动应用，只需在后续步骤中将材质拖放到模型上即可。

![着色器](https://i.ibb.co/yFMfBx81/Screen-Recording-2025-02-24-195347.gif)

> **重要提示**：请先在您的系统上安装 Blender。Unity 需要它才能`.blend`原生处理文件！

## 5. 设置游戏对象

该怎么办：

1. 将`.blend`文件拖入场景层级结构（左上窗口），右键单击并`Unpack Prefab Completely`.

![解包](https://i.ibb.co/7tDY3Z8b/Screen-Recording-2025-02-25-072543.gif)

2. 请按如下方式设置您的游戏对象层级结构：
    - 创建一个空的游戏对象：右键单击`Hierarchy`→ `Create Empty`→ 重命名为您想要的游戏对象名称。
    - 职位在`0, 0, 0`……
    - 将你的模型拖入空的游戏对象中。

![游戏对象](https://i.ibb.co/cSmw4x2L/Screen-Recording-2025-02-25-072733.gif)

3. 请按照以下步骤设置您的游戏对象脚本：
    - 选择`child mesh (your model) → Add Component → Mesh Collider → Check the Convex option to simplify the collider`。
    - 将脚本附加`PreviewPivot`到您的主空游戏对象上。
    - 配置预览透视表：
        - 打开 SDK `Preview Pivot Editor`（窗口 > 项目预览）。
        - 将带有预览枢轴组件的空游戏对象拖到项目预览窗口的顶部入口处。
        - 拖动物体即可改变其旋转角度。
        - 一旦你对位置满意，就按下`Save current rotation to PreviewPivot`并按下`Render Icon`。

![枢](https://i.imgur.com/v4iVF5P.gif)

> **专业提示**：  
> - 使用一致的命名方案（例如`Item_Quest_[Name]`：）以避免混淆。-  
> 如果预览窗口未显示项目，请尝试调整窗口大小并检查对象原点是否居中。-  
> 您可以在项目预览窗口中调整对象和图标的大小  
> 。- 您可能需要关闭并重新打开预览窗口才能看到更改生效。

## 6. 构建资产包

该怎么办：

1. 创建预制件：
    - 将你的游戏对象拖入`Assets`文件夹中。
2. 分配标签：
    - 选择`prefab`→ `Inspector`→ `Asset Label`→ 添加预制件名称和捆绑包扩展名。
3. 构建软件包：
    - 打开`Window → Asset Bundle Browser`。
    - 打开`Build`标签页 → 点击`Build`。

![建造](https://i.imgur.com/AvkTqXk.gif)

> **重要提示**：  
> 请确保在构建过程完成后，Unity 完全响应后再进行操作，否则着色器可能无法在游戏中显示。  
> 如果 AssetBundle 标签条目无法输入文字，请点击该条目之外的位置再试一次，或者按住鼠标左键并输入文字。我知道，这很麻烦……

## 7. 在塔科夫进行测试

该怎么办：

1. 调试问题：
    - **紫色模型？**在 Unity 中重新分配纹理着色器。
    - **预览轴心偏离中心？**请在 Blender 中调整原点，或手动移动预览轴心组件中的坐标。
    - **物品掉到地底下了？**你可能忘记给模型添加网格碰撞器，或者把它放在了错误的GameObject上。

![建造](https://i.ibb.co/mr6bQVWm/Screenshot-2025-02-25-091314.png)

# 参见

[教程：如何使用 SDK 创建自定义武器](https://docs.google.com/document/d/1miWuhu9Jgr-P_HKsAaYMxiz3i4wbq7hn1FSDGEJzo1A/)  
[WTT Discord 服务器](https://discord.gg/Nz6VX78xRa)