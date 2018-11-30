
/*
This library takes the json response from a call like:
https://www.instagram.com/p/BQnBY_PAN35/?__a=1

And created a data model like:

id: '1733623177346296378',
code: 'BYCEUEVgFf7',
postType: 0,
postThumbnail: 'https://scontent-arn2-1.cdninstagram.com/vp/e472d944ab740bb413a3a23ec01eca50/5B0A1C1C/t51.2885-15/sh0.08/e35/p640x640/27582032_176612969733717_4622438443283120128_n.jpg',
postUrl: 'https://scontent-arn2-1.cdninstagram.com/vp/f40da634fa8b2c8183ba72cf61a56e09/5B290EEA/t51.2885-15/e35/27582032_176612969733717_4622438443283120128_n.jpg',
videoUrl: null,
videoViews: null,
comments: 44,
likes: 1000,
timestamp: 1503267953000,
locationId: '327472484376895',
locationName: 'malmö, sweden',
ownerId: '987012765',
ownerUsername: 'mustafaalfredji',
ownerIsPublic: true,
caption: 'some text here @alialfredji @puma #fitness #gaming #lover',
mentionsList: [
    {
        id: null,
        username: 'alialfredji'
    },
    {
        id: '1234764',
        username: 'puma'
    }
],
sponsorsList: [
    {
        id: '1234764',
        username: 'puma'
    }
],
taggedList: [
    {
        id: '987012765',
        username: 'mustafaalfredji',
        x: 0.00122312312,
        y: 0.901839102
    },
]
commentsList: [
  {
        id: '17925607570039271',
        ownerId: '987012765',
        ownerUsername: 'mustafaalfredji',
        ownerProfilePic: 'https://scontent-arn2-1.cdninstagram.com/vp/2b0affaef54f7b4dd0c0073ae4b3891e/5B0D7D2F/t51.2885-19/12063025_1629524887320825_158812758_a.jpg',
        commentText: 'fooo',
        commentTimestamp: 1503267953000,
        mentionsList: [ 'alialfredji', 'marcopeg' ],
        hashtagsList: [ 'fitness', 'mysocial' ]
  }
  {...comments}
]
likesList: [
  {
        ownerId: '987012765',
        ownerUsername: 'mustafaalfredji'
        ownerProfilePic: https://scontent-arn2-1.cdninstagram.com/vp/2b0affaef54f7b4dd0c0073ae4b3891e/5B0D7D2F/t51.2885-19/12063025_1629524887320825_158812758_a.jpg',
  }
  {...likes}
]
hashtagsList: [
  'fitness',
  'gaming',
  'lover',
]

*/

const getErrorOrigin = require('../error/get-origin')
const getPostTimestampByDate = require('./lib/get-post-timestamp-by-date')
const getTextUsernames = require('./lib/get-text-usernames')
const getProfileIdFromSponsor = require('./lib/get-profile-id-from-sponsor')
const getHashtags = require('./lib/get-hashtags')

class PostDataModelError extends Error {
    constructor (message) {
        super()
        Error.captureStackTrace(this)
        this.name = 'PostDataModelError'
        this.message = message
        this.origin = getErrorOrigin(this.stack)
    }
}

// post like owner profile pic
const getlLikeDataModelOwnerProfilePic = (json) => {
    if (json.profile_pic_url === undefined) {
        throw Error('[Post Like Owner ProfilePic] missing in json')
    }

    return json.profile_pic_url
}

// post like owner username
const getlLikeDataModelOwnerUsername = (json) => {
    if (json.username === undefined) {
        throw Error('[Post Like Owner Username] missing in json')
    }

    return json.username.toLowerCase()
}

// post like owner id
const getLikeDataModelOwnerId = (json) => {
    if (json.id === undefined) {
        throw Error('[Post Like Owner Id] missing in json')
    }

    return json.id
}

