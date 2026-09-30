/** Primary navigation. Lives in code on purpose (not CMS-editable). */
export type NavItem = { label: string; href: string; children?: NavItem[] };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Sectors", href: "/sectors" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Training Program", href: "/training" },
  {
    label: "People",
    href: "/people/board",
    children: [
      { label: "Board", href: "/people/board" },
      { label: "Alumni", href: "/people/alumni" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
