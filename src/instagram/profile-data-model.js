
/* Created a data model like:

{
    id: "987012765",
    picUrl: "https://scontent-arn2-1.cdninstagram.com/vp/798783c843d0d1b04ffd7adf617ffd7a/5B2FE556/t51.2885-19/s150x150/26066734_202771020281020_138210325303394304_n.jpg",
    avgLikes: 1287,
    fullName: "mustafa alfredji",
    isPublic: true,
    picUrlHd: "https://scontent-arn2-1.cdninstagram.com/vp/4490007cbe450c2dd283468d50d47f17/5B44FF5B/t51.2885-19/s320x320/26066734_202771020281020_138210325303394304_n.jpg",
    username: "mustafaalfredji",
    biography: "think differently.\n• malmö, sweden\n• 20 year old. \n• founder & ceo of mysocial",
    followers: 17446,
    emailsList: ['mustafa@mysocial.io'],
    followings: 234,
    isVerified: false,
    postsCount: 386,
    avgComments: 21,
    externalUrl: "http://mysocial.io/",
    estPostPrice: 128,
    avgVideoViews: 4048,
    engagementRate: 0.0738,
    uploadFrequency: 3,
    videoViewsToFollowersRatio: 0.078,
    videoRate: 0.167,
    imageRate: 0.833,
    hashtagsPerPost: 2.023
    allPostsHashtagsList: ['haha', 'foo'],
    mentionsList: ['mysocial'],
    hashtagsList: ['fitness'],
    postsList: [
        {
        id: '1732176804066943028',
        ownerId: '987012765',
        code: "BfoKyhNFOOi",
        likes: 1066,
        caption: "limits only exists in the mind",
        postUrl: "https://scontent-arn2-1.cdninstagram.com/vp/16e843183e8d9748225429c71130bd90/5B102076/t51.2885-15/e35/28152488_713188275736360_7941039667221102592_n.jpg",
        comments: 10,
        postType: 0,
        timestamp: 1519578802000,
        videoViews: null,
        mentionsList: ['kenzas'],
        hashtagsList: ['haha', 'foo'],
        postThumbnail: "https://scontent-arn2-1.cdninstagram.com/vp/7b04f55c5c7fe5df0d46fac969d92ea7/5B44DD13/t51.2885-15/s150x150/e35/28152488_713188275736360_7941039667221102592_n.jpg"
        },
        {...post},
    ],
}

*/

const getErrorOrigin = require('../error/get-origin')
const text2emails = require('./lib/text2emails')
const getPostTimestampByDate = require('./lib/get-post-timestamp-by-date')
const getUploadFrequencyPerWeek = require('./lib/get-upload-frequency-per-week')
const getAvgLikes = require('./lib/get-average-likes')
const getAvgComments = require('./lib/get-average-comments')
const getAvgVideoViews = require('./lib/get-average-video-views')
const getEngagementRate = require('./lib/get-engagement-rate')
const getEstPostPrice = require('./lib/get-estimated-post-price')
const getTextUsernames = require('./lib/get-text-usernames')
const getHashtags = require('./lib/get-hashtags')
const getVideoViewsToFollowersRatio = require('./lib/get-video-views-to-followers-ratio')

class ProfileDataModelError extends Error {
    constructor (message) {
        super()
        Error.captureStackTrace(this)
        this.name = 'profileDataModelError'
        this.message = message
        this.origin = getErrorOrigin(this.stack)
    }
}

// hashtags per post
const profileHashtagsPerPost = (hashtags, posts) => (
    hashtags.length
        ? (hashtags.length / posts.length).toFixed(3) / 1
        : 0
)

// all posts hashtags list
const profileAllPostsHashtagsList = (posts) => {
    const postsHashtags = []
    posts.map(post => post.hashtagsList.map(hashtag => postsHashtags.push(hashtag)))

    return postsHashtags
}

// video rate
const profileVideoRate = (posts) => {
    const postTypes = posts.map(item => item.postType)
    const typeVideo = postTypes.filter(item => item === 1)

    return (typeVideo.length / postTypes.length).toFixed(3)
}

// image rate
const profileImageRate = (posts) => {
    const postTypes = posts.map(item => item.postType)
    const typeImage = postTypes.filter(item => item === 0)

    return (typeImage.length / postTypes.length).toFixed(3)
}

const profileMentionsList = (text, emails) => {
    const usernames = []
    const mentions = getTextUsernames(text)
    const emailsText = emails.join(' ')

    // push mention to usernames array if not indexOf an email
    if (mentions.length !== 0) {
        mentions.map(mention => (
            emailsText.indexOf(mention) === -1
                ? usernames.push(mention)
                : null
        ))
    }

    return usernames
}

// profile media
const getProfileMedia = (json) => {
    if (!json.edge_owner_to_timeline_media || json.edge_owner_to_timeline_media === undefined) {
        throw Error('[Profile Media] missing in json')
    }

    return json.edge_owner_to_timeline_media
}

