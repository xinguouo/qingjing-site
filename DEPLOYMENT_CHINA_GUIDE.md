# Qingjing Site 国内访问部署指南

检查日期：2026-07-24  
项目路径：`D:\web\qingjing-site`

## 1. 当前项目部署状态检查

### Next.js 项目是否可部署

当前项目是标准 Next.js App Router 项目：

- Next.js：`16.2.9`
- React：`19.2.4`
- 包管理：npm，存在 `package-lock.json`
- 构建命令：`npm run build`
- 启动命令：`npm run start`
- 本地无 `vercel.json`，Vercel 可按 Next.js 零配置识别

本地检查结果：

- `npm run build` 已通过
- 构建成功生成 77 个路由
- `/studio/[[...tool]]` 已包含在构建结果中

结论：当前项目可以直接部署到 Vercel，也可以部署到支持 Node.js 的 Linux 云服务器。

### 当前 Vercel 项目是否适合绑定自定义域名

适合绑定自定义域名。Vercel 支持在 Project Settings 中为项目添加 apex domain、`www` 子域名或任意子域名。

但需要注意：

- 当前本地项目目录没有 `.vercel/project.json`，说明本地工作区没有与 Vercel 项目绑定。
- 你提到项目已经部署到 Vercel，因此域名绑定应在 Vercel Dashboard 中操作，而不是依赖本地 CLI。
- 自定义域名可以改善品牌展示和访问入口，但不能保证中国大陆网络稳定访问 Vercel Edge Network。

官方参考：

- Vercel 自定义域名设置：https://vercel.com/docs/domains/set-up-custom-domain
- Vercel DNS 管理：https://vercel.com/docs/domains/managing-dns-records

## 2. Vercel 自定义域名 DNS 记录

不要现在修改 DNS。以下只是操作说明。

### 方案 A：绑定 `preview.qingjingart.com`

用途：给甲方预览使用，推荐优先使用。

在 Vercel 项目中添加域名：

```text
preview.qingjingart.com
```

在当前 DNS 服务商处添加：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `preview` | `CNAME` | `cname.vercel-dns-0.com` |

说明：

- Vercel 官方文档给出的通用子域名 CNAME 目标是 `cname.vercel-dns-0.com`。
- 添加域名后，仍应以 Vercel Dashboard 中该域名的实际提示为准。
- SSL 证书通常会在 DNS 验证通过后自动签发。

### 方案 B：绑定 `www.qingjingart.com`

用途：正式官网入口，或临时正式预览入口。

在 Vercel 项目中添加域名：

```text
www.qingjingart.com
```

在当前 DNS 服务商处添加：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `www` | `CNAME` | `cname.vercel-dns-0.com` |

### 方案 C：绑定根域名 `qingjingart.com`

如果未来要让根域名直接访问官网，需要在 Vercel 项目中添加：

```text
qingjingart.com
```

在当前 DNS 服务商处添加：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `@` | `A` | `76.76.21.21` |

说明：

- `76.76.21.21` 是 Vercel 官方文档给出的 apex domain 通用 A 记录值。
- 如果 DNS 服务商支持 ALIAS / ANAME / CNAME flattening，也可以按 Vercel Dashboard 的具体建议操作。

## 3. 中国大陆访问风险

Vercel + 自定义域名并不等于大陆稳定访问。

主要风险：

- Vercel Edge Network 在中国大陆可能出现访问慢、间歇性无法打开、TLS 握手不稳定等问题。
- `*.vercel.app` 域名在部分网络环境下不稳定，自定义域名可改善入口形象，但底层仍走 Vercel。
- Sanity API 与 Sanity CDN 也在海外，图片和 CMS 数据在大陆访问可能有延迟。

因此：

- 甲方预览：可以先用 Vercel + `preview.qingjingart.com`。
- 正式上线且面向国内用户：建议使用香港云服务器，或备案后的中国大陆服务器。

## 4. 香港 Linux 云服务器可行性

当前项目支持部署到香港地区 Linux 云服务器。

推荐环境：

- Ubuntu 22.04 LTS 或 24.04 LTS
- Node.js 20.9 或更高版本
- npm
- PM2
- Nginx
- HTTPS 证书：Let's Encrypt / Certbot，或云厂商证书

当前项目不依赖 Vercel 专有运行时，也没有必须运行在 Edge 的代码。

### 服务器部署步骤

#### 1. 安装 Node.js

推荐使用 NodeSource：

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

#### 2. 上传代码

方式一：使用 GitHub 拉取：

```bash
git clone <your-github-repo-url> qingjing-site
cd qingjing-site
```

方式二：使用压缩包上传并解压。

#### 3. 配置环境变量

