---
description: UniApp development guidelines for cross-platform mobile/mini-program applications. Apply when developing with UniApp framework.
globs: "**/*.vue, **/pages/**/*.vue, **/components/**/*.vue, manifest.json, pages.json"
---

# UniApp Development Guidelines

## Overview

UniApp is a cross-platform framework that allows you to develop once and deploy to:
- **H5** (Web)
- **WeChat/Alipay/Baidu Mini Programs**
- **iOS/Android Apps**

## Project Structure

```
├── pages/                 # Page components
│   └── index/
│       └── index.vue
├── components/            # Reusable components
├── static/               # Static assets (images, fonts)
├── store/                # Vuex/Pinia store
├── utils/                # Utility functions
├── api/                  # API request modules
├── uni_modules/          # UniApp plugins
├── App.vue               # App entry component
├── main.js               # Entry file
├── manifest.json         # App configuration
├── pages.json            # Page routing configuration
└── uni.scss              # Global SCSS variables
```

## Vue 3 Composition API (UniApp 3.x)

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

onMounted(() => {
  console.log('Page mounted')
})

// UniApp lifecycle hooks
onLoad((options) => {
  console.log('Page loaded with options:', options)
})

onShow(() => {
  console.log('Page shown')
})
</script>
```

## Responsive Design (rpx)

```scss
// Use rpx for responsive units (750rpx = screen width)
.container {
  width: 750rpx;      // Full width
  padding: 30rpx;     // ~15px on 375px screen
  font-size: 28rpx;   // ~14px on 375px screen
}
```

## Platform-Specific Code

```vue
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <button open-type="getUserInfo">微信登录</button>
    <!-- #endif -->
    
    <!-- #ifdef H5 -->
    <button @click="h5Login">H5登录</button>
    <!-- #endif -->
    
    <!-- #ifdef APP-PLUS -->
    <button @click="appLogin">App登录</button>
    <!-- #endif -->
  </view>
</template>
```

## Navigation

```javascript
uni.navigateTo({ url: '/pages/detail/detail?id=123' })
uni.redirectTo({ url: '/pages/login/login' })
uni.switchTab({ url: '/pages/index/index' })
uni.navigateBack({ delta: 1 })
```

## Common UI Patterns

```javascript
uni.showLoading({ title: '加载中...' })
uni.hideLoading()

uni.showToast({ title: '操作成功', icon: 'success' })

uni.showModal({
  title: '提示',
  content: '确定要删除吗？',
  success: (res) => {
    if (res.confirm) { /* confirmed */ }
  }
})
```

## Best Practices

1. **Use rpx** for responsive sizing (750rpx = full screen width)
2. **Use conditional compilation** (`#ifdef`) for platform-specific code
3. **Check component support** in UniApp docs before using
4. **Handle API errors** with proper user feedback
5. **Use uni-ui** components for cross-platform compatibility
6. **Test on multiple platforms** (WeChat DevTools, H5, App simulator)
7. **Avoid direct DOM manipulation** - use data binding
8. **Use pages.json** for page configuration
