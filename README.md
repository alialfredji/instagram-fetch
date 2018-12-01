## Instagram public api module

Easy to use module to fetch data from instagram. NOTE! this returns a promise so you need to handle it.

Import the module: `const publicInstagramApi = require('public-ig-api')`

## Install module

`yarn add public-ig-api`

`npm install public-ig-api --save`

## Get post data

#### Promise

```
publicInstagramApi.getPost('somePostCode') // example Bq0gUSGgFv7
    .then(data => console.log(data))
    .catch(err => console.log(err))
```

#### Async/Await

```
const data = await publicInstagramApi.getPost('somePostCode') // example 'Bq0gUSGgFv7'
console.log(data)
```

## Get profile data

#### Promise

```
publicInstagramApi.getProfile('someProfileUsername') // example 'instagram'
    .then(data => console.log(data))
    .catch(err => console.log(err))
```

#### Async/Await

```
const data = await publicInstagramApi.getProfile('someProfileUsername') // example 'instagram'
console.log(data)
```
