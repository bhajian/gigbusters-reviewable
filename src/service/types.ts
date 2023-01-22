export interface ReviewableGetParams {
    name: string
}
export interface ReviewableEntity {
    userId: string
    name: string
    ranking: number
}
export interface ReviewableCreateParams {
    userId: string
    name: string
    ranking: number
}

export type ReviewablePutParams = ReviewableEntity
export type ReviewableDeleteParams = ReviewableGetParams
