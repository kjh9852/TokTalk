# Tok Talk

React + Firebase + Socket.io 기반의 3D 커뮤니티 플랫폼

프로젝트 링크: tok-talk.vercel.app

## 1. OverView

3D 가상 공간에서 유저 간 소통과 게시글 공유가 가능한 React 기반 커뮤니티 서비스 입니다. 유저는 3D 캐릭터를 조작하고, 실시간 소통과 게시판 기능을 사용할 수 있습니다.

## 2. Tech Stack

### FrontEnd

- React
- Vite

### State Management

- Tanstack Query
- Zustand

### BackEnd / DataBase

- FireStore

### Real-time

- Socket.io

### 3D

- THREE.js
- React THREE Fiber
- React THREE Rapier

## 3. Features

### 3D World

- WASD 이동
- Pointer Lock 기반 카메라 조작
- 다른 사용자 실시간 위치 동기화

### Real-time Chat

- Socket.io 실시간 채팅
- 사용자 접속 상태 관리

### Community

- 게시글 CRUD
- 실시간 게시글 업데이트
- 페이지네이션

## 4. Architecture

### Frontend

```txt
React
  │
TanStack Query
  │
Firestore
```

### 3D Environment

```txt
React
  │
React Three Fiber
  │
Three.js
  │
3D Object Interaction
```

## 5. 주요 구현 내용

### 새 게시글 감지 로직

사용자가 게시판의 첫 페이지가 아닌 상태에서는 새 게시글 생성 여부를 확인하기 어렵다는 문제가 있었습니다.

전체 게시글 목록을 실시간 구독하는 대신 최신 게시글만 감시하여 불필요한 데이터 수신을 최소화하였고, 새로운 게시글이 감지되면 3D 게시판 오브젝트 상단에 알림 텍스트를 표시하도록 구현하였습니다.

이를 통해 실시간성을 유지하면서도 불필요한 리소스 사용을 줄일 수 있었습니다.

### 실시간 플레이어 위치 동기화

Socket 통신을 활용하여 플레이어 위치와 회전 정보를 동기화하였습니다.

다른 플레이어의 이동 데이터는 Lerp을 적용하여 네트워크 지연으로 인한 순간이동 현상을 최소화하고 부드러운 이동을 구현하였습니다.

### 실시간 채팅 구현

Socket 기반 실시간 채팅을 구현하였습니다.

채팅 메세지는 모든 접속자에게 즉시 보여지고,
플레이어 닉네임과 함께 표시되도록 구성하였습니다.

또한 말풍선을 적용하여 채팅을 입력 중일 경우와
입력 됐을시 플레이어의 머리위에 UI가 표시되도록 구성하였습니다.

### 플레이어 넉백 시스템

플레이어 간 상호작용 시 넉백효과를 적용하였습니다.

넉백 발생 시 물리 엔진의 속도 벡터를 변경하여
플레이어가 밀려나는 효과를 구현하였으며,
다른 플레이어에게도 동일한 결과가 동기화 되도록 처리하였습니다.

### 관리자 모드

특정 인증 코드를 입력한 사용자에게
관리자 권한을 부여하는 기능을 구현하였습니다.

관리자 권한은 Socket 서버를 통해 검증되며,
권한에 따라 추가 기능을 사용할 수 있도록 구성하였습니다.

### Infinite Query 기반 게시판 (관리자 적용)

게시글 관리 목록은 useInfiniteQuery를 활용하여 관리하였습니다.

스크롤 위치에 따라 다음 데이터를 요청하고,
기존 데이터를 캐싱하여 사용자 경험을 개선하였습니다.

## 6. Trouble Shooting

### Pointer Lock 상태와 Modal 충돌 해결

### 문제

3D 환경에서는 Pointer Lock 상태를 유지하여 플레이어를 조작하지만, 게시글 작성 오브젝트 클릭 시 모달이 열리면서 Pointer Lock 상태가 계속 유지 되어 마우스 포인터가 나타나지 않는 문제가 있었습니다.

### 원인

PointerLockControls는 Canvas 내부의 사용자 입력을 기반으로 동작하며,
외부 UI인 Modal 상태와 Pointer Lock 상태를 별도로 관리하고 있었습니다.

이로 인해 모달이 열린 상태에서도 Pointer Lock이 유지되는 상태 불일치가 발생했습니다.

### 해결

PointerLockControls의 ref를 전역 Store에서 관리하도록 변경하여
Canvas 외부에서도 Pointer Lock 상태를 제어할 수 있도록 개선했습니다.

또한 Modal이 활성화된 경우 PointerLockControls의 동작을 제한하고,
모달 종료 후 다시 3D 조작이 가능하도록 상태 흐름을 분리했습니다.

### 결과

Pointer Lock 제어 로직을 중앙화하여 특정 Modal에 종속되지 않는 구조로 개선했습니다.

이후 게시글 작성, 닉네임 변경, 설정 등 Canvas 외부 UI를 사용하는 모든 기능에서 일관된 Pointer Lock 해제 및 재활성화 흐름을 적용할 수 있었습니다.

## 7. Performance / 개선 사항

## 8. Future Improvements (개선 예정)
