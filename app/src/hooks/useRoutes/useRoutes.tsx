type RouteMap = {
  home: () => string;
  market: {
    price: (args: { marketId: string }) => string;
  };
  api: {
    promptWars: {
      createGuestAccount: () => string;
      create: () => string;
      reveal: () => string;
      resolve: () => string;
    };
  };
  dashboard: {
    latestTrends: () => string;
    promptWars: {
      home: () => string;
      previousMarkets: () => string;
      market: (args: { marketId: string }) => string;
    };
    market: (args: { marketId: string }) => string;
  };
};

export const routes: RouteMap = {
  home: () => `/`,
  market: {
    price: ({ marketId }) => `/market/price/${marketId}`,
  },
  api: {
    promptWars: {
      createGuestAccount: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/create-guest-account`,
      create: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/create`,
      reveal: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/reveal`,
      resolve: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/prompt-wars/resolve`,
    },
  },
  dashboard: {
    latestTrends: () => `/`,
    promptWars: {
      home: () => `/`,
      previousMarkets: () => `/previous-rounds`,
      market: ({ marketId }) => `/${marketId}`,
    },
    market: ({ marketId }) => `/market/${marketId}`,
  },
};

export const useRoutes: () => RouteMap = () => routes;
