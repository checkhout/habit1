# 搭建内部字符串管理系统
## start
- You are running `create-react-app` 4.0.1, which is behind the latest release (4.0.2).
    - 方式1：执行提示的命令，卸载脚手架并重装
    - 方式2：在任何没有执行 ejected 的CRA创建的项目中, 运行：npm install --save --save-exact react-scripts@4.0.2 完成迁移
    
- 我选择的是方式1，因为我不是需要迁移。
    1. 卸载CRA，卸载了 4.0.1 ， 运行 create-react-app -V 结果 4.0.0，找到 npm 的全局包安装位置，手动删除全部 CRA 相关的文件
    2. npx create-react-app str-mgr --template redux 完成项目初始化（在全局未找到 CRA 的包，这就很奇怪了，好像是自动移除了）
    

    
    
    
