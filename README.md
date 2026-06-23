# E-Plantation Mobile (eplant)

Aplikasi mobile **E-Plantation** untuk manajemen perkebunan kelapa sawit, dibangun dengan [React Native](https://reactnative.dev) v0.82.1.

---

## Tech Stack

- **React Native** 0.82.1 + **TypeScript**
- **Redux** + **Redux Observable** (RxJS) + **Redux Persist**
- **React Navigation** v7
- **WatermelonDB** — local database
- **Firebase** (Analytics, Crashlytics, Messaging)
- **React Native Vision Camera** — kamera
- **React Native Maps** — peta
- **CI/CD**: Codemagic

---

## Fitur Utama

### 🌾 Harvest (Panen)

| Fitur | Keterangan |
|-------|------------|
| BPBKS (Bukti Pemeriksaan Buah Kelapa Sawit) | ✅ Full Offline + Auto Sync |
| SPB Local (Surat Pengantar Buah Lokal) | ✅ Full Offline + Auto Sync |
| Monitoring TPH | ✅ Read-only (cached) |
| BKM (Buku Kas Mandor) Harvest | List, detail, form |
| PMA (Pemantauan Mandor Afdeling) | List, detail, form, preview |
| Tonnage Garden | List, detail, form, upload file |
| Tonnage PKS | List, detail, form |
| QR Scanner | Scan QR BPBKS |
| Camera Photo | Pengambilan foto lapangan |

### 🌿 Take Care (Perawatan)

| Fitur | Keterangan |
|-------|------------|
| BKM Take Care | List, detail, form |
| Realisasi Pemupukan | List, detail, form |

### 📋 Plan (Perencanaan)

| Fitur | Keterangan |
|-------|------------|
| RKH (Rencana Kerja Harian) Harvest | List, detail, form |
| RKH Take Care | List, detail, form |
| AKP (Anggaran Kerja Perkebunan) | List, detail, form |
| Perpajakan (Taxation) | List, detail, form |
| Sensus (Census) | List, detail, form |

### 📊 Report (Laporan)

| Fitur | Keterangan |
|-------|------------|
| BPBKS Report | View laporan |
| BMP (Biaya Mandor Panen) | View laporan |
| BJR (Berat Janjang Rata-rata) | View laporan |
| RRP | View laporan |
| AKP | View laporan |
| AKP Plan / Realization | View laporan |
| RKB Harvest / Take Care | View laporan |
| Tonnage Garden / PKS | View laporan |
| PMA | View laporan |
| BPK | View laporan |
| Cropbook | View laporan |
| Yield Report | View laporan |
| Chapel | View laporan |
| Employee Wage & Wage Cut | View laporan |

### 📦 Request

| Fitur | Keterangan |
|-------|------------|
| My Request | List, detail, form (material, cash, tool, transportation) |
| List Request | List, detail |
| Warehouse Management | List, detail, BPU |

### 🗂️ Master Data

| Fitur | Keterangan |
|-------|------------|
| Organisasi | List, detail, form |
| Divisi | List, detail, form |
| Blok | List, detail, form |
| TPH | List, form |
| Item / Master Item / Category Item | List, detail, form |
| Raw Material | List, detail, form |
| Daily Activity | List, detail, form |
| Maintenance | List, detail, form |
| Tools & Equipment | List |
| Item Transportation Detail | Detail |
| Reception / Purchasement History | Form |

### 📝 Field Report & Attendance

| Fitur | Keterangan |
|-------|------------|
| Field Report | List, detail, form |
| Attendance | List, detail, form (employee & file) |

### 👤 Lainnya

| Fitur | Keterangan |
|-------|------------|
| Dashboard | Produksi & organisasi |
| Approval | List approval |
| Notifikasi | Push notification (Firebase) |
| Profile | Lihat & ubah profil |
| Change Password / Add Email | Pengaturan akun |
| Working Area | Area kerja |

---

## Getting Started

### Prasyarat

- Node.js >= 20
- React Native environment setup: [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)

### Install Dependencies

```sh
yarn install
```

### iOS

```sh
bundle install
bundle exec pod install
```

---

## Menjalankan App

### Start Metro

```sh
yarn start
```

### Android

```sh
yarn android
```

### iOS

```sh
yarn ios
```

---

## Scripts

| Script | Deskripsi |
|--------|-----------|
| `yarn start` | Jalankan Metro bundler |
| `yarn android` | Build & run Android (debug) |
| `yarn ios` | Build & run iOS (debug) |
| `yarn test` | Jalankan unit tests (Jest) |
| `yarn lint` | ESLint |
| `yarn buildAPK` | Build APK release Android |
| `yarn bundle` | Build AAB release Android |

---

## Struktur Project

```
src/
├── domain/
│   ├── services/       # API service layer
│   └── states/         # Redux state (actions, reducer, streams/epics)
├── model/              # WatermelonDB models
├── presentations/
│   ├── screens/        # Halaman/screen
│   ├── _shared-components/
│   ├── hooks/
│   └── navigation/
assets/
├── fonts/
├── icons/
└── images/
__config__/             # Konfigurasi environment (dev/staging/prod)
```

---

## Environment Config

Konfigurasi per environment ada di `__config__/`:
- `ci-config-dev.json`
- `ci-config-staging.json`
- `ci-config-prod.json`

---

## Offline Mode

App mendukung offline mode menggunakan:
- **Redux Persist** + **AsyncStorage** untuk state persistence
- **NetInfo** untuk deteksi koneksi
- **Temporary storage** untuk data yang dibuat saat offline
- **Auto-sync** saat koneksi kembali (sequential dengan `concatMap`)



---

## Testing

```sh
yarn test
```

Test setup ada di `__tests__/` dan mock di `__mocks__/`.