// post like data
const getLikeDataModel = (json) => {
    const likeData = json.node

    return {
        ownerId: getLikeDataModelOwnerId(likeData),
        ownerUsername: getlLikeDataModelOwnerUsername(likeData),
        ownerProfilePic: getlLikeDataModelOwnerProfilePic(likeData),
    }
}

// post likes data
const getPostDataModelLikesList = (json) => {
    if (!json.edge_media_preview_like || json.edge_media_preview_like === undefined) {
        throw Error('[Post Likes] missing in json')
    }

    if (!json.edge_media_preview_like.edges || json.edge_media_preview_like.edges === undefined) {
        throw Error('[Post Likes Edges] missing in json')
    }

    if (json.edge_media_preview_like.edges.length === 0) {
        return []
    }

    return json.edge_media_preview_like.edges.map(getLikeDataModel)
}

// post comment owner id
const getCommentDataModelOwnerId = (owner) => {
    if (owner.id === undefined) {
        throw Error('[Post Comment Owner Id] missing in json')
    }

    return owner.id
}

// post comment owner username
const getCommentDataModelOwnerUsername = (owner) => {
    if (owner.username === undefined) {
        throw Error('[Post Comment Owner username] missing in json')
    }

    return owner.username.toLowerCase()
}

// post comment owner profile pic
const getCommentDataModelProfilePic = (owner) => {
    if (!owner.profile_pic_url && owner.profile_pic_url === undefined) {
        throw Error('[Post Comment Owner ProfilePic] missing in json')
    }

    return owner.profile_pic_url
}

// post comment text
const getCommentDataModelCommentText = (json) => {
    if (json.text === undefined) {
        throw Error('[Post Comment Text] missing in json')
    }

    if (json.text === null) {
        return ''
    }

    return json.text.length < 500
        ? json.text.toLowerCase()
        : json.text.slice(0, 500).toLowerCase()
}

// post comment timestamp
const getCommentDataModelCommentTimestamp = (json) => {
    if (!json.created_at && json.created_at === undefined) {
        throw Error('[Post Comment CreatedAt] missing in json')
    }

    return getPostTimestampByDate(json.created_at)
}

// post comment id
const getCommentDataModelId = (json) => {
    if (!json.id && json.id === undefined) {
        throw Error('[Post Comment Id] missing in json')
    }

    return json.id
}

// post comment data
const getCommentDataModel = (json) => {
    const commentData = json.node

    if (commentData.owner === undefined) {
        throw Error('[Post Comment Owner] missing in json')
    }

    const owner = commentData.owner
    const commentText = getCommentDataModelCommentText(commentData)
    return {
        id: getCommentDataModelId(commentData),
        ownerId: getCommentDataModelOwnerId(owner),
        ownerUsername: getCommentDataModelOwnerUsername(owner),
        commentText,
        ownerProfilePic: getCommentDataModelProfilePic(owner),
        commentTimestamp: getCommentDataModelCommentTimestamp(commentData),
        mentionsList: getTextUsernames(commentText),
        hashtagsList: getHashtags(commentText),
    }
}

// post comments data
const getPostDataModelCommentsList = (json) => {
    if (!json.edge_media_to_comment || json.edge_media_to_comment === undefined) {
        throw Error('[Post Comments] missing in json')
    }

    if (!json.edge_media_to_comment.edges || json.edge_media_to_comment.edges === undefined) {
        throw Error('[Post Comments Edges] missing in json')
    }

    if (json.edge_media_to_comment.edges.length === 0) {
        return []
    }

    return json.edge_media_to_comment.edges.map(getCommentDataModel)
}

// post caption
const getPostDataModelCaption = (json) => {
    let text = ''
    const caption = json.edge_media_to_caption

    if (!caption || caption === undefined) {
        throw Error('[Post Caption] missing in json')
    }

    if (!caption.edges || caption.edges === undefined) {
        throw Error('[Post Caption Edges] missing in json')
    }

    if (caption.edges.length === 0) {
        return text
    }

    text = caption.edges[0].node.text.toLowerCase()

    return text < 500
        ? text
        : text.slice(0, 500)
}

