export interface ReviewableKeyParams {
    uri?: string
    userId: string
}
export interface PhotoEntry {
    photoId: string
    bucket?: string
    key?: string
    type: string
}
export interface LocationEntry {
    locationName: string
    latitude: number
    longitude: number
}
export interface ReviewableEntity {
    uri: string
    userId: string
    type: string
    cumulativeRate: number
    numberOfReviews: number
    claimedBy?: string
    photos: [PhotoEntry]
    location: LocationEntry
    categories: string[]
}
