const getErrorOrigin = require('../../error/get-origin')
const getTextUsernames = require('../lib/get-text-usernames')
const getProfileIdFromSponsor = require('../lib/get-profile-id-from-sponsor')
const getHashtags = require('../lib/get-hashtags')

class PostDataModelError extends Error {
    constructor (message) {
        super()
        Error.captureStackTrace(this)
        this.name = 'PostDataModelError'
        this.message = message
        this.origin = getErrorOrigin(this.stack)
    }
}

// post comment text
const dataModelCommentText = (json) => {
    if (json.text === undefined) throw Error('[Post Comment Text] missing in json')
    if (json.text === null) return ''
    return json.text.toLowerCase()
}

// post comment data
const dataModelComment = (json) => {
    if (json.node === undefined) throw Error('[Post Comment Node] missing in json')
    if (json.node.owner === undefined) throw Error('[Post Comment Owner] missing in json')

    const text = dataModelCommentText(json.node)
    return {
        text,
        ownerId: json.node.owner.id,
        ownerUsername: json.node.owner.username.toLowerCase(),
        ownerPic: json.node.owner.profile_pic_url,
        commentTimestamp: json.node.created_at ? json.node.created_at * 1000 : null,
        mentionsList: getTextUsernames(text),
        hashtagsList: getHashtags(text),
    }
}

// post comments data
const dataModelCommentsList = (json) =>
    json.edge_media_to_comment.edges.length === 0
        ? []
        : json.edge_media_to_comment.edges.map(dataModelComment)

// post caption
const dataModelCaption = (json) =>
    json.edge_media_to_caption.edges.length === 0
        ? ''
        : json.edge_media_to_caption.edges[0].node.text.toLowerCase()

// post likes data
const dataModelLikesList = (json) =>
    json.edge_media_preview_like.edges.length === 0
        ? []
        : json.edge_media_preview_like.edges.map(item => ({
            id: item.node.id,
            username: item.node.username.toLowerCase(),
            pic: item.node.profile_pic_url,
        }))

// post sponsor tagged usernames
const dataModelSponsorsList = (json) =>
    json.edge_media_to_sponsor_user.edges.length === 0
        ? []
        : sponsorTagged.edges.map(item => ({
            id: item.node.sponsor.id,
            username: item.node.sponsor.username.toLowerCase(),
        }))

// post on image/video tagged usernames
const dataModelTaggedList = (json, sponsorsList) => {
    if (json.edge_media_to_tagged_user.edges.length === 0) {
        return []
    }

    const taggedList = json.edge_media_to_tagged_user.edges.map(item => ({
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
const dataModelMentionsList = (text, sponsorsList) =>
    getTextUsernames(text).map(mention => ({
        id: getProfileIdFromSponsor(mention, sponsorsList),
        username: mention.toLowerCase(),
    }))

const dataModelLocationAddress = (location) => {
    const IGAddress = JSON.parse(location.address_json)
    let address = {}
    address.streetAddress = IGAddress.street_address.toLowerCase()
    address.zipCode = IGAddress.zip_code.toLowerCase()
    address.cityName = IGAddress.city_name.toLowerCase()
    address.regionName = IGAddress.region_name.toLowerCase()
    address.countryCode = IGAddress.country_code.toLowerCase()
    return address
}

// data model
const postDataModel = (json) => {
    const data = json.graphql.shortcode_media
    const caption = dataModelCaption(data)
    const sponsorsList = dataModelSponsorsList(data)

    try {
        return {
            id: data.id,
            code: data.shortcode,
            type: data.is_video ? 'video' : 'image',
            thumbnail: data.display_resources.length  ? data.display_resources[0].src : null,
            displayUrl: data.display_url,
            videoUrl: data.video_url ? data.video_url : null,
            videoViews: data.video_view_count ? data.video_view_count : null,
            commentsCount: data.edge_media_to_comment.count,
            likesCount: data.edge_media_preview_like.count,
            timestamp: data.taken_at_timestamp * 1000,
            locationName: data.location ? data.location.name.toLowerCase() : null,
            locationSlug: data.location ? data.location.slug.toLowerCase() : null,
            locationAddress: data.location ? dataModelLocationAddress(data.location) : null,
            caption,
            mentionsList: dataModelMentionsList(caption, sponsorsList),
            sponsorsList,
            taggedList: dataModelTaggedList(data, sponsorsList),
            commentsList: dataModelCommentsList(data),
            likesList: dataModelLikesList(data),
            hashtagsList: getHashtags(caption),
            ownerFullName: data.owner.full_name,
            ownerId: data.owner.id,
            ownerUsername: data.owner.username.toLowerCase(),
            ownerPic: data.owner.profile_pic_url,
            ownerIsPublic: data.owner.is_private === false,
            ownerIsVerified: data.owner.is_verified,
        }
    } catch (err) {
        throw new PostDataModelError(err.message)
    }
}

module.exports = postDataModel
