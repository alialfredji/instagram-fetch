
const getProfileIdFromSponsor = (username, sponsorList) => {
    let profileId = null

    if (sponsorList.length === 0) {
        return profileId
    }

    sponsorList.map((sponsor) => // eslint-disable-line
        sponsor.username.indexOf(username) !== -1
            ? profileId = sponsor.id
            : null
    )

    return profileId
}

module.exports = getProfileIdFromSponsor
