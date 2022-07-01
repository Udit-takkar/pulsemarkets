import getConfig from "./getConfig";

const getCollateralTokenBySymbol = (symbol: string) =>
  getConfig().COLLATERAL_TOKENS.filter((token) => token.symbol === symbol)[0];

const getCollateralTokenByAccountId = (accountId: string) =>
  getConfig().COLLATERAL_TOKENS.filter((token) => token.accountId === accountId)[0];

export default {
  getConfig,
  getCollateralTokenBySymbol,
  getCollateralTokenByAccountId,
};
