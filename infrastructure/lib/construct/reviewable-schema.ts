import {JsonSchemaType} from "aws-cdk-lib/aws-apigateway";

export const postReviewableSchema = {
    type: JsonSchemaType.OBJECT,
    required: [
        "type", "uri",
        // "name", "photos", "categories",
        // "location", "topics"
    ],
    properties: {
        type: {
            type: JsonSchemaType.STRING
        },
        uri: {
            type: JsonSchemaType.STRING
        },
    },
}

export const putReviewableSchema = {
    type: JsonSchemaType.OBJECT,
    required: [
        "id", "type", "uri",
        // "name", "photos", "categories",
        // "location", "topics"
    ],
    properties: {
        id: {
            type: JsonSchemaType.STRING
        },
        type: {
            type: JsonSchemaType.STRING
        },
        uri: {
            type: JsonSchemaType.STRING
        },
    },
}
