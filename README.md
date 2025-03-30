# 太阳系3D模拟系统

这是一个基于Three.js的交互式太阳系3D模拟系统，展示了太阳、八大行星及其卫星的运行轨迹。

## 功能特性

- 🌞 真实比例的太阳系模型
- 🪐 八大行星及其主要卫星
- 🖱️ 交互功能：
  - 点击太阳可放大显示，同时其他天体淡出
  - 再次点击恢复原状
  - 鼠标拖动可旋转视角
  - 滚轮缩放
- 🌌 动态星空背景
- 🏷️ 天体标签显示

## 技术栈

- [Three.js](https://threejs.org/) - 3D渲染引擎
- [GSAP](https://greensock.com/gsap/) - 动画库
- [CSS2DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer) - 标签渲染
- Flask - Python后端框架

## 安装与运行

1. 确保已安装Python 3.8+和Node.js 16+
2. 克隆本项目：
   ```bash
   git clone https://github.com/your-repo/solar-system.git
   ```
3. 安装Python依赖：
   ```bash
   pip install flask
   ```
4. 安装前端依赖：
   ```bash
   npm install
   ```
5. 启动Flask服务器：
   ```bash
   python app.py
   ```
6. 在浏览器中打开 http://localhost:5000

## 项目结构

```
solar-system/
├── static/                  # 静态资源
│   ├── main.js              # 主程序入口
│   ├── three.min.js         # Three.js库
│   ├── CSS2DRenderer.js     # 标签渲染器
│   ├── OrbitControls.js     # 轨道控制器
│   ├── style.css            # 样式表
│   └── textures/            # 行星纹理图片
│       ├── sun.jpg          # 太阳纹理
│       ├── earth.jpg        # 地球纹理
│       ├── jupiter.jpg      # 木星纹理
│       ├── Mars.jpg         # 火星纹理
│       ├── Neptune.jpg      # 海王星纹理
│       ├── Saturn.jpg       # 土星纹理
│       ├── Uranus.jpg       # 天王星纹理
│       └── Venus.jpg        # 金星纹理
├── templates/               # HTML模板
│   └── index.html           # 主页面
├── app.py                   # Flask后端
├── package.json             # 项目配置
├── package-lock.json        # 依赖锁定文件
└── README.md                # 本文件
```

## 使用说明

1. 使用鼠标拖动可旋转视角
2. 使用滚轮可缩放
3. 点击太阳可聚焦查看，再次点击恢复全景
4. 行星会自动沿轨道运行

## 开发指南

如需修改或扩展项目：

1. 修改`static/main.js`中的行星参数可调整：
   - 行星大小
   - 轨道半径
   - 运行速度
   - 材质属性

2. 添加新纹理：
   - 将图片放入`static/textures/`目录
   - 在代码中引用新纹理

3. 自定义动画效果：
   - 修改GSAP动画参数
   - 调整淡入淡出时间

## 许可证

MIT License
