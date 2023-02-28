import { DocumentClient, ScanInput } from 'aws-sdk/clients/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import {
    ReviewableEntity,
    ReviewableKeyParams
} from "./types";

interface ReviewableServiceProps{
    table: string
    bucket: string
}

export class ReviewableService {

    private props: ReviewableServiceProps
    private documentClient = new DocumentClient()

    public constructor(props: ReviewableServiceProps){
        this.props = props
    }

    async list(userId: string): Promise<ReviewableEntity[]> {
        const response = await this.documentClient
            .query({
                TableName: this.props.table,
                IndexName: 'userIdIndex',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues : {':userId' : userId}
            }).promise()
        if (response.Items === undefined) {
            return [] as ReviewableEntity[]
        }
        return response.Items as ReviewableEntity[]
    }

    async get(params: ReviewableKeyParams): Promise<ReviewableEntity> {
        const response = await this.documentClient
            .get({
                TableName: this.props.table,
                Key: {
                    uri: params.uri,
                },
            }).promise()
        return response.Item as ReviewableEntity
    }

    async put(params: ReviewableEntity): Promise<ReviewableEntity> {
        const response = await this.documentClient
            .put({
                TableName: this.props.table,
                Item: params,
            }).promise()
        console.log(response)
        return params
    }

    async delete(params: ReviewableEntity) {
        const response = await this.documentClient
            .delete({
                TableName: this.props.table,
                Key: {
                    uri: params.uri,
                },
            }).promise()
    }

}
