import { test } from "../utils/fixtures";
import { expect } from "@playwright/test";
import { validateSchema } from "../utils/schema-validator";
import articlerequestpayload from "../request-objects/POST-article.json";
import { generateComments, generateRandomArticle } from "../utils/data-generator";
import { faker } from "@faker-js/faker";

test.afterAll("After all tests", async () => {
  console.info("All tests completed");
});
test("GET Test articles", async ({ api }) => {
  const response = await api
    .clearAuth()
    .path("articles/")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(response.articles.length).customToBeLessThanOrEqual(10);
    console.log(response);

  expect(response.articlesCount).customEqual(10);
 // expect(response.articles[0].tagList).customEqual(["regression"]);
});
test("GET Test tags", async ({ api }) => {
  const response = await api
    .path("tags/")
    .getRequest(200);
  
  await expect(response).shouldMatchSchema("tags", "GET_tags_schema.json");
 // await validateSchema("tags", "GET_tags_schema.json", response);
  expect(response.tags[0]).customEqual("Test");
  expect(response.tags.length).customToBeLessThanOrEqual(10);
});

test("POST, GET, PUT, DELETE articles", async ({ api }) => {
  //api fixture used
  //const articlerequest = JSON.parse(JSON.stringify(articlerequestpayload)); //deep copy of articlerequestpayload, so that original payload is not modified
  //const postarticleRequest = structuredClone(articlerequestpayload);
  const uniqueTitle = `Article validation-${Date.now()}`;
  const postarticleRequest = generateRandomArticle(uniqueTitle);
  const postarticleresponse = await api //this is how you can call api fixture methods, api fixture is used to call api methods, api fixture is a function that returns a promise, response = await api
    .path("articles/")
    //.headers({ Authorization: token })
    .body(postarticleRequest)
    .postRequest(201);

  expect(postarticleresponse.article.title).customEqual(uniqueTitle);
  console.log(postarticleresponse.article.title);
  console.log(postarticleresponse);
  const articleSlug = postarticleresponse.article.slug; //save slug for future use

  const getarticleresponse1 = await api
    .path(`articles/${articleSlug}`)
    //.headers({ Authorization: token })
    .getRequest(200);

  expect(getarticleresponse1.article.title).customEqual(uniqueTitle);
//const putarticleRequest = structuredClone(articlerequestpayload); //deep copy of articlerequestpayload, so that original payload is not modified
  const putarticleRequest = structuredClone(postarticleRequest); //deep copy of postarticleRequest, so that original payload is not modified

  putarticleRequest.article.title = uniqueTitle + "-updated";
  const putarticleresponse: any = await api //this is how you can call api fixture methods, api fixture is used to call api methods, api fixture is a function that returns a promise, response = await api

  .path(`articles/${articleSlug}`) //dynamic path parameter, articleSlug is saved from post response
    //.headers({ Authorization: token })
    .body(putarticleRequest)
    .putRequest(200);
  const articleSlug2 = putarticleresponse.article.slug; //save slug for future use

  expect(putarticleresponse.article.title).customEqual(
    uniqueTitle + "-updated",
  );
  console.log(putarticleresponse.article.title);
  console.log(putarticleresponse);

  const getarticleresponse2 = await api
    .path(`articles/${articleSlug2}`)
    //.headers({ Authorization: token })
    .getRequest(200);

  expect(getarticleresponse2.article.title).customEqual(
    uniqueTitle + "-updated",
  );
  const latesttitle = getarticleresponse2.article.title; //save latest title for future use

  const deletearticleresponse = await api
    .path(`articles/${articleSlug2}`)
    //.headers({ Authorization: token })
    .deleteRequest(204);

  const getarticleresponse3 = await api
    .path(`articles/`)
    //.headers({ Authorization: token })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);

  expect(getarticleresponse3.articles[0].title).not.customEqual(latesttitle);

});

test("POST,DELETE,GET Favourite & Comment article", async ({ api }) => {
  const uniqueTitle = `Favourite validation-${Date.now()}`
  const postarticleRequest = generateRandomArticle(uniqueTitle);
  const postarticleResponse = await api //this is how you can call api fixture methods, api fixture is used to call api methods, api fixture is a function that returns a promise, response = await api
    .path("articles/")
    .body(postarticleRequest)
    .postRequest(201);

    const articleSlug = postarticleResponse.article.slug;
    expect(postarticleResponse.article.title).customEqual(uniqueTitle);
    
  const postarticleResponse2 = await api
      .path(`articles/${articleSlug}/favorite/`)
      .body({})
      .postRequest(200)
  const favouritevalue : boolean = true
  expect(postarticleResponse2.article.favorited).customEqual(favouritevalue)

  const removefavouriteArticle = await api
      .path(`articles/${articleSlug}/favorite/`)
      .deleteRequest(200)//app is handling this delete with 200status code instead of 204, so we are using 200 here

  const getArticleresponse = await api
    .path(`articles/${articleSlug}/`)
    .getRequest(200);

  expect(getArticleresponse.article.favorited).customEqual(false)
  console.log(getArticleresponse)

 const commentText = `Comment validation-${Date.now()}` 
  //faker.lorem.words(2)
  const postCommentResponse = await api
    .path(`articles/${articleSlug}/comments/`)
    .body(generateComments(commentText))
    .postRequest(200)

    let commentId = postCommentResponse.comment.id
    expect(postCommentResponse.comment.body).customEqual(commentText)
    await expect(postCommentResponse).shouldMatchSchema("tags","GET_comments_schema.json");
    console.log("Comment response matched schema successfully");


  const deleteComment = await api 
    .path(`articles/${articleSlug}/comments/${commentId}/`)
    .deleteRequest(200)
  
  const getCommentResponse = await api
    .path(`articles/${articleSlug}/comments/`)
    .getRequest(200)

  expect(getCommentResponse.comments).customEqual([])
  console.log(getCommentResponse)
  })
