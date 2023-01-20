import {JsonSchemaType} from "aws-cdk-lib/aws-apigateway";

export const postCategorySchema = {
    type: JsonSchemaType.OBJECT,
    required: [
        "type", "uri", "name", "photos", "categories",
        "location", "topics"
    ],
    properties: {
        name: {
            type: JsonSchemaType.STRING
        },
        ranking: {
            type: JsonSchemaType.NUMBER
        },
    },
}

export const putCategorySchema = {
    type: JsonSchemaType.OBJECT,
    required: [
        "id", "type", "uri", "name", "photos", "categories",
        "location", "topics"
    ],
    properties: {
        name: {
            type: JsonSchemaType.STRING
        },
        ranking: {
            type: JsonSchemaType.NUMBER
        },
    },
}
