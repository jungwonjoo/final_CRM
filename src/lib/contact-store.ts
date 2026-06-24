import type { Contact } from "@/lib/types";

// 백엔드 연동 전, 빠른등록한 고객을 브라우저(localStorage)에 임시 저장
const KEY = "fs-contacts-v1";

export function getStoredContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? (arr as Contact[]) : [];
  } catch {
    return [];
  }
}

/** 고객명만으로 빠른 등록 (나머지 정보는 빈 값) */
export function addStoredContact(name: string): Contact {
  const contact: Contact = {
    id: `new-${Date.now()}`,
    name,
    dept: "",
    position: "",
    phone: "",
    email: "",
    events: [],
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([...getStoredContacts(), contact]));
  } catch {
    /* noop */
  }
  return contact;
}
