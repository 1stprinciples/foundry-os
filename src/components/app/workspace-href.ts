export function buildWorkspaceHref(path: string, companySlug?: string) {
  if (!companySlug) {
    return path;
  }

  if (path === "/dashboard") {
    return `/dashboard/${companySlug}`;
  }

  return `${path}?company=${encodeURIComponent(companySlug)}`;
}
