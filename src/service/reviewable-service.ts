import { DocumentClient, ScanInput } from 'aws-sdk/clients/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import {
    ReviewableCreateParams,
    ReviewableDeleteParams,
    ReviewablePutParams,
    ReviewableEntity,
    ReviewableGetParams
} from "./types";

interface ReviewableServiceProps{
    table: string
}

export class ReviewableService {

    private props: ReviewableServiceProps
    private documentClient = new DocumentClient()

    public constructor(props: ReviewableServiceProps){
        this.props = props
    }

    async list(userId: string): Promise<ReviewableEntity[]> {
        const response = await this.documentClient
            .scan({
                TableName: this.props.table,
                FilterExpression: 'ranking >= :ranking',
                ExpressionAttributeValues: {
                    ':ranking': 0
                },
            }).promise()
        if (response.Items === undefined) {
            return [] as ReviewableEntity[]
        }
        return response.Items as ReviewableEntity[]
    }

    async get(params: ReviewableGetParams): Promise<ReviewableEntity> {
        const response = await this.documentClient
            .get({
                TableName: this.props.table,
                Key: {
                    name: params.name,
                },
            }).promise()
        return response.Item as ReviewableEntity
    }

    async put(params: ReviewablePutParams): Promise<ReviewableEntity> {
        const response = await this.documentClient
            .put({
                TableName: this.props.table,
                Item: params,
            }).promise()
        return params
    }

    async delete(params: ReviewableDeleteParams) {
        const response = await this.documentClient
            .delete({
                TableName: this.props.table,
                Key: {
                    name: params.name,
                },
            }).promise()
    }

}
