import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { readCSV } from "../utils/csv-reader";
import articlerequestpayload from "../request-objects/POST-article.json";
import { generateRandomArticle } from "../utils/data-generator";

test("Create articles from CSV", async ({ api }) => {

  const articles = await readCSV("test-data/articles.csv"); //take from csv-readers.ts file
  console.log(articles);
  console.log(articles.length);
  for (const article of articles) { //article is get data from csv file

    const request = structuredClone(articlerequestpayload); //copy of articlerequestpayload template structure

    request.article.title = `${article.title}-${Date.now()}`; //ryt side article is from for which get title from csv file and assign to request.article.title
    request.article.description = article.description;
    request.article.body = article.body;
    request.article.tagList = [article.tag];

    const response = await api
      .path("articles/")
      .body(request)
      .postRequest(201);

    expect(response.article.title).customEqual(request.article.title);

    console.log(`Created: ${article.title}`);
    
  }

});

test("Create 10 Comments for a article", async ({api}) => {
const uniqueTitle = `Csv Comments validation-${Date.now()}`;

    const articleRequest = generateRandomArticle(uniqueTitle); //where data comes from

    const response = await api
      .path("articles/")
      .body(articleRequest)
      .postRequest(201);
    
    const articleSlug = response.article.slug

  const comments = await readCSV("test-data/comments.csv");
  console.log(comments.length);

  for (const comment of comments){
  
    const Csvresponse = await api  
      .path(`articles/${articleSlug}/comments/`)
      .body({
        "comment":
      {
        "body": comment.body //body col name from comments.csv file
      }
      })
      .postRequest(200) 

  expect(Csvresponse.comment.body).customEqual(comment.body);
  await expect(Csvresponse).shouldMatchSchema("tags", "GET_comments_schema.json");
  console.log("Comment response matched schema successfully");

    }
})