// post sponsor tagged usernames
const getPostDataModelSponsorsList = (json) => {
    const sponsorTagged = json.edge_media_to_sponsor_user

    if (!sponsorTagged || sponsorTagged === undefined) {
        throw Error('[Post Sponsor Tags] missing in json')
    }

    if (sponsorTagged.edges === undefined) {
        throw Error('[Post Sponsor Tags Egdes] missing in json')
    }

    if (sponsorTagged.edges.length === 0) {
        return []
    }

    return sponsorTagged.edges.map(item => ({
        id: item.node.sponsor.id,
        username: item.node.sponsor.username,
    }))
}

// post on image/video tagged usernames
const getPostDataModelTaggedList = (json, sponsorsList) => {
    const postTagged = json.edge_media_to_tagged_user
    let taggedList = []

    if (!postTagged || postTagged === undefined) {
        throw Error('[Post onPosts Tags] missing in json')
    }

    if (!postTagged.edges || postTagged.edges === undefined) {
        throw Error('[Post onPosts Tags Edges] missing in json')
    }

    if (postTagged.edges.length === 0) {
        return taggedList
    }

    taggedList = postTagged.edges.map(item => ({
        id: getProfileIdFromSponsor(item.node.user.username, sponsorsList),
        username: item.node.user.username.toLowerCase(),
        x: item.node.x,
        y: item.node.y,
    }))

    // collect unique usernames while deduplicating
    const usernames = []

    return taggedList
        .filter((item) => {
            if (usernames.indexOf(item.username) !== -1) {
                return false
            }
            usernames.push(item.username)
            return true
        })
}


// post caption mentions
const getPostDataModelMentionsList = (text, sponsorsList) => {
    const mentions = getTextUsernames(text)

    return mentions.map(mention => ({
        id: getProfileIdFromSponsor(mention, sponsorsList),
        username: mention,
    }))
}

// post owner id
const getPostDataModelOwnerId = (owner) => {
    if (!owner.id || owner.id === undefined) {
        throw Error('[Post Owner Id] missing in json')
    }

    return owner.id
}

// post owner username
const getPostDataModelOwnerUsername = (owner) => {
    if (!owner.username || owner.username === undefined) {
        throw Error('[Post Owner Username] missing in json')
    }

    return owner.username.toLowerCase()
}

// post owner isPublic
const getPostDataModelOwnerIsPublic = (owner) => {
    if (owner.is_private === undefined) {
        throw Error('[Post Owner isPrivate] missing in json')
    }

    if (owner.is_private) {
        return false
    }

    return true
}

// post location
const getPostLocation = (json) => {
    const location = json.location

    if (location === undefined) {
        throw Error('[Post Location] missing in json')
    }

    return json.location
}

// post location id
const getPostDataModelLocationId = (json) => {
    const location = getPostLocation(json)

    if (location === null) {
        return null
    }

    return location.id
}

// post location name
const getPostDataModelLocationName = (json) => {
    const location = getPostLocation(json)

    if (location === null) {
        return ''
    }

    return location.name.toLowerCase()
}

// post timestamp
const getPostDataModelTimestamp = (json) => {
    if (!json.taken_at_timestamp || json.taken_at_timestamp === undefined) {
        throw Error('[Post Timestamp] missing in json')
    }

    return getPostTimestampByDate(json.taken_at_timestamp)
}

// post likes count
const getPostDataModelLikes = (json) => {
    if (!json.edge_media_preview_like || json.edge_media_preview_like === undefined) {
        throw Error('[Post Likes] missing in json')
    }

    if (json.edge_media_preview_like.count === undefined) {
        throw Error('[Post Likes Count] missing in json')
    }

    return json.edge_media_preview_like.count
}

// post comments count
const getPostDataModelComments = (json) => {
    if (!json.edge_media_to_comment || json.edge_media_to_comment === undefined) {
        throw Error('[Post Comments] missing in json')
    }

    if (json.edge_media_to_comment.count === undefined) {
        throw Error('[Post Comments Count] missing in json')
    }

    return json.edge_media_to_comment.count
}

