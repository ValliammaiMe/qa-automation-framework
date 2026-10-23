import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { generateRandomArticle } from "../utils/data-generator";
import { getSystemErrorMessage } from "node:util";

[
    [
  {
    testName: "Username too short", 
    email: "abc@gma.com",
    username: "ab",
    password: "12345678",
    errorfield: "username",
    errormessage: "is too short (minimum is 3 characters)" // taken from response.json
  },
  {
    testName: "Invalid email format",
    email: "abc",
    username: "abc",
    password: "12345678",
    errorfield: "email",
    errormessage: "is invalid"
  },
  {
    testName: "Password too short",
    email: "abc@gma.com",
    username: "abc",
    password: "ab",
    errorfield: "password",
    errormessage: "is too short (minimum is 8 characters)"
  }
   
].forEach(({ testName, username, email, password,errorfield, errormessage }) => {

  test(testName, async ({ api }) => {

    const response = await api
        .path("users/")
        .body({
          user: {
            username: username,
            email: email,
            password: password
          }
          
        })
        .clearAuth()
        .postRequest(422);
        expect(response.errors).toHaveProperty(errorfield);
        expect(response.errors[errorfield][0]).toContain(errormessage);
        console.log(response)

  })
  })
]

test("POST Duplicate article and POST blank comment", async ({ api }) => {
  const uniqueTitle = `Duplicate-${Date.now()}`;
  const postArticleRequest = generateRandomArticle(uniqueTitle);
  const postArticleResponse = await api
    .path("articles/")
    .body(postArticleRequest)
    .postRequest(201);

  const articleSlug = postArticleResponse.article.slug 
  expect(postArticleResponse.article.title).customEqual(uniqueTitle);

  const duplicateArticleRequest = generateRandomArticle(uniqueTitle);
  const duplicateResponse = await api
    .path("articles/")
    .body(duplicateArticleRequest)
    .postRequest(422);

  expect(duplicateResponse.errors).toHaveProperty("title");
  expect(duplicateResponse.errors.title[0]).toContain("must be unique");

  const blankcommentResponse = await api
      .path(`articles/${articleSlug}/comments/`)
      .body({
        "comment":
      {
        "body": ""
      }})
      .postRequest(422)
  expect(blankcommentResponse.errors).toHaveProperty("body")
  expect(blankcommentResponse.errors.body).toContain("can't be blank")

});

test("POST without tagList[]", async ({api}) => {
const uniqueTitle = `Without tag article ${Date.now()}`
const postArticleRequest = generateRandomArticle(uniqueTitle,[]);
const postArticleResponse = await api
    .path("articles/")
    .body(postArticleRequest)
    .postRequest(201);

expect(postArticleResponse.article.title).customEqual(uniqueTitle)
});

[
    [
  {
    testName: "Title can't be blank", 
    title: "",
    description: "Article desc",
    body: "ab",
    tagList: ["test"],
    errorfield: "title",
    errormessage: "can't be blank" // taken from response.json
  },

  {
    testName: "Description can't be blank", 
    title: "Article01",
    description: "",
    body: "ab",
    tagList: ["test"],
    errorfield: "description",
    errormessage: "can't be blank" 
  },

  {
    testName: "Body can't be blank", 
    title: "Article02",
    description: "Article desc",
    body: "",
    tagList: ["test"],
    errorfield: "body",
    errormessage: "can't be blank" 
  }

  ].forEach(({testName,title,description,body,errorfield,errormessage}) => {
      test(testName, async ({api}) => {
        const response = await api
    .path("articles/")
    .body({
       article: {
            title: title,
            description: description,
            body: body,
            tagList: [],
       }
    })

        .postRequest(422);
        expect(response.errors).toHaveProperty(errorfield);
        expect(response.errors[errorfield][0]).toContain(errormessage);
        console.log(response)

  })
  })
]


