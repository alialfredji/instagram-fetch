/*
    receives the json from the fetch response
    
*/

const getErrorOrigin = require('../../error/get-origin')
const text2emails = require('../lib/text2emails')
const getUploadFrequency = require('../lib/get-upload-frequency')
const getAvgLikes = require('../lib/get-average-likes')
const getAvgComments = require('../lib/get-average-comments')
const getAvgVideoViews = require('../lib/get-average-video-views')
const getEngagementRate = require('../lib/get-engagement-rate')
const getTextUsernames = require('../lib/get-text-usernames')
const getHashtags = require('../lib/get-hashtags')
const getVideoViewsToFollowersRatio = require('../lib/get-video-views-to-followers-ratio')

class ProfileDataModelError extends Error {
    constructor (message) {
        super()
        Error.captureStackTrace(this)
        this.name = 'profileDataModelError'
        this.message = message
        this.origin = getErrorOrigin(this.stack)
    }
}

// all posts hashtags list
const profileAllPostsHashtagsList = (posts) => {
    const postsHashtags = []
    posts.map(post => post.hashtagsList.map(hashtag => postsHashtags.push(hashtag)))
    return postsHashtags
}

// video rate
const dataModelVideoRate = (posts) => {
    const postTypes = posts.map(item => item.type)
    const typeVideo = postTypes.filter(item => item === 'video')

    return (typeVideo.length / postTypes.length).toFixed(3) / 1
}

// image rate
const dataImageRate = (posts) => {
    const postTypes = posts.map(item => item.type)
    const typeImage = postTypes.filter(item => item === 'image')

    return (typeImage.length / postTypes.length).toFixed(3) / 1
}

const dataModelMentionsList = (text, emails) => {
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

// post data model
const postDataModel = (post) => {
    const data = post.node
    const caption = data.edge_media_to_caption.edges.length === 0
        ? ''
        : data.edge_media_to_caption.edges[0].node.text.toLowerCase()

    return {
        id: data.id,
        ownerId: data.owner.id,
        ownerUsername: data.owner.username,
        code: data.shortcode,
        likes: data.edge_media_preview_like.count,
        comments: data.edge_media_to_comment.count,
        timestamp: data.taken_at_timestamp * 1000,
        type: data.is_video ? 'video' : 'image',
        thumbnail: data.thumbnail_src,
        displayUrl: data.display_url,
        caption,
        videoViews: data.video_view_count ? data.video_view_count : null,
        mentionsList: getTextUsernames(caption),
        hashtagsList: getHashtags(caption),
    }
}

const dataModelBusinessAddress = (json) => {
    if (!json.is_business_account) {
        return null
    }

    const IGAddress = JSON.parse(json.business_address_json)
    const address = {}
    address.streetAddress = IGAddress.street_address
    address.zipCode = IGAddress.zip_code
    address.cityName = IGAddress.city_name
    address.regionName = IGAddress.region_name
    address.countryCode = IGAddress.country_code

    return address
}

const profileDataModel = (json) => {
    const data = json.graphql.user

    try {
        const media = data.edge_owner_to_timeline_media
        const postsList = media.edges.length === 0 ? [] : media.edges.map(postDataModel)
        // postsList excluding post younger than 2 day
        const postsListShortened = postsList.filter(post =>
            (new Date() - post.timestamp) >= 86400000
        )

        const followers = data.edge_followed_by.count
        const avgLikes = getAvgLikes(postsListShortened)
        const avgComments = getAvgComments(postsListShortened)
        const engagementRate = getEngagementRate(avgLikes, avgComments, followers)
        const biography =  data.biography === null ? '' : data.biography.toLowerCase()
        const emailsList = text2emails(biography)
        const avgVideoViews = getAvgVideoViews(postsListShortened)
        const allPostsHashtagsList = profileAllPostsHashtagsList(postsList)
        const uploads = getUploadFrequency(postsList)
        
        return {
            id: data.id,
            username: data.username.toLowerCase(),
            biography,
            followers,
            externalUrl: data.external_url,
            followings: data.edge_follow.count,
            fullName: data.full_name === null ? '' : data.full_name.toLowerCase(),
            isPublic: data.is_private === false,
            isVerified: data.is_verified,
            picUrl: data.profile_pic_url,
            picUrlHd: data.profile_pic_url_hd,
            isBusinessAccount: data.is_business_account,
            businessCategory: data.business_category_name,
            businessEmail: data.business_email,
            businessPhone: data.business_phone_number,
            businessAddress: dataModelBusinessAddress(data),
            postsCount: media.count,
            postsList,
            avgLikes,
            engagementRate,
            videoViewsToFollowersRatio: getVideoViewsToFollowersRatio(avgVideoViews, followers),
            uploadsWeek: uploads.week,
            uploadsMonth: uploads.month, 
            avgComments,
            avgVideoViews,
            emailsList,
            mentionsList: dataModelMentionsList(biography, emailsList),
            hashtagsList: getHashtags(biography),
            videoRate: dataModelVideoRate(postsList),
            imageRate: dataImageRate(postsList),
            allPostsHashtagsList,
            hashtagsPerPost: allPostsHashtagsList.length
                ? (allPostsHashtagsList.length / postsList.length).toFixed(3) / 1
                : 0,
        }
    } catch (err) {
        throw new ProfileDataModelError(err)
    }
}

module.exports = profileDataModel
