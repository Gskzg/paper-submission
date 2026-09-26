# assets/videos

把演示视频放在这里，文件名与 `index.html` 中的 `src` 保持一致：

```text
videos/bathroom-ours.mp4
videos/kitchen-ours.mp4
```

文件不存在时，页面会自动显示一个写了路径的虚线占位框，不会出现播放器裂图。

## 建议

- 用 H.264 + AAC 的 `.mp4`，兼容性最好（Safari / Chrome / Firefox 都能直接播）。
- 单个视频控制在 10 MB 以内，GitHub Pages 对仓库体积和流量都比较敏感。
- 视频体积大时可以压到 720p、CRF 26 左右；封面帧（poster）暂时没有使用。
- 不要放进含作者信息的水印、录屏界面或本机路径。
