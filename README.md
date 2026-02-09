# ローカルひまわり

NICT（情報通信研究機構）が提供する気象・日射量データ可視化Webアプリケーション。ひまわり衛星画像、日射量（AMATERASS）、気温、湿度、風向風速、気象警報、AMeDASデータなどをMapbox GL JSベースの地図上にタイルオーバーレイ・マーカーとして表示する。

本番環境: https://sc-gis.nict.go.jp/localhimawari/

## アーキテクチャ

- ビルドツール・バンドラー不使用。静的HTML + jQuery + vanilla JS構成
- 親フレーム（`index.html`）と子フレーム（`map/index.html`）の2層iframe構造
- 親フレーム: タイムライン制御UI（k2goTimeline）、再生コントロール
- 子フレーム: Mapbox GL JSによる地図表示、タイルレイヤー管理、マーカー表示

## ローカル開発

### 起動方法

ビルドステップは不要。静的ファイルをWebサーバーから配信するだけで動作する。

例: VS Code の Live Server 拡張機能を使用する場合、`index.html` を右クリック → "Open with Live Server" で `http://127.0.0.1:5500` にて起動。

### API設定（API_BASE_URL）

タイルデータや気象データは `/api/...` エンドポイントから取得される。ローカル環境にはAPIバックエンドが存在しないため、`map/js/harps-env.js` 先頭の `API_BASE_URL` 定数でリクエスト先を制御する。

```javascript
// ローカル開発時（NICTサーバーを参照）
const API_BASE_URL = "https://sc-gis.nict.go.jp";

// 本番環境（相対パスで自サーバーを参照）
const API_BASE_URL = "";
```

本番環境に戻す場合は `API_BASE_URL` を `""` に変更するだけでよい。

### CORSに関する注意

ローカル（`127.0.0.1:5500`）から `sc-gis.nict.go.jp` へのクロスオリジンリクエストは、サーバー側の `Access-Control-Allow-Origin` 設定によりブロックされる場合がある。

CORSエラーが発生する場合は、ローカルプロキシサーバーの導入が必要になる。

#### プロキシの例（Node.js）

```bash
npx local-cors-proxy --proxyUrl https://sc-gis.nict.go.jp --port 8010
```

この場合、`API_BASE_URL` を `"http://localhost:8010"` に設定する。

## データソース

| キー | データ | APIパス |
|------|--------|---------|
| `amjp` | 日射量（AMATERASS） | `/api/amaterass_jp/`, `/api/amaterass_ao/` |
| `h8jp` | ひまわり衛星画像 | `/api/himawari-8_ao/` |
| `wni` | 高解像度降水ナウキャスト | `/api/weather_wni/` |
| `amjp_temp` | 気温 | `/api/temperture_jp/`, `/api/temperture_ao/` |
| `amjp_humidity` | 湿度 | `/api/humidity_jp/`, `/api/humidity_ao/` |
| `amjp_wnd` | 風向風速 | `/api/wind_jp/`, `/api/wind_ao/` |
| `wwarn` | 気象警報 | `/api/weather_warn/` |
| `amedas` | AMeDAS観測データ | `/api/amedas/` |
| `amjp_point` | AMATERASS地点データ | `/api/amjp_point/` |

ズームレベル < 5 の場合、`_jp`（日本）から `_ao`（アジア・オセアニア）の広域データに自動的に切り替わる。

## 外部依存

- [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs) v2.6.0 — 地図描画
- [国土地理院タイル](https://maps.gsi.go.jp/) — ベースマップ
- [jQuery](https://jquery.com/) — 親フレーム v3.6.0 / 子フレーム v3.5.1
- [k2goTimeline](https://github.com/nictvgis/k2go-timeline) — タイムラインUI
