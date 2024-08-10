import { getAllArticles, getAllUsers } from "@/utils/ApiCalls/GetterUtils";
import { envVariables } from "@/utils/HelperFuncs";
import links from "@/utils/Links";
const frontendUrl = envVariables.frontendUrl;

export default async function sitemap() {
  const { articles } = await getAllArticles();
  const { users } = await getAllUsers();

  const mappedUsers = users.map((user) => {
    const lastModified = user.updatedAt;
    const userId = user._id;
    return [
      {
        url: frontendUrl + links.followsWithoutPage(userId, "followers"),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: frontendUrl + links.followsWithoutPage(userId, "following"),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: frontendUrl + links.publicUser(userId),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: frontendUrl + links.allArticlesWithoutPage(userId),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
    ];
  });

  let spreadableUsers = [];
  mappedUsers.forEach((mappedUser) => {
    mappedUser.forEach((tag) => {
      spreadableUsers.push(tag);
    });
  });

  const mappedArticles = articles.map((article) => {
    return {
      url: frontendUrl + links.article(article._id),
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });

  return [
    {
      url: frontendUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: frontendUrl + links.about,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: frontendUrl + links.tocAndPrivacyPolicy,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.createAnArticle,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.mostLiked("week"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.mostLiked("month"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.mostLiked("year"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.login,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.signup(),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.searchWithoutParam,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: frontendUrl + links.emailerWithoutParams,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...mappedArticles,
    ...spreadableUsers,
  ];
}
