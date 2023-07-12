import { GetServerSidePropsContext, NextPage } from "next";
import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { DashboardLayout } from "layouts/dashboard-layout/DashboardLayout";
import { HomeContainer } from "app/home/HomeContainer";
import { AccountId } from "providers/near/contracts/market/market.types";
import pulse from "providers/pulse";

const Index: NextPage<{ marketId: AccountId }> = ({ marketId }) => {
  const { t } = useTranslation("head");

  return (
    <DashboardLayout marketId={marketId}>
      <Head>
        <title>{t("head.og.title")}</title>
        <meta name="description" content={t("head.og.description")} />
        <meta property="og:title" content={t("head.og.title")} />
        <meta property="og:description" content={t("head.og.description")} />
        <meta property="og:url" content="https://app.pulsemarkets.org/" />
      </Head>

      <HomeContainer marketId={marketId} />
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => {
  await i18n?.reloadResources();

  const marketId = await pulse.promptWars.getLatestMarketId();

  return {
    props: {
      ...(await serverSideTranslations(locale!, ["common", "head", "home", "swap-card", "price-market"])),
      marketId,
    },
  };
};

export default Index;
