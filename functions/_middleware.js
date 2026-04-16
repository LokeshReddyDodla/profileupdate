const API_PREFIXES = [
  "/v1/",
  "/patient-onboarding-agent/",
  "/profile-update-agent/",
  "/patient/",
];

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (API_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    const target = new URL(url.pathname + url.search, "https://api.aihealth.clinic");
    const req = new Request(target, {
      method: context.request.method,
      headers: context.request.headers,
      body: context.request.body,
    });
    return fetch(req);
  }

  return context.next();
}
