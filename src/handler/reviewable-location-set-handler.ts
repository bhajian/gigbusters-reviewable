import {
    Context,
    APIGatewayProxyResult,
    APIGatewayProxyEvent
} from 'aws-lambda';
import {getEventBody, getPathParameter, getSub} from "../lib/utils";
import {Env} from "../lib/env";
import {ReviewableService} from "../service/reviewable-service";
import {LocationEntry} from "../service/reviewable-types";

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
        const location = getEventBody(event) as LocationEntry

        const res = await service.setLocation({
            id: id,
            userId: sub,
        }, location)
        result.body = JSON.stringify({success: true})
    } catch (error) {
        result.statusCode = 500
        result.body = error.message
    }
    return result
}
