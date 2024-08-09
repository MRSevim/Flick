import { envVariables } from "@/utils/HelperFuncs";
import links from "@/utils/Links";
const frontendUrl = envVariables.frontendUrl;

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: [
        links.homepage,
        links.tocAndPrivacyPolicy,
        links.mostLiked("week"),
        links.mostLiked("month"),
        links.mostLiked("year"),
        links.createAnArticle,
        links.about,
        links.login,
        links.signup(),
        links.userString,
        links.articleString,
        links.articlesString,
        links.searchWithoutParam,
        links.emailerWithoutParams,
      ],
      disallow: [
        links.pmsWithoutParams,
        links.settings,
        links.myProfile,
        links.editString,
        links.draftsString,
      ],
    },
    sitemap: frontendUrl + "/sitemap.xml",
  };
}