const getPostDataModelPostUrl = (json) => {
    if (!json.display_url || json.display_url === undefined) {
        throw Error('[Post Big Size] missing in json')
    }

    return json.display_url
}

// post thumbnail
const getPostDataModelPostThumbnail = (json) => {
    if (json.display_resources === undefined || json.display_resources.length === 0) {
        throw Error('[Post Thumbnail] missing in json')
    }

    const thumbnail = json.display_resources[0]

    if (!thumbnail.src || thumbnail.src === undefined) {
        throw Error('[Post Thumbnail Src] missing in json')
    }

    return thumbnail.src
}

// post is video
const getPostIsVideo = (json) => {
    if (json.is_video === undefined) {
        throw Error('[Post isVideo] missing in json')
    }

    return json.is_video
}

const getPostDataModelVideoUrl = (json) => {
    const isVideo = getPostIsVideo(json)

    if (!isVideo) {
        return ''
    }

    if (isVideo && json.video_url === undefined) {
        throw Error('[Post videoUrl] missing in json')
    }

    return json.video_url
}

// post type
const getPostDataModelPostType = (json) => {
    const isVideo = getPostIsVideo(json)

    if (isVideo) {
        return 'video'
    }

    return 'image'
}

// post video views
const getPostDataModelVideoViews = (json) => {
    const isVideo = getPostIsVideo(json)

    if (!isVideo) {
        return null
    }

    if (isVideo && json.video_view_count === undefined) {
        throw Error('[Post videViews] missing in json')
    }

    return json.video_view_count
}

// post code
const getPostDataModelCode = (json) => {
    if (!json.shortcode || json.shortcode === undefined) {
        throw Error('[Post Code] missing in json')
    }

    return json.shortcode
}

// post id
const getPostDataModelId = (json) => {
    if (!json.id || json.id === undefined) {
        throw Error('[Post Id] missing in json')
    }

    return json.id
}

// data model
const postDataModel = (json) => {
    if (!json.graphql || json.graphql === undefined) {
        throw Error('[Graphql] missing in json')
    }

    if (!json.graphql.shortcode_media || json.graphql.shortcode_media === undefined) {
        throw Error('[Post Data] missing in json')
    }

    const postData = json.graphql.shortcode_media

    if (!postData.owner || postData.owner === undefined) {
        throw Error('[Post Owner] missing in json')
    }

    const owner = postData.owner
    const caption = getPostDataModelCaption(postData)
    const sponsorsList = getPostDataModelSponsorsList(postData)
    try {
        return {
            id: getPostDataModelId(postData),
            code: getPostDataModelCode(postData),
            postType: getPostDataModelPostType(postData),
            postThumbnail: getPostDataModelPostThumbnail(postData),
            postUrl: getPostDataModelPostUrl(postData),
            videoUrl: getPostDataModelVideoUrl(postData),
            videoViews: getPostDataModelVideoViews(postData),
            comments: getPostDataModelComments(postData),
            likes: getPostDataModelLikes(postData),
            timestamp: getPostDataModelTimestamp(postData),
            locationId: getPostDataModelLocationId(postData),
            locationName: getPostDataModelLocationName(postData),
            ownerId: getPostDataModelOwnerId(owner),
            ownerUsername: getPostDataModelOwnerUsername(owner),
            ownerIsPublic: getPostDataModelOwnerIsPublic(owner),
            caption,
            mentionsList: getPostDataModelMentionsList(caption, sponsorsList),
            sponsorsList,
            taggedList: getPostDataModelTaggedList(postData, sponsorsList),
            commentsList: getPostDataModelCommentsList(postData),
            likesList: getPostDataModelLikesList(postData),
            hashtagsList: getHashtags(caption),
        }
    } catch (err) {
        throw new PostDataModelError(err.message)
    }
}

module.exports = postDataModel
