# Anonymous Project Page

匿名投稿用的静态项目主页：纯 HTML / CSS / JS，没有构建步骤、没有外部依赖
（不含字体 CDN、不含统计代码），可以直接由 GitHub Pages 发布，也可以离线双击打开。

## 目录结构

```text
.
├── index.html          页面本体（标题、摘要、方法、结果、视频、表格、BibTeX）
├── style.css           样式（浅色/深色自适应、5 列对比、hover 放大、打印样式）
├── script.js           缺失素材占位、场景 tab、灯箱、复制 BibTeX、导航高亮
├── robots.txt          禁止搜索引擎收录
├── .nojekyll           让 GitHub Pages 跳过 Jekyll 处理
└── assets/
    ├── img/            对比图、方法图（见 assets/img/README.md）
    └── videos/         演示视频（见 assets/videos/README.md）
```

## 本地预览

直接双击 `index.html` 就行。需要本地服务器时：

```bash
python3 -m http.server 8000
# 然后打开 http://localhost:8000
```

## 需要替换的内容

页面里所有待填内容都用占位样式标了出来，替换后删掉对应 class 即可：

| 占位标记 | 含义 | 处理方式 |
| --- | --- | --- |
| `class="todo"` | 行内占位文字（琥珀色虚线） | 换成真实文字，删掉 class |
| `class="todo-block"` | 整段占位（左侧琥珀色竖线） | 同上 |
| `<a class="btn is-todo" href="#">` | 链接占位（PDF / Code / Video / Poster） | 换成真实链接，删掉 `is-todo` |
| `<figure class="frame" data-file="...">` | 图片路径 | 把图片放到 `assets/img/...` 对应路径 |

素材没放好不会出现裂图：`script.js` 会把缺失的图片、视频换成写了目标路径的虚线占位框。

## 增加一个场景

1. 在 `.tabs__bar` 里复制一个 `<button class="tab" role="tab" ...>`，改 `id` 与 `aria-controls`。
2. 复制一份 `<div class="tab-panel" id="panel-xxx" role="tabpanel" aria-labelledby="tab-xxx">`。
3. 把里面 5 个 `data-file` / `src` 换成新场景的图片路径。

不需要改 JS，脚本会自动接上新的按钮和面板。

## 发布到 GitHub Pages

```text
仓库 → Settings → Pages → Build and deployment
Source: Deploy from a branch
Branch: main
Folder: / (root)
→ Save
```

发布地址是 `https://<用户名>.github.io/<仓库名>/`，通常一两分钟后生效。
推送更新后 Pages 会自动重新构建；浏览器缓存顽固时用 `Cmd+Shift+R` 强制刷新。

## 匿名检查清单

- 页面正文、页脚、图片、视频、BibTeX 中不出现作者姓名、单位、邮箱、致谢、基金号、个人主页或社交账号。
- 仓库描述、README、提交信息里不出现身份信息。
- 提交前确认本地 Git 身份不会被写进提交记录：

  ```bash
  git config --local user.name "Anonymous"
  git config --local user.email "anonymous@example.com"
  ```

- 不要提交带本机路径的截图、录屏或 `.blend` / `.psd` 工程文件（`.gitignore` 已挡掉一部分）。
- 图片可能带 EXIF（作者、相机、GPS），入库前清理：

  ```bash
  exiftool -all= assets/img/*.jpg
  ```

- Pages 地址本身包含 GitHub 用户名。如果这个页面要写进双盲论文，建议用单独的匿名账号发布，
  或者只通过匿名代理分享链接。