// post caption
const postDataModelCaption = (json) => {
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

// post video views
const postDataModelVideoViews = (post) => {
    const isVideo = post.is_video

    if (!isVideo) {
        return null
    }

    return post.video_view_count
}

// post type -- 0 = image, 1 = video
const postDataModelPostType = (post) => {
    const isVideo = post.is_video

    if (isVideo) {
        return 1
    }

    return 0
}

// post data model
const postDataModel = (post) => {
    const postData = post.node
    const caption = postDataModelCaption(postData)

    return {
        id: postData.id,
        ownerId: postData.owner.id,
        code: postData.shortcode,
        likes: postData.edge_media_preview_like.count,
        comments: postData.edge_media_to_comment.count,
        timestamp: getPostTimestampByDate(postData.taken_at_timestamp),
        postType: postDataModelPostType(postData),
        postThumbnail: postData.thumbnail_src,
        postUrl: postData.display_url,
        caption,
        videoViews: postDataModelVideoViews(postData),
        mentionsList: getTextUsernames(caption),
        hashtagsList: getHashtags(caption),
    }
}

// profile posts list
const profilePostsList = (media) => {
    if (media.edges.length === 0) {
        return []
    }

    return media.edges.map(postDataModel)
}

// profile picUrlHd
const profilePicUrlHd = (json) => {
    if (json.profile_pic_url_hd === undefined) {
        throw Error('[Profile PicUrlHd] missing in json')
    }

    return json.profile_pic_url_hd
}

// profile picUrl
const profilePicUrl = (json) => {
    if (json.profile_pic_url === undefined) {
        throw Error('[Profile PicUrl] missing in json')
    }

    return json.profile_pic_url
}

// profile isVerified
const profileIsVerified = (json) => {
    if (json.is_verified === undefined) {
        throw Error('[Profile isVerified] missing in json')
    }

    return json.is_verified
}

// profile isPublic
const profileIsPublic = (json) => {
    if (json.is_private === undefined) {
        throw Error('[Profile isPublic] missing in json')
    }

    return !json.is_private
}

// profile fullName
const profileFullName = (json) => {
    let fullName = ''

    if (json.full_name === undefined) {
        throw Error('[Profile FullName] missing in json')
    }

    if (json.full_name === null) {
        return fullName
    }

    fullName = json.full_name.toLowerCase()

    return fullName
}

// profile followings count
const profileFollowings = (json) => {
    if (!json.edge_follow || json.edge_follow === undefined) {
        throw Error('[Profile Followings] missing in json')
    }

    return json.edge_follow.count
}

// profile followers count
const profileFollowers = (json) => {
    if (!json.edge_followed_by || json.edge_followed_by === undefined) {
        throw Error('[Profile Followers] missing in json')
    }

    return json.edge_followed_by.count
}

// profile externalUrl
const profileExternalUrl = (json) => {
    let externalUrl = ''

    if (json.external_url === undefined) {
        throw Error('[Profile ExternalUrl] missing in json')
    }

    if (json.external_url === null || json.external_url.length > 250) {
        return externalUrl
    }

    externalUrl = json.external_url

    return externalUrl
}

// profile biography
const profileBiography = (json) => {
    let biography = ''

    if (json.biography === undefined) {
        throw Error('[Profile Biography] missing in json')
    }

    if (json.biography === null) {
        return biography
    }

    biography = json.biography.toLowerCase()

    return biography
}

// profile username
const profileUsername = (json) => {
    if (json.username === undefined) {
        throw Error('[Profile Username] missing in json')
    }

    return json.username.toLowerCase()
}

// profile id
const profileId = (json) => {
    if (!json.id || json.id === undefined) {
        throw Error('[Profile Id] missing in json')
    }

    return json.id
}

const profileDataModel = (json) => {
    if (!json.graphql || json.graphql === undefined) {
        throw Error('[graphql] missing in json')
    }

    if (!json.graphql.user || json.graphql.user === undefined) {
        throw Error('[profile Data] missing in json')
    }

    const profileData = json.graphql.user

    try {
        const media = getProfileMedia(profileData)
        const postsList = profilePostsList(media)
        // postsList excluding post younger than 2 day
        const postsListShortened = postsList.filter(post =>
            (new Date() - post.timestamp) >= 86400000
        )

        const followers = profileFollowers(profileData)
        const avgLikes = getAvgLikes(postsListShortened)
        const avgComments = getAvgComments(postsListShortened)
        const engagementRate = getEngagementRate(avgLikes, avgComments, followers)
        const biography = profileBiography(profileData)
        const emailsList = text2emails(biography)
        const avgVideoViews = getAvgVideoViews(postsListShortened)
        const allPostsHashtagsList = profileAllPostsHashtagsList(postsList)

        return {
            id: profileId(profileData),
            username: profileUsername(profileData),
            biography,
            followers,
            externalUrl: profileExternalUrl(profileData),
            followings: profileFollowings(profileData),
            fullName: profileFullName(profileData),
            isPublic: profileIsPublic(profileData),
            isVerified: profileIsVerified(profileData),
            picUrl: profilePicUrl(profileData),
            picUrlHd: profilePicUrlHd(profileData),
            postsCount: media.count,
            postsList,
            avgLikes,
            engagementRate,
            videoViewsToFollowersRatio: getVideoViewsToFollowersRatio(avgVideoViews, followers),
            uploadFrequency: getUploadFrequencyPerWeek(postsList),
            avgComments,
            avgVideoViews,
            estPostPrice: getEstPostPrice(followers, avgLikes, engagementRate),
            emailsList,
            mentionsList: profileMentionsList(biography, emailsList),
            hashtagsList: getHashtags(biography),
            videoRate: profileVideoRate(postsList),
            imageRate: profileImageRate(postsList),
            allPostsHashtagsList,
            hashtagsPerPost: profileHashtagsPerPost(allPostsHashtagsList, postsList),
        }
    } catch (err) {
        throw new ProfileDataModelError(err.message)
    }
}

module.exports = profileDataModel
