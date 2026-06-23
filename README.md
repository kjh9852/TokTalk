# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```
maple-diary
├─ .eslintrc.cjs
├─ index.html
├─ jsconfig.json
├─ maple-diary.zip
├─ package-lock.json
├─ package.json
├─ public
│  ├─ board02.glb
│  ├─ boardbake.glb
│  ├─ pinkbin04.glb
│  ├─ signs.glb
│  ├─ texture
│  │  ├─ wood.JPG
│  │  ├─ yeti_arm.png
│  │  ├─ yeti_face.png
│  │  ├─ yeti_foot.png
│  │  └─ yeti_texture.png
│  ├─ yeti.glb
│  └─ yeti02.glb
├─ README.md
├─ server
├─ src
│  ├─ api
│  │  ├─ firebase
│  │  │  └─ firebase.js
│  │  └─ post
│  │     └─ post.js
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ fonts
│  │  │  ├─ NanumSquareOTF_acB.otf
│  │  │  ├─ NanumSquareOTF_acEB.otf
│  │  │  ├─ NanumSquareOTF_acL.otf
│  │  │  ├─ NanumSquareOTF_acR.otf
│  │  │  ├─ Pretendard-Black.otf
│  │  │  ├─ Pretendard-Bold.otf
│  │  │  ├─ Pretendard-ExtraBold.otf
│  │  │  ├─ Pretendard-ExtraLight.otf
│  │  │  ├─ Pretendard-Light.otf
│  │  │  ├─ Pretendard-Medium.otf
│  │  │  ├─ Pretendard-Regular.otf
│  │  │  ├─ Pretendard-SemiBold.otf
│  │  │  └─ Pretendard-Thin.otf
│  │  ├─ icons
│  │  │  ├─ close.png
│  │  │  ├─ infomation.png
│  │  │  ├─ menu.png
│  │  │  ├─ setting.png
│  │  │  └─ user.png
│  │  └─ images
│  │     ├─ grid.png
│  │     ├─ grid02.png
│  │     └─ wood.png
│  ├─ canvas
│  │  ├─ CanvasComponent.jsx
│  │  ├─ Ground.jsx
│  │  └─ PostGround.jsx
│  ├─ components
│  │  ├─ chat
│  │  │  ├─ chatcard
│  │  │  │  ├─ ChatCard.jsx
│  │  │  │  └─ ChatCard.module.css
│  │  │  ├─ chatinput
│  │  │  │  ├─ ChatInput.jsx
│  │  │  │  └─ ChatInput.module.css
│  │  │  └─ chattingview
│  │  │     ├─ ChattingView.jsx
│  │  │     └─ ChattingView.module.css
│  │  ├─ form
│  │  │  ├─ AdminForm.jsx
│  │  │  ├─ NickNameForm.jsx
│  │  │  ├─ NickNameForm.module.css
│  │  │  └─ PostForm.jsx
│  │  ├─ player
│  │  │  └─ Player.jsx
│  │  ├─ post
│  │  │  ├─ Post.jsx
│  │  │  ├─ postedit
│  │  │  │  ├─ Pagination.jsx
│  │  │  │  ├─ Pagination.module.css
│  │  │  │  ├─ PostEditList.jsx
│  │  │  │  └─ PostEditList.module.css
│  │  │  ├─ PostList.jsx
│  │  │  └─ Signpost.jsx
│  │  ├─ setting
│  │  │  ├─ Setting.jsx
│  │  │  └─ Setting.module.css
│  │  ├─ ui
│  │  │  ├─ button
│  │  │  │  ├─ Button.jsx
│  │  │  │  └─ Button.module.css
│  │  │  ├─ Input
│  │  │  │  ├─ Input.jsx
│  │  │  │  └─ Input.module.css
│  │  │  ├─ loading
│  │  │  │  ├─ LoadingScreen.jsx
│  │  │  │  ├─ LoadingScreen.module.css
│  │  │  │  └─ LoadingSpinner.tsx
│  │  │  ├─ menu
│  │  │  │  ├─ Menu.jsx
│  │  │  │  └─ Menu.module.css
│  │  │  ├─ modal
│  │  │  │  ├─ Modal.jsx
│  │  │  │  └─ Modal.module.css
│  │  │  ├─ textarea
│  │  │  │  ├─ TextArea.jsx
│  │  │  │  └─ TextArea.module.css
│  │  │  ├─ togglebutton
│  │  │  │  ├─ ToggleButton.jsx
│  │  │  │  └─ ToggleButton.module.css
│  │  │  └─ TriangleButton.jsx
│  │  └─ Yeti.jsx
│  ├─ hooks
│  │  ├─ usePersonControls.js
│  │  └─ usePointerLock.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ models
│  │  ├─ boardbake.glb
│  │  ├─ house.glb
│  │  ├─ ilbuni.glb
│  │  ├─ mushroom.glb
│  │  ├─ mushroom02.glb
│  │  ├─ mushroom03.glb
│  │  ├─ pinkbin.glb
│  │  ├─ pinkbin02.glb
│  │  ├─ pinkbin03.glb
│  │  ├─ pinkbin04.glb
│  │  ├─ pinkbinhouse.glb
│  │  ├─ yeti.glb
│  │  └─ yeti02.glb
│  ├─ page
│  │  ├─ Board.jsx
│  │  ├─ Main.jsx
│  │  └─ UserNamePage.jsx
│  ├─ store
│  │  ├─ AdminContext.jsx
│  │  ├─ LanguageContextProvider.jsx
│  │  ├─ ModalContextProvider.jsx
│  │  ├─ PostContext.jsx
│  │  └─ UserContextProvider.jsx
│  └─ translations
│     └─ translations.js
├─ vite.config.js
├─ yeti_arm.png
├─ yeti_face.png
├─ yeti_foot.png
└─ yeti_texture.png

```