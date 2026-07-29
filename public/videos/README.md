# Local Video Storage Directory

Place your course MP4 video files into this directory following the structured discipline folders below.

## Folder Structure

```
public/videos/
├── web-development/
│   └── react-19/
│       ├── lesson-1.mp4
│       ├── lesson-2.mp4
│       └── lesson-3.mp4
│
├── programming/
│   └── competitive-programming/
│       ├── lesson-1.mp4
│       ├── lesson-2.mp4
│       └── lesson-3.mp4
│
├── ai-ml/
│   └── generative-ai/
│       ├── lesson-1.mp4
│       ├── lesson-2.mp4
│       └── lesson-3.mp4
│
├── data-science/
│   └── advanced-sql/
│       ├── lesson-1.mp4
│       ├── lesson-2.mp4
│       └── lesson-3.mp4
│
├── devops/
│   └── kubernetes/
│       ├── lesson-1.mp4
│       ├── lesson-2.mp4
│       └── lesson-3.mp4
│
├── cyber/
│   └── security-pentesting/
│       ├── lesson-1.mp4
│       ├── lesson-2.mp4
│       └── lesson-3.mp4
│
├── mobile/
│   └── flutter-3/
│       └── lesson-1.mp4
│
└── ui-ux/
    └── figma-mastery/
        └── lesson-1.mp4
```

## How it works in Vite

In Vite, files inside `public/` are served at the root URL `/`.
For example, a video stored at:
`public/videos/web-development/react-19/lesson-1.mp4`

is referenced in TypeScript / React as:
`'/videos/web-development/react-19/lesson-1.mp4'`