在服务器项目根目录创建 `.env.production` 或 `.env.local`：

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=你的 Sanity Project ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-29
```

不建议在服务器放置 `SANITY_API_WRITE_TOKEN`，除非服务器需要执行导入或写入 Sanity 的脚本。

#### 4. 安装依赖并构建

```bash
npm ci
npm run build
```

#### 5. 使用 PM2 启动

```bash
sudo npm install -g pm2
pm2 start npm --name qingjing-site -- start
pm2 save
pm2 startup
```

默认 Next.js 会监听 `3000` 端口。也可以指定端口：

```bash
PORT=3000 pm2 start npm --name qingjing-site -- start
```

#### 6. 配置 Nginx 反向代理

示例：

```nginx
server {
    listen 80;
    server_name preview.qingjingart.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/qingjing-site /etc/nginx/sites-enabled/qingjing-site
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. 配置 HTTPS

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d preview.qingjingart.com
```

正式域名可替换为：

```bash
sudo certbot --nginx -d www.qingjingart.com
```

## 5. Sanity 环境变量与新域名检查

当前项目读取这些 Sanity 环境变量：

```env
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
```

当前 `.env.local` 中还存在：

```env
SANITY_API_WRITE_TOKEN
```

该 token 不应公开，不应提交到 Git，也不建议放到 Vercel 或服务器，除非确实需要服务端写入 Sanity。

### Sanity 图片地址

当前项目通过 `@sanity/image-url` 生成图片 URL，图片 host 为：

```text
cdn.sanity.io
```

本地抽样检查结果：

- Sanity 图片 URL 可生成
- 图片请求返回 `200`
- `content-type` 为 `image/jpeg`

新域名上线后，图片仍会从 Sanity CDN 加载。大陆访问时可能受海外 CDN 影响，若正式上线后图片慢，可以后续考虑：

- 香港服务器反向代理图片
- 国内对象存储 + CDN 镜像图片
- Sanity 图片资产迁移或同步

本次不建议提前改图片链路。

### `/studio` 在新域名下的注意事项

项目内嵌 Sanity Studio 路径：

```text
/studio
```

如果新域名需要访问 Studio，需要在 Sanity 管理后台添加 CORS Origin。

建议添加：

```text
https://preview.qingjingart.com
https://www.qingjingart.com
```

如果使用 Vercel 预览域名，也添加对应：

```text
https://<your-vercel-preview-domain>.vercel.app
```

Sanity Studio 需要登录用户身份，官方建议对 Studio 所在可信域名开启 Allow credentials。

官方参考：

- Sanity CORS 文档：https://www.sanity.io/docs/content-lake/cors
- Sanity CORS CLI：https://www.sanity.io/docs/cli-reference/cors-in-cli

CLI 示例：

```bash
npx sanity cors add https://preview.qingjingart.com --credentials
npx sanity cors add https://www.qingjingart.com --credentials
```

注意：

- CORS Origin 必须包含 `https://`。
- 不要随意添加宽泛通配符。
- 不再使用的 preview 域名应及时移除。

## 6. 三种部署方案对比

| 方案 | 优点 | 风险 / 缺点 | 适合场景 |
| --- | --- | --- | --- |
| Vercel + 自定义域名 | 部署最快；自动 HTTPS；Git 推送自动部署；适合快速预览 | 中国大陆访问不稳定；Sanity 图片仍走海外；无法保证正式用户体验 | 甲方预览、设计验收、海外访问 |
| 香港云服务器 | 国内访问通常比 Vercel 稳定；无需ICP备案；可控 Nginx/缓存/反代；适合正式过渡 | 需要服务器运维；需要自己配置 HTTPS、PM2、日志和发布流程 | 面向大陆用户的正式上线首选过渡方案 |
| 中国大陆备案服务器 | 大陆访问最稳定；可接入国内 CDN；适合长期正式官网 | 需要ICP备案；周期较长；域名和主体资质要求更严格；部署流程更复杂 | 长期正式上线、品牌官网稳定运营 |

## 7. 建议

### 甲方预览

推荐：

```text
Vercel + preview.qingjingart.com
```

原因：

- 最快可用
- 不影响正式 `www.qingjingart.com`
- 方便甲方手机和电脑打开
- 如果部分大陆网络打不开，可以临时提供香港服务器预览地址作为备用

操作：

1. 在 Vercel Project Settings 添加 `preview.qingjingart.com`
2. 在 DNS 服务商添加 `preview CNAME cname.vercel-dns-0.com`
3. 在 Sanity CORS 添加 `https://preview.qingjingart.com`
4. 等待 Vercel 域名验证和 SSL 签发

### 正式上线

推荐分两阶段：

#### 第一阶段：香港云服务器正式上线

```text
www.qingjingart.com -> 香港云服务器
```

原因：

- 不需要 ICP 备案
- 大陆访问通常比 Vercel 更可控
- 可以用 Nginx 做缓存、压缩、反向代理
- 上线速度比大陆备案快

#### 第二阶段：中国大陆备案服务器 + 国内 CDN

如果后续网站访问量稳定、面向大陆用户较多，建议推进：

```text
ICP备案 + 大陆服务器 + 国内 CDN
```

这是长期最稳定方案。

## 8. 当前不建议做的事情

- 不建议直接把 `www.qingjingart.com` 长期指向 Vercel 作为正式国内官网。
- 不建议把 `SANITY_API_WRITE_TOKEN` 放到前端或公开环境。
- 不建议现在修改 Sanity 图片链路，除非正式测试证明图片访问明显慢。
- 不建议在没有备案前把中国大陆服务器作为正式域名解析目标。

## 9. 最终结论

甲方预览：

```text
GO：使用 Vercel + preview.qingjingart.com
```

正式上线：

```text
建议：优先香港云服务器；长期再考虑大陆备案服务器。
```

当前项目代码层面：

```text
GO：支持 Vercel 部署，也支持香港 Linux 云服务器部署。
```
