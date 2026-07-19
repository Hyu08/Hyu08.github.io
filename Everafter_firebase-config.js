// ============================================================
// 🔥 Firebase 실시간 동기화 설정 파일
// ============================================================
// 아래 안내에 따라 본인의 Firebase 프로젝트 값을 채워 넣으세요.
//
// 1) https://console.firebase.google.com 접속 → 로그인 → "프로젝트 추가"
// 2) 프로젝트 생성 완료 후, 왼쪽 메뉴 "빌드 → Realtime Database" 진입
//    → "데이터베이스 만들기" 클릭 → 위치 선택 → "테스트 모드에서 시작" 선택
// 3) 프로젝트 개요 옆 톱니바퀴(프로젝트 설정) → 아래로 스크롤 →
//    "내 앱" 에서 </> (웹) 아이콘 클릭 → 앱 닉네임 입력 후 앱 등록
// 4) 화면에 표시되는 firebaseConfig 객체의 값을 아래에 그대로 복사해 넣으세요.
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBqkuNNk0lRbSxm3fYIywTJmIrzstXl-oQ",
  authDomain: "everlight-60a56.firebaseapp.com",
  databaseURL: "https://everlight-60a56-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "everlight-60a56",
  storageBucket: "everlight-60a56.firebasestorage.app",
  messagingSenderId: "769609298094",
  appId: "1:769609298094:web:98c7291c3844c6daf93d3f"
};

// ⚠️ databaseURL은 반드시 포함되어야 합니다 (Realtime Database 사용을 위해 필수).
//    Firebase 콘솔의 Realtime Database 페이지 상단에 표시된 주소를 그대로 복사하세요.
//    (예: https://everlight-60a56-default-rtdb.asia-southeast1.firebasedatabase.app/)
