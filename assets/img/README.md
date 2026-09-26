# assets/img

把真实图片放进这个文件夹，页面就会自动显示；文件不存在时页面会显示一个写了文件名的虚线占位框（不会出现裂图）。

## 已存在的占位图

| 文件 | 用在哪里 |
| --- | --- |
| `teaser.svg` | 首屏 teaser（5 列对比示意） |
| `pipeline.svg` | Method 概述图 |

替换方式：直接覆盖同名文件，或者把新图（例如 `teaser.jpg`）放进来后，改 `index.html` 里对应的 `src`。

## 期望的文件名

场景对比（`scenes/` 子文件夹），每个场景 5 张：

```text
scenes/bathroom-ref.jpg
scenes/bathroom-blender-builder.jpg
scenes/bathroom-code2worlds.jpg
scenes/bathroom-viga.jpg
scenes/bathroom-ours.jpg
```

其余场景把 `bathroom` 换成 `kitchen` / `living-room` / `laboratory` / `factory` 即可。

局部细节（`details/` 子文件夹）：

```text
details/detail-1-full.jpg     整图（红框标出区域）
details/detail-1-crop.jpg     放大后的局部
details/detail-2-full.jpg
details/detail-2-crop.jpg
```

失败案例（`failures/` 子文件夹）：

```text
failures/failure-1.jpg
failures/failure-2.jpg
```

## 建议

- 同一行对比图请裁成相同长宽比（推荐 4:3），视觉上才对得齐。
- 图片宽度 1200–1600 px 足够，单张控制在 500 KB 以内，页面加载更快。
- 文件名用小写英文和连字符，避免中文、空格和括号，否则 GitHub Pages 上容易 404。
