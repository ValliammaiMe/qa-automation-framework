import articlerequestpayload from "../request-objects/POST-article.json";
import commentrequestpayload from "../request-objects/POST-comment.json"
import { faker } from '@faker-js/faker';

export function generateRandomArticle(title: string, tagList?: string[]){
    const articleRequest = structuredClone(articlerequestpayload);
    articleRequest.article.title = title;
    articleRequest.article.description = faker.lorem.sentence(2);
    articleRequest.article.body = faker.lorem.paragraph(3);

  if (tagList !== undefined) {
    articleRequest.article.tagList = tagList;
  }
    return articleRequest;
}

export function generateComments(comment : string){
  const commentRequest = structuredClone(commentrequestpayload);
  commentRequest.comment.body = comment
  return commentRequest;

}