
# Profile data model

This is the data structure returned when requesting **getProfile('username')**

| Field | Type | Description |
|-|-|-|
|id|`string`| Unique profile identifier|
|username|`string`|Unique profile username|
|biography|`string, null`| profile biography|
|followers|`number`|total followers count|
|externalUrl|`string, null`|linked external url|
|followings|`number`|total followings count|
|fullName|`string, null`|profile provided full name|
|isPublic|`boolean`|determines if profile is public or has private account|
|picUrl|`string`|profile picture|
|picUrlHd|`string`|profile picture in HD|
|isBusinessAccount|`boolean`|This property is for `business` accounts|
|businessCategory|`string, null`|This property is for `business` accounts|
|businessEmail|`string, null`|This property is for `business` accounts|
|businessPhone|`string, null`|This property is for `business` accounts|
|businessAddress|`object, null`|This property is for `business` accounts|
|postsCount|`number`|number of total posts uploaded|
|postsList|`array` of `objects`|Contains the list of the latest 12 posts|
|avgLikes|`number`|average likes per post based on `postsList`|
|engagementRate|`float`|`avgLikes` to `followers` ratio|
|videoViewsToFollowersRatio|`float`|`avgVideoViews` to `followers` ratio|
|uploadsWeek|`number`|Uploads count per week based on `postsList`|
|uploadsMonth|`number`|Uploads count per month based on `postsList`|
|avgComments|`number`|average comments based on `postsList`|
|avgVideoViews|`number`|average video views based on `postsList`|
|emailsList|`array` of `strings`|found emails in `biography`|
|mentionsList|`array` of `strings`|mentions found in `biography`|
|hashtagsList|`array` of `strings`|hashtags found in `biography`|
|videoRate|`float`|video posts to total posts ratio, based on `postsList`|
|imageRate|`float`|image posts to total posts ratio, based on `postsList`|
|allPostsHashtagsList|`array` of `strings`|hastags found in captions, based on `postsList`|
|hashtagsPerPost|`float`|`allPostsHashtagsList` length to `postsList` ratio|