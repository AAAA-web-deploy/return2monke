export type TokenStatus = "unannounced" | "announced" | "live";

export type SiteConfig = {
  identity: {
    name: string | null;
    ticker: string | null;
    description: string;
    independenceLine: string;
    logoAssetId: string;
    faviconAssetId: string;
  };
  token: {
    status: TokenStatus;
    network: string | null;
    chainId: number | null;
    contractAddress: string | null;
    pairAddress: string | null;
    totalSupply: string | null;
    chartUrl: string | null;
    buyUrl: string | null;
    explorerUrl: string | null;
    taxInfo: string | null;
    liquidityInfo: string | null;
    ownership: string | null;
    lpStatus: string | null;
  };
  community: {
    xUrl: string | null;
    telegramUrl: string | null;
  };
  event: {
    name: string;
    edition: number;
    city: string;
    region: string;
    venue: string;
    officialUrl: string;
    startsAt: string;
    endsAt: string;
    verifiedAt: string;
  };
  deployment: {
    repository: string;
    stagingBranch: string;
    productionBranch: string;
    productionDomain: string;
    productionEnabled: boolean;
    stagingUrl: string | null;
  };
  seo: {
    title: string | null;
    description: string;
    socialImageAsset: string;
  };
};

export type AssetRecord = {
  src: string;
  alt: string;
  width: number;
  height: number;
  version: number;
  desktopFocus?: string;
  mobileFocus?: string;
};

export type AssetsConfig = Record<string, AssetRecord>;

export type CopyContent = {
  nav: {
    skip: string;
    culture: string;
    history: string;
    memes: string;
    token: string;
  };
  hero: {
    headline: string[];
    subheading: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  culture: {
    eyebrow: string;
    heading: string[];
    introduction: string;
    items: { title: string; text: string }[];
  };
  history: {
    eyebrow: string;
    heading: string[];
    introduction: string;
    factLabel: string;
    jokeLabel: string;
    sourceLabel: string;
    verifiedLabel: string;
  };
  memes: {
    eyebrow: string;
    heading: string[];
    introduction: string;
    saveLabel: string;
    renderingLabel: string;
    expressionLabel: string;
    captionLabel: string;
    privacy: string;
  };
  token: {
    eyebrow: string;
    heading: string[];
    pendingText: string;
    eventTitle: string;
    eventNote: string;
    launchNote: string;
    copyLabel: string;
    copiedLabel: string;
    copyFallback: string;
    contractNotice: string;
    fields: {
      name: string;
      ticker: string;
      status: string;
      network: string;
      chainId: string;
      contract: string;
      pair: string;
      supply: string;
      tax: string;
      liquidity: string;
      ownership: string;
      lpStatus: string;
      pending: string;
    };
    actions: {
      chart: string;
      buy: string;
      explorer: string;
      x: string;
      telegram: string;
    };
    statuses: Record<TokenStatus, string>;
    phases: Record<EventPhase, string>;
  };
  footer: {
    fictionLine: string;
  };
};

export type HistoryRecord = {
  year: number;
  city: string;
  title: string;
  assetId: string;
  object: string;
  fact: string;
  joke: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type MemeContent = {
  reactions: { id: string; label: string; assetId: string }[];
  captions: string[];
};

export type EventPhase = "upcoming" | "live" | "ended";

export type ContentModel = {
  site: SiteConfig;
  assets: AssetsConfig;
  copy: CopyContent;
  history: HistoryRecord[];
  memes: MemeContent;
};
