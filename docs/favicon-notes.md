# Gültekin Peyzaj favicon — 7 Kasım 2026

Mevcut işletme logosundaki yapraklı G biçiminden türetilen sade amblem. Küçük sekme boyutunda okunmayan marka yazısı, ev ve peyzaj detayları kullanılmadı. Ana işletme logosu değişmedi.

- Yerleşik imagegen aracı kullanıldı; kaynak logo `public/images/logo.webp`.
- Seçilen kaynak çalışma klasöründe `work/assets/favicon-source.png` olarak saklanır.
- `npm run optimize:favicon`, Sharp ile 16/32/48 piksel içeren `src/app/favicon.ico`, 192 piksel `src/app/icon.png` ve 180 piksel `src/app/apple-icon.png` üretir.
- Next.js dosya tabanlı metadata bu ikonları bütün sayfalara ekler.

## Son düzenleme istemi

```text
Use case: precise-object-edit. Edit target: supplied G-leaf favicon. Keep exactly the green G and the two leaf silhouettes, their placement, and proportions. Correct the background: replace all gray cloudy shading, noise, shadows, texture, alpha holes and corner artifacts with ONE completely uniform opaque ivory color #f4f6ef that fills the entire square canvas, edge-to-edge. No rounded tile, no transparency, no gradients, no shadows, no mottling anywhere. Make the G a single solid flat dark green #064c24 and leaves a solid green #65a900, no texture or shading inside shapes. This is a flat 2D browser favicon, not a physical tile. Keep margins ~7%, sharply drawn antialiased edges. No words, no mockup, square canvas.
```
