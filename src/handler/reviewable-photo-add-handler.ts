import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {getEventBody, getPathParameter, getSub} from "../lib/utils";
import {Env} from "../lib/env";
import {ReviewableService} from "../service/reviewable-service";
import {PhotoEntry} from "../service/reviewable-types";

const table = Env.get('TABLE')
const bucket = Env.get('IMAGE_BUCKET')
const service = new ReviewableService({
    table: table,
    bucket: bucket
})

export async function handler(event: APIGatewayProxyEvent, context: Context):
    Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*'
        },
        body: 'Empty!'
    }
    try {
        const id = getPathParameter(event, 'id')
        const sub = getSub(event)
        const item = getEventBody(event) as PhotoEntry

        const newPhoto = await service.addPhoto({
            id: id,
            userId: sub,
        }, item)
        result.body = JSON.stringify(newPhoto)
    } catch (error) {
        result.statusCode = 500
        result.body = error.message
    }
    return result
}
