
# Post data model

This is the data structure returned when requesting **getPost('postCode')**

| Field | Type | Description |
|-|-|-|
|id|`string`| Unique post identifier|
|code|`string`|Unique post code|
|type|`string`| Either **video** or **image**|
|thumbnail|`string`||
|displayUrl|`string`||
|videoUrl|`string, null`||
|videoViews|`number, null`||
|commentsCount|`number`||
|likesCount|`number`||
|timestamp|`number`|Timestamp post got uploaded|
|locationName|`string, null`||
|locationSlug|`string, null`||
|locationAddress|`object, null`||
|caption|`string, null`||
|mentionsList|`array` of `objects`||
|sponsorsList|`array` of `objects`||
|taggedList|`array` of `objects`||
|commentsList|`array` of `objects`||
|likesList|`array` of `objects`||
|hashtagsList|`array` of `strings`||
|ownerFullName|`string, null`||
|ownerId|`string`||
|ownerUsername|`string`||
|ownerPic|`string`||
|ownerIsPublic|`boolean`||
|ownerIsVerified||