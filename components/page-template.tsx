export interface PageData {
  first_name: string;
  profession: string;
  city: string;
  tagline: string;
  bio: string;
  services: string[];
  contact_preference: string;
  contact_value: string;
  accent_colour: string;
}

export default function PageTemplate({ page }: { page: PageData }) {
  const initial = page.first_name.charAt(0).toUpperCase();

  const ctaText =
    page.contact_preference === "booking" ? "Book a call" : "Get in touch";

  const ctaHref =
    page.contact_preference === "email"
      ? `mailto:${page.contact_value}`
      : page.contact_preference === "phone"
      ? `tel:${page.contact_value}`
      : page.contact_value || "#";

  return (
    <div className="min-h-screen bg-white px-6 py-12 sm:px-10">
      {/* Avatar + name + profession */}
      <div className="mb-10">
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-full text-lg font-medium text-white"
          style={{ backgroundColor: page.accent_colour }}
        >
          {initial}
        </div>
        <h1 className="text-4xl font-light tracking-tight text-black">
          {page.first_name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {page.profession} &middot; {page.city}
        </p>
      </div>

      {/* Tagline */}
      <p className="mb-8 text-lg font-medium text-black">{page.tagline}</p>

      {/* Bio */}
      <p className="mb-12 text-sm leading-relaxed text-gray-700">{page.bio}</p>

      {/* Services */}
      <div className="mb-12">
        {page.services.map((service, i) => (
          <div key={i}>
            <p className="py-4 text-sm text-gray-900">{service}</p>
            {i < page.services.length - 1 && (
              <div className="h-px bg-gray-100" />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mb-16">
        <a
          href={ctaHref}
          className="inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          {ctaText}
        </a>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400">Made with GoPublic</p>
    </div>
  );
}
