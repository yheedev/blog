# 블로그 작성 가이드

## 📁 폴더 구조

블로그 포스트는 **언어별 폴더**에 작성합니다:

```
data/
  blog/
    ko/          # 한국어 포스트
    en/          # 영어 포스트
    ja/          # 일본어 포스트
    _templates/  # 템플릿 파일들 (빌드에서 제외됨)
```

## 🌐 다국어 URL 구조

각 언어별로 **자연스러운 slug**를 사용할 수 있습니다:

```
data/blog/ko/nextjs-사용후기.mdx     → https://yourdomain.com/ko/blog/nextjs-사용후기
data/blog/en/nextjs-review.mdx       → https://yourdomain.com/en/blog/nextjs-review
data/blog/ja/nextjs-レビュー.mdx     → https://yourdomain.com/ja/blog/nextjs-レビュー
```

**중요**: 언어는 폴더 구조에서 자동으로 추출되므로, frontmatter에 `lang` 필드를 **작성하지 않아도 됩니다**.

## ✨ VS Code 스니펫 사용법

새 `.mdx` 파일을 만들고 아래 키워드를 입력한 후 **Tab** 또는 **Enter**:

- `blog-ko` → 한국어 블로그 템플릿
- `blog-en` → 영어 블로그 템플릿
- `blog-ja` → 일본어 블로그 템플릿

자동으로 템플릿이 삽입되고, **Tab**으로 각 필드를 이동하며 작성할 수 있습니다!

## 📝 필수 Frontmatter 필드

```yaml
---
title: '글 제목' # ✅ 필수
date: '2024-01-01' # ✅ 필수
tags: ['tag1', 'tag2'] # 선택 (기본값: [])
stacks: ['JavaScript'] # 선택 (기술 스택)
topics: ['Projects'] # 선택 (주제)
draft: true # 선택 (true면 프로덕션에서 숨김)
summary: '글 요약' # 선택 (SEO에 중요)
toc: true # 선택 (목차 표시, 기본값: true)
---
```

### 사용 가능한 값

**stacks** (기술 스택):

- JavaScript, TypeScript, React, Next.js, Redux, Zustand, TanStack Query
- Tailwind, Styled-Components, Vercel, AWS

**topics** (주제):

- Projects, OpenSource, Lecture, Algorithm

## 🚀 새 글 작성하기

### 방법 1: VS Code에서 직접

1. `data/blog/ko/` 폴더에 새 파일 생성 (예: `my-new-post.mdx`)
2. 파일 안에서 `blog-ko` 입력 후 **Tab**
3. 템플릿이 자동 삽입됨!
4. **Tab**으로 이동하며 내용 작성

### 방법 2: 템플릿 복사

```bash
# 한국어 포스트
cp data/blog/_templates/ko-template.mdx data/blog/ko/내-새글.mdx

# 영어 포스트
cp data/blog/_templates/en-template.mdx data/blog/en/my-new-post.mdx

# 일본어 포스트
cp data/blog/_templates/ja-template.mdx data/blog/ja/私の新しい投稿.mdx
```

## 🔄 다국어 번역 작성

같은 글을 여러 언어로 작성하려면, **각 언어 폴더에 별도 파일**을 만듭니다:

```
data/blog/ko/nextjs-가이드.mdx      # 한국어 버전
data/blog/en/nextjs-guide.mdx       # 영어 버전 (다른 slug 가능)
data/blog/ja/nextjs-ガイド.mdx      # 일본어 버전
```

각 파일의 `title`, `summary`, 본문 내용을 해당 언어로 번역하면 됩니다!

## 📅 날짜 자동 추출

- `createdAt`: Git 히스토리에서 **첫 커밋 날짜**를 자동으로 가져옵니다
- `modifiedAt`: Git 히스토리에서 **마지막 커밋 날짜**를 자동으로 가져옵니다

따라서 frontmatter에서 `date`는 작성일을 의미하며, 실제 생성일/수정일은 Git에서 관리됩니다.

## 💡 팁

1. **파일명은 slug가 됩니다**: `my-post.mdx` → `/ko/blog/my-post`
2. **한글 파일명도 가능**: `내-포스트.mdx` → `/ko/blog/내-포스트`
3. **초안 작성**: `draft: true` 설정하면 개발 환경에서만 보입니다
4. **중첩 폴더**: `data/blog/ko/series/part1.mdx` → `/ko/blog/series/part1`

## 🎯 예시

### 한국어 포스트

파일: `data/blog/ko/리액트-훅-완벽가이드.mdx`

```mdx
---
title: '리액트 훅 완벽 가이드'
date: '2024-11-24'
tags: ['react', 'hooks', 'tutorial']
stacks: ['React', 'JavaScript']
topics: ['Lecture']
summary: 'React Hooks의 모든 것을 알아봅니다'
---

# 리액트 훅 완벽 가이드

React Hooks를 사용하면...
```

URL: `https://yourdomain.com/ko/blog/리액트-훅-완벽가이드`

### 영어 포스트 (같은 글의 번역)

파일: `data/blog/en/react-hooks-complete-guide.mdx`

```mdx
---
title: 'React Hooks Complete Guide'
date: '2024-11-24'
tags: ['react', 'hooks', 'tutorial']
stacks: ['React', 'JavaScript']
topics: ['Lecture']
summary: 'Learn everything about React Hooks'
---

# React Hooks Complete Guide

With React Hooks, you can...
```

URL: `https://yourdomain.com/en/blog/react-hooks-complete-guide`

---

Happy blogging! 🎉
