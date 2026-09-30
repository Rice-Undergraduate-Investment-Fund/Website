import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getSiteSettings, getTrainingProgram } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, training] = await Promise.all([getSiteSettings(), getTrainingProgram()]);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-rice-blue"
      >
        Skip to content
      </a>
      <Header
        showApply={training.applicationsOpen}
        applyHref={training.applyUrl ?? "/training#apply"}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer orgName={settings.orgName} />
    </>
  );
}
