import type { Company } from "@/lib/types";

// 백엔드 연동 전, 빠른등록한 고객사를 브라우저(localStorage)에 임시 저장
const KEY = "fs-companies-v1";

export function getStoredCompanies(): Company[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? (arr as Company[]) : [];
  } catch {
    return [];
  }
}

/** 고객사명만으로 빠른 등록 (나머지 정보는 기본값) */
export function addStoredCompany(name: string): Company {
  const company: Company = {
    id: `new-${Date.now()}`,
    name,
    memberCount: 0,
    address: "",
    ownerName: "",
    amount: 0,
    counts: {
      opportunity: null,
      activity: null,
      quotation: null,
      contract: null,
      support: null,
    },
  };
  try {
    localStorage.setItem(KEY, JSON.stringify([...getStoredCompanies(), company]));
  } catch {
    /* noop */
  }
  return company;
}
