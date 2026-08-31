# Gia Bảo Personal OS — Deploy lên GitHub Pages (PWA)

## Cấu trúc thư mục (giữ nguyên khi push lên repo)
```
├── index.html          ← app chính (trang gốc)
├── manifest.json        ← khai báo PWA (tên, icon, màu theme)
├── sw.js                 ← service worker (bắt buộc để "Add to Home Screen" / cài app)
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    ├── icon-maskable-512.png
    ├── apple-touch-icon.png
    └── favicon-32.png
```

## Các bước deploy

1. Tạo repo mới trên GitHub (public hoặc private đều được, nhưng GitHub Pages free chỉ publish public repo, trừ khi có GitHub Pro).
2. Push toàn bộ nội dung thư mục này vào **root của repo** (đừng để trong thư mục con, trừ khi bạn cấu hình lại đường dẫn).
   ```bash
   git init
   git add .
   git commit -m "Deploy GiaBao Personal OS PWA"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. Vào repo → **Settings → Pages** → Source chọn nhánh `main`, thư mục `/ (root)` → Save.
4. Đợi 1–2 phút, GitHub sẽ cho bạn link dạng:
   `https://<username>.github.io/<repo>/`

## Cài đặt thành app trên điện thoại/máy tính

- **Android (Chrome)**: mở link → sẽ có banner "Add to Home screen" hoặc vào menu ⋮ → "Install app". Vì đã có `sw.js`, Chrome sẽ cho cài app thật (icon riêng, mở full-screen không có thanh địa chỉ).
- **iOS (Safari)**: mở link → nút Share → "Add to Home Screen" (iOS Safari không dùng service worker để quyết định installability, nhưng vẫn cần các meta tag `apple-mobile-web-app-*` — đã có sẵn trong file).
- **Desktop (Chrome/Edge)**: mở link → icon "Install" (⊕) xuất hiện ở thanh địa chỉ.

Sau khi cài, app mở lên sẽ **không có thanh URL/trình duyệt** — đúng như bạn muốn (nhìn như app native nhưng bản chất vẫn chạy web/HTML/JS bên trong).

## Những gì mình đã chỉnh so với bản gốc

- Tách `manifest.json` ra file riêng (thay vì nhúng base64 trong `<head>`) — dễ sửa tên/icon sau này mà không phải sửa vào giữa file HTML khổng lồ.
- Thêm `sw.js` — cache app shell, cho phép mở lại nhanh và hoạt động cơ bản khi mất mạng. Không đụng vào logic nghiệp vụ của app.
- Đổi icon (favicon, apple-touch-icon, icon PWA 192/512, bản maskable) sang ảnh nhân vật bạn gửi — crop vuông theo giữa ảnh, bản maskable có padding 20% để không bị Android cắt mất mặt khi hiển thị icon tròn.
- Không đổi bất kỳ logic/tính năng nào trong phần thân ứng dụng — toàn bộ `<script>` giữ nguyên, đã kiểm tra cú pháp JS pass ở cả 7 script block.

## Lưu ý

- File `index.html` ~4.5MB (chủ yếu do dữ liệu/asset base64 cũ còn trong file gốc) — vẫn nằm trong giới hạn của GitHub Pages, không vấn đề gì.
- Nếu sau này bạn cập nhật `index.html`, tăng số version trong `sw.js` (`CACHE_NAME = "giabao-os-v1"` → `v2`) để buộc trình duyệt tải bản mới thay vì dùng cache cũ.
