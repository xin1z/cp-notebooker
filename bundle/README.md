# cp-notebooker bundle

npm 可发布的 DSH skill bundle，结构镜像官方 `@deepseek-ai/dsh-experimental-badge-skill-bundle`（`dsh-skill-badge` 插件 + bundle 元数据包）。

## 结构

```
bundle/
├── scripts/sync-skill.mjs          # 把 ../cp-notebooker/SKILL.md 的正文同步进插件资产
├── cp-notebooker-skill/            # 插件：注册 bundled skill provider
│   ├── package.json
│   ├── tsconfig.json
│   ├── assets/cp-notebooker.md     # skill 正文（无 frontmatter，由 sync 脚本生成）
│   └── src/index.ts
└── cp-notebooker-bundle/           # bundle：可安装的元数据包
    ├── package.json               # dsh.bundle.patch → cordis.patch.yml
    └── cordis.patch.yml
```

## 发布

先发插件包，再发 bundle（bundle 依赖插件包）。以下版本号必须一致：

- `../cp-notebooker/SKILL.md` 的 `metadata.version`
- `bundle/cp-notebooker-skill/package.json` 的 `version`
- `bundle/cp-notebooker-bundle/package.json` 的 `version`，以及它对 `@xin1z/cp-notebooker-skill` 的 dependency

发新版本时先统一改这三处，例如 0.1.1：

```bash
(cd bundle/cp-notebooker-skill && npm version 0.1.1 --no-git-tag-version)
(cd bundle/cp-notebooker-bundle && npm version 0.1.1 --no-git-tag-version)
# 再把 bundle 的 dependency 和 SKILL.md 的 metadata.version 改成 0.1.1
```

```bash
# 1. 同步 skill 正文（每次改动 ../cp-notebooker/SKILL.md 后都要跑）
node bundle/scripts/sync-skill.mjs

# 2. 检查并发布插件
cd bundle/cp-notebooker-skill
npm ci
npm run build
npm pack --dry-run        # 确认 lib/、assets/ 都在包里；prepack 也会自动构建
npm publish --access public

# 3. 发布 bundle（插件包已发布后）
cd ../cp-notebooker-bundle
# 可选：确认 dependency 指向的插件版本能装上
npm install
npm pack --dry-run
npm publish --access public
```

> 注意：`npm publish` 会触发插件的 `prepack`，所以 `npm run build` 不是必须的；显式跑一次能在发布前先暴露编译错误。bundle 的 `npm install` 只用于确认依赖可安装，`npm publish` 本身不依赖 `node_modules`。
> `@deepseek-ai/*` scope 从官方 registry 安装即可（公开包）；发布你自己的 `@xin1z/*` 包需要先 `npm login`。

## 安装（用户侧）

```bash
dsh plugin --profile web add @xin1z/cp-notebooker-bundle@0.1.1
# 或 GUI：插件管理器 → install bundle → 填入 @xin1z/cp-notebooker-bundle@0.1.1
```

## 保持同步

插件里的 `DESCRIPTION` 常量必须与 `../cp-notebooker/SKILL.md` frontmatter 的 `description` 一致；skill 正文由 `scripts/sync-skill.mjs` 从 canonical SKILL.md 生成。CI 会运行 `sync-skill.mjs` 并检查 asset 是否有 diff，所以改完 SKILL.md 记得重新跑。
