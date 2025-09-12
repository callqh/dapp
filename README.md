# My First DApp

一个基于 Next.js、RainbowKit 和 Wagmi 构建的去中心化应用程序 (DApp)，用于学习 Web3 钱包连接和区块链交互。

## 📋 项目概述

这是一个现代化的 Web3 DApp，集成了以下功能：
- 🔗 钱包连接 (使用 RainbowKit)
- 💰 账户余额查询
- 📊 交易历史记录
- 🌐 多链支持 (Ethereum, Polygon, Optimism, Arbitrum, Base, MegETH)
- 🎨 现代化 UI (使用 Tailwind CSS 和 shadcn/ui)

## 🛠️ 技术栈

- **前端框架**: Next.js 15.5.2 (App Router)
- **React**: 19.1.0
- **钱包连接**: RainbowKit 2.2.8
- **Web3 库**: Wagmi 2.16.9, Viem 2.37.3
- **状态管理**: TanStack Query 5.86.0
- **UI 组件**: Radix UI, shadcn/ui
- **样式**: Tailwind CSS 4.0
- **代码规范**: Biome 2.2.3
- **TypeScript**: 5.x

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd my-first-dapp
```

### 2. 安装依赖

```bash
pnpm install
# 或者
npm install
# 或者
yarn install
```

### 3. 配置环境

在 `src/config/wagmi.ts` 中配置您的 WalletConnect Project ID：

```typescript
export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID', // 替换为您的 Project ID
  chains: [mainnet, polygon, optimism, arbitrum, base, megaethTestnet],
  ssr: true,
});
```

### 4. 启动开发服务器

```bash
pnpm dev
# 或者
npm run dev
# 或者
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用程序。

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (rainbowkit)/      # RainbowKit 示例页面
│   ├── wagmi/             # Wagmi 示例页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── providers.tsx      # React Context 提供者
├── components/            # React 组件
│   ├── ui/                # UI 基础组件 (shadcn/ui)
│   ├── Header.tsx         # 头部组件
│   ├── Loading.tsx        # 加载组件
│   ├── WagmiCore.tsx      # Wagmi 核心功能示例
│   └── WagmiHooks.tsx     # Wagmi Hooks 示例
├── config/
│   └── wagmi.ts           # Wagmi 配置
└── lib/
    └── utils.ts           # 工具函数
```

## 💡 主要功能

### 1. 钱包连接

- 支持多种钱包 (MetaMask, WalletConnect, Coinbase Wallet 等)
- 美观的连接界面
- 实时显示连接状态

### 2. 账户管理

- 显示当前连接的账户地址
- 显示当前网络 Chain ID
- 查询账户余额

### 3. 交易功能

- 添加最近交易记录
- 交易哈希管理
- 交易历史展示

### 4. 多链支持

支持的网络：
- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Base
- MegETH Testnet
- Sepolia Testnet

## 🔧 可用脚本

```bash
# 开发模式 (使用 Turbopack)
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查和格式化
pnpm lint
```

## 📖 使用指南

### RainbowKit 页面 (`/rainbowkit`)

1. 点击 "Connect Wallet" 连接您的钱包
2. 选择您偏好的钱包类型
3. 授权连接后即可看到账户信息
4. 输入交易哈希添加到最近交易记录

### Wagmi 页面 (`/wagmi`)

1. 使用 Wagmi hooks 进行钱包连接
2. 查看账户余额
3. 执行区块链交互操作

## 🎨 UI 主题

项目使用自定义的 RainbowKit 主题配置：

- 基础主题：浅色主题
- 强调色：粉色调
- 模糊效果：小幅模糊
- 显示最近交易：开启

## 🔒 安全注意事项

1. **私钥安全**: 永远不要在代码中硬编码私钥
2. **Project ID**: 确保使用您自己的 WalletConnect Project ID
3. **环境变量**: 敏感信息应存储在环境变量中
4. **网络验证**: 在生产环境中验证网络和合约地址

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [RainbowKit 文档](https://rainbowkit.com/docs/introduction)
- [Wagmi 文档](https://wagmi.sh/)
- [Viem 文档](https://viem.sh/)
- [Web3 开发指南](https://ethereum.org/en/developers/)

## 🚀 部署

### Vercel (推荐)

1. 连接您的 GitHub 仓库到 Vercel
2. 配置环境变量
3. 部署！

### 其他平台

- Netlify
- Railway
- Heroku

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请：

- 创建 [Issue](https://github.com/your-username/my-first-dapp/issues)
- 发送邮件到：your-email@example.com
- 关注项目获取最新更新

---

**开始您的 Web3 之旅！** 🚀
