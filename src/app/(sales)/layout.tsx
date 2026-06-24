import { SiteHeader } from "@/components/layout/site-header";
import { QuickMenu } from "@/components/layout/quick-menu";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <QuickMenu />
      <main className="w-full flex-1 px-5 py-5 md:pl-20">
        {children}
      </main>
      <footer className="border-t py-5 text-center text-xs text-muted-foreground">
        <p>
          서울시 구로구 디지털로34길 43 코오롱싸이언스밸리1차 1006호 (주)핑거포스트
          · Tel. 070-4066-5900
        </p>
        <p className="mt-1">Copyright ⓒ FINGERPOST ALL RIGHT RESERVED.</p>
      </footer>
    </div>
  );
}
