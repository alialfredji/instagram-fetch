## Instagram public api module

Easy to use module to fetch data from instagram. NOTE! this returns a promise so you need to handle it.

Import the module: `const instagramFetch = require('instagram-fetch')`

## Install module

`yarn add instagram-fetch`

`npm install instagram-fetch --save`

## Get post data

#### Promise

```
instagramFetch.getPost('somePostCode') // example Bq0gUSGgFv7
    .then(data => console.log(data))
    .catch(err => console.log(err))
```

#### Async/Await

```
const data = await instagramFetch.getPost('somePostCode') // example 'Bq0gUSGgFv7'
console.log(data)
```

## Get profile data

#### Promise

```
instagramFetch.getProfile('someProfileUsername') // example 'instagram'
    .then(data => console.log(data))
    .catch(err => console.log(err))
```

#### Async/Await

```
const data = await instagramFetch.getProfile('someProfileUsername') // example 'instagram'
console.log(data)
```
