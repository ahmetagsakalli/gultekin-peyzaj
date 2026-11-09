import Link from "next/link";
import { PageHeading } from "@/components/shared";
export default function NotFound() {
  return (
    <>
      <PageHeading title="Bu sayfa" accent="bulunamadı." />
      <div className="not-found-action frame">
        <Link href="/" className="button button-green">
          Ana sayfaya dön
        </Link>
      </div>
    </>
  );
}
