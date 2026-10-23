import { test, expect } from '@playwright/test';

let token : string; //global variable to store token for future use

test.beforeAll('run before all tests',async ({ request }) =>{
const loginresponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "User001@testing.com", "password": "User001@testing.com" } }
  })
  const loginjson = await loginresponse.json();
  token = `Token ${loginjson.user.token}`; //save token for future use, token is initiallized in beforeAll hook so that it can be used in all tests, token is stored in authorization header of login response;
  //console.log(token);
  expect(loginresponse.status()).toEqual(200);
  expect(loginjson.user.email).toEqual('User001@testing.com');
  //console.log(loginjson);
}
)
test.afterAll('After all tests', async () => {
 const text = console.info('All tests completed');
})
test('GET Test tags', async ({ request }) => {
  const gettagsresponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const gettagsjson = await gettagsresponse.json();
  expect(gettagsresponse.status()).toEqual(200);
  expect(gettagsjson.tags[0]).toEqual('Test');
  expect(gettagsjson.tags.length).toBeLessThanOrEqual(10);
  console.log(gettagsjson);
});

test('GET Test articles', async ({ request }) => { //.only,skip/fixme - annotations
  const getarticleresponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
  const getarticlejson = await getarticleresponse.json();
  expect(getarticleresponse.status()).toEqual(200);
  expect(getarticlejson.articles.length).toBeLessThanOrEqual(10);
  expect(getarticlejson.articlesCount).toEqual(10);
  //expect(getarticlejson.articles[0].slug).toContain('Education');
  console.log(getarticlejson);
})

//Post
test('POST, GET, PUT, DELETE articles', async ({ request }) => {

  const uniqueTitle = `test-${Date.now()}`;

  const postarticleresponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    headers: {
      'Authorization': token //authorization is taken from app login response which they stores token in authorization header
    },
    data: {
      "article": {
        "title": uniqueTitle,
        "description": "chikjha",
        "body": "testing this app via api",
        "tagList": ["regression"]
      }
    }
  })

  const postarticlejson = await postarticleresponse.json();
    const articleSlug = postarticlejson.article.slug; //save slug for future use

  expect(postarticleresponse.status()).toEqual(201);
  expect(postarticlejson.article.title).toEqual(uniqueTitle);
  console.log(postarticlejson.article.title);
  console.log(postarticlejson);
  const getarticleresponse = await request.get(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    headers: {
      'Authorization': token
    }
  })
  const getarticlejson = await getarticleresponse.json();
  expect(getarticleresponse.status()).toEqual(200);
  console.log(getarticlejson.article.title);
  expect(getarticlejson.article.title).toEqual(uniqueTitle);
  //console.log(getarticlejson);
   
  const putarticleresponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    headers: {
      'Authorization': token
    },
    data: {
      "article": {
        "title": uniqueTitle + '-updated',
        "description": "chikjha",
        "body": "testing this app via api",
        "tagList": ["regression"]
      }
    }
  })
  const putarticlejson = await putarticleresponse.json();
  expect(putarticleresponse.status()).toEqual(200);
  expect(putarticlejson.article.title).toEqual(uniqueTitle + '-updated');
  console.log(putarticlejson);
  const articleSlug2 = putarticlejson.article.slug; //save new slug for future use
 
    const deleteresponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug2}`, {
    headers: {
      'Authorization': token
    }
  })
  expect(deleteresponse.status()).toEqual(204);
}
) 