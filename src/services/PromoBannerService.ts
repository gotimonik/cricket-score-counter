import AuthService from "./AuthService";

// Drives the dynamic advertisement/promo cards shown on the Home page.
// Multiple banners can be active at once -- the backend returns every
// visible banner for a slot and the frontend rotates through them.
// Every visual detail (whether a banner is visible at all, its title,
// image, button labels, and the links its buttons open) is controlled
// entirely by the backend -- nothing here is hardcoded -- so marketing can
// add, edit, reorder, or turn off banners without a client release.
export type PromoBannerRecord = {
  id: string;
  slot: string;
  order: number;
  show: boolean;
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
  // Optional background image for the whole card (behind the title/image/
  // buttons), separate from imageUrl.
  bannerUrl: string;
  buttonText: string;
  ctaUrl: string;
  // Optional second button -- only rendered when both fields are set.
  buttonText1: string;
  buttonLink1: string;
  openInNewTab: boolean;
};

type RawPromoBanner = {
  id?: string;
  _id?: string;
  slot?: string;
  order?: number;
  show?: boolean;
  visible?: boolean;
  isVisible?: boolean;
  enabled?: boolean;
  title?: string;
  heading?: string;
  subTitle?: string;
  sub_title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  bannerUrl?: string;
  banner_url?: string;
  backgroundImage?: string;
  bgImage?: string;
  buttonText?: string;
  ctaText?: string;
  buttonLabel?: string;
  ctaUrl?: string;
  ctaLink?: string;
  link?: string;
  url?: string;
  buttonText1?: string;
  button_text_1?: string;
  buttonLink1?: string;
  button_link_1?: string;
  ctaUrl1?: string;
  openInNewTab?: boolean;
  newTab?: boolean;
};

type PromoBannerListResponse = { banners?: RawPromoBanner[] };
type PromoBannerSingleResponse = { banner?: RawPromoBanner } & RawPromoBanner;

const asBool = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const asText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalize = (raw: RawPromoBanner): PromoBannerRecord => ({
  id: asText(raw.id ?? raw._id),
  slot: asText(raw.slot),
  order: asNumber(raw.order, 0),
  show: asBool(raw.show ?? raw.visible ?? raw.isVisible ?? raw.enabled, false),
  title: asText(raw.title ?? raw.heading),
  subTitle: asText(raw.subTitle ?? raw.sub_title ?? raw.subtitle),
  description: asText(raw.description),
  imageUrl: asText(raw.imageUrl ?? raw.image),
  bannerUrl: asText(
    raw.bannerUrl ?? raw.banner_url ?? raw.backgroundImage ?? raw.bgImage,
  ),
  buttonText: asText(raw.buttonText ?? raw.ctaText ?? raw.buttonLabel),
  ctaUrl: asText(raw.ctaUrl ?? raw.ctaLink ?? raw.link ?? raw.url),
  buttonText1: asText(raw.buttonText1 ?? raw.button_text_1),
  buttonLink1: asText(raw.buttonLink1 ?? raw.button_link_1 ?? raw.ctaUrl1),
  openInNewTab: asBool(raw.openInNewTab ?? raw.newTab, true),
});

// A banner with nothing worth showing (no image and no title) is dropped
// rather than rendered as an empty card -- protects against a
// half-configured backend record slipping through.
const isMeaningful = (banner: PromoBannerRecord): boolean =>
  Boolean(banner.imageUrl || banner.title);

// Create/update payload -- every field is optional so a save only sends
// what actually changed.
export type PromoBannerInput = Partial<{
  show: boolean;
  order: number;
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
  buttonText: string;
  ctaUrl: string;
  buttonText1: string;
  buttonLink1: string;
  openInNewTab: boolean;
}>;

const SLOT = "home";

export const PromoBannerService = {
  // GET /api/v1/promo-banner/home -- public. Returns every banner the
  // backend currently has visible for this slot, already ordered.
  // Missing/blocked/unset (e.g. no banners created yet) resolves to an
  // empty list rather than throwing, so the Home page never breaks over
  // this.
  getHomeBanners: async (): Promise<PromoBannerRecord[]> => {
    try {
      const data = await AuthService.request<PromoBannerListResponse>(
        `/promo-banner/${SLOT}`,
        { method: "GET" },
      );
      return (data.banners ?? []).map(normalize).filter(isMeaningful);
    } catch {
      return [];
    }
  },

  // GET /api/v1/promo-banner/home/admin -- admin only. Same as above but
  // includes hidden banners, for the admin list/manage screen. Allowed to
  // throw so that screen can show a load error instead of an empty list.
  getHomeBannersAdmin: async (): Promise<PromoBannerRecord[]> => {
    const data = await AuthService.request<PromoBannerListResponse>(
      `/promo-banner/${SLOT}/admin`,
      { method: "GET" },
    );
    return (data.banners ?? []).map(normalize);
  },

  // POST /api/v1/promo-banner/home -- admin only.
  createHomeBanner: async (
    input: PromoBannerInput,
  ): Promise<PromoBannerRecord> => {
    const data = await AuthService.request<PromoBannerSingleResponse>(
      `/promo-banner/${SLOT}`,
      { method: "POST", body: JSON.stringify(input) },
    );
    return normalize(data.banner ?? data);
  },

  // PUT /api/v1/promo-banner/home/:id -- admin only.
  updateHomeBanner: async (
    id: string,
    input: PromoBannerInput,
  ): Promise<PromoBannerRecord> => {
    const data = await AuthService.request<PromoBannerSingleResponse>(
      `/promo-banner/${SLOT}/${id}`,
      { method: "PUT", body: JSON.stringify(input) },
    );
    return normalize(data.banner ?? data);
  },

  // DELETE /api/v1/promo-banner/home/:id -- admin only.
  deleteHomeBanner: async (id: string): Promise<void> => {
    await AuthService.request<{ message?: string }>(
      `/promo-banner/${SLOT}/${id}`,
      { method: "DELETE" },
    );
  },
};

export default PromoBannerService;
