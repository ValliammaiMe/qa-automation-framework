import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { generateRandomArticle } from "../utils/data-generator";

test("Create 10 articles", async ({ api }) => {

  for (let i = 1; i <= 10; i++) {

    const uniqueTitle = `test-${i}-${Date.now()}`;

    const articleRequest = generateRandomArticle(uniqueTitle); //where data comes from

    const response = await api
      .path("articles/")
      .body(articleRequest)
      .postRequest(201);

    expect(response.article.title).customEqual(uniqueTitle);

    console.log(`Article ${i} created : ${response.article.slug}`);

  }

});

test("Create 10 Comments", async ({api}) => {

  const uniqueTitle = `More Comments validation-${Date.now()}`;

    const articleRequest = generateRandomArticle(uniqueTitle); //where data comes from

    const response = await api
      .path("articles/")
      .body(articleRequest)
      .postRequest(201);
    
    const articleSlug = response.article.slug

  for (let i=1; i<=10; i++){
    const commentText = `Comment-${i}`
    const commentResponse = await api
      .path(`articles/${articleSlug}/comments/`)
    .body({
      "comment":
      {
        "body": commentText
      }
    })
    //or body(generateComments(commentText)) can also be used
    .postRequest(200) //post is handled with 200 code in app

    expect(commentResponse.comment.body).customEqual(commentText);

    console.log(`Comment ${i} created : ${commentResponse.article}`);
  }
})