// Firebase 클라이언트 초기화 (Next.js App Router)
//
// 이 모듈은 클라이언트/서버 양쪽에서 import 가능하지만, Firestore Web SDK는
// 브라우저에서 동작하는 것이 기본 전제다. Firestore 호출이 포함된 컴포넌트는
// "use client" 경계 안에서 사용하라. (이 파일 자체에는 "use client" 를 두지 않는다 —
//  지시문 없이 어디서든 import 가능한 순수 모듈로 유지.)
//
// 중복 init 방지: Next.js 의 HMR / 다중 import 환경에서 initializeApp 이 여러 번
// 호출되지 않도록 getApps() 로 기존 인스턴스를 재사용한다.

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(firebaseApp);
export const auth: Auth = getAuth(firebaseApp);
