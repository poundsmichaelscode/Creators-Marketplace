"use client";

type SocialProvider = { name: string; label: string; url: string; enabled: boolean };

const defaultProviders: SocialProvider[] = [
  { name: 'google', label: 'Google', url: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || '', enabled: !!process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL },
  { name: 'facebook', label: 'Facebook', url: process.env.NEXT_PUBLIC_FACEBOOK_AUTH_URL || '', enabled: !!process.env.NEXT_PUBLIC_FACEBOOK_AUTH_URL },
  { name: 'github', label: 'GitHub', url: process.env.NEXT_PUBLIC_GITHUB_AUTH_URL || '', enabled: !!process.env.NEXT_PUBLIC_GITHUB_AUTH_URL },
  { name: 'linkedin', label: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_AUTH_URL || '', enabled: !!process.env.NEXT_PUBLIC_LINKEDIN_AUTH_URL },
  { name: 'x', label: 'X', url: process.env.NEXT_PUBLIC_X_AUTH_URL || '', enabled: !!process.env.NEXT_PUBLIC_X_AUTH_URL },
];

export function mergeSocialProviders(apiProviders: SocialProvider[] = []) {
  const map = new Map<string, SocialProvider>();
  for (const provider of defaultProviders) map.set(provider.name, provider);
  for (const provider of apiProviders) {
    map.set(provider.name, {
      name: provider.name,
      label: provider.label || provider.name,
      url: provider.url || '',
      enabled: !!provider.url,
    });
  }
  return Array.from(map.values());
}

export function SocialButtons({ providers }: { providers: SocialProvider[] }) {
  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <a
          key={provider.name}
          href={provider.enabled ? provider.url : '#'}
          className="btn-ghost w-full justify-center"
          aria-disabled={!provider.enabled}
          onClick={(e) => !provider.enabled && e.preventDefault()}
        >
          Continue with {provider.label}{!provider.enabled ? ' (configure URL in env)' : ''}
        </a>
      ))}
    </div>
  );
}
