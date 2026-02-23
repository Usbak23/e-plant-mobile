# ScreenWrapper Component

Component wrapper untuk mengatasi masalah konten yang nabrak status bar/notch di HP.

## Problem
Beberapa halaman kontennya nabrak ke atas dan tertutup oleh bar informasi HP (status bar/notch).

## Solution
Gunakan `ScreenWrapper` component yang otomatis handle SafeAreaView.

## Usage

### Basic Usage
```tsx
import {ScreenWrapper} from '@components'

const MyScreen = () => {
  return (
    <ScreenWrapper>
      {/* Your content here */}
    </ScreenWrapper>
  )
}
```

### With Custom Background
```tsx
<ScreenWrapper backgroundColor="#F0B10D">
  {/* Your content */}
</ScreenWrapper>
```

### Disable SafeArea (jika tidak perlu)
```tsx
<ScreenWrapper useSafeArea={false}>
  {/* Your content */}
</ScreenWrapper>
```

### With Custom Style
```tsx
<ScreenWrapper style={{paddingHorizontal: 16}}>
  {/* Your content */}
</ScreenWrapper>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Konten screen |
| useSafeArea | boolean | true | Gunakan SafeAreaView atau tidak |
| backgroundColor | string | theme.colors.background | Warna background |
| style | StyleProp<ViewStyle> | undefined | Custom style tambahan |

## Migration Guide

### Before
```tsx
const MyScreen = () => {
  return (
    <View style={{flex: 1}}>
      <Header title="My Screen" />
      {/* content */}
    </View>
  )
}
```

### After
```tsx
import {ScreenWrapper} from '@components'

const MyScreen = () => {
  return (
    <ScreenWrapper>
      <Header title="My Screen" />
      {/* content */}
    </ScreenWrapper>
  )
}
```

## Notes
- Sudah include `flex: 1` secara default
- Menggunakan `react-native-safe-area-context` untuk cross-platform support
- Otomatis handle notch di iPhone X dan Android dengan notch
