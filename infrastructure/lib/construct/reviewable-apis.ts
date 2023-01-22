import {Construct} from "constructs";
import {GenericDynamoTable} from "../generic/GenericDynamoTable";
import {GenericApi} from "../generic/GenericApi";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {postReviewableSchema, putReviewableSchema} from "./reviewable-schema";
import {CognitoUserPoolsAuthorizer, IResource} from "aws-cdk-lib/aws-apigateway";
import {AuthorizationType} from "@aws-cdk/aws-apigateway";
import config from "../../config/config";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {UserPool} from "aws-cdk-lib/aws-cognito";
import {Bucket} from "aws-cdk-lib/aws-s3";

export interface ApiProps {
    dynamoDBTable: GenericDynamoTable
    s3Bucket: Bucket
}

export interface AuthorizerProps {
    id: string
    authorizerName: string
    identitySource: string
    userPoolArn: string
}

export interface ReviewableApiProps {
    table: Table
    authorizer: CognitoUserPoolsAuthorizer
    rootResource: IResource
    idResource: IResource
}

export class ReviewableApis extends GenericApi {
    private listApi: NodejsFunction
    private getApi: NodejsFunction
    private postApi: NodejsFunction
    private putApi: NodejsFunction
    private deleteApi: NodejsFunction

    public constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id)
        this.initializeApis(props);
        this.initializeDomainName({
            certificateArn: config.apiDomainCertificateArn,
            apiSubdomain: config.apiSubdomain,
            domainNameId: 'domainNameId',
            rootDomain: config.rootDomain,
            ARecordId: 'ARecordId',
            basePath: config.basePath,
            envName: config.envName
        })
    }

    private initializeApis(props: ApiProps){
        const authorizer = this.createAuthorizer({
            id: 'userAuthorizerId',
            authorizerName: 'userAuthorizer',
            identitySource: 'method.request.header.Authorization',
            userPoolArn: config.userPoolArn
        })

        const idResource = this.api.root.addResource('{reviewableId}')
        this.initializeCategoryApis({
            authorizer: authorizer,
            idResource: idResource,
            rootResource: this.api.root,
            table: props.dynamoDBTable.table
        })

    }

    private initializeCategoryApis(props: ReviewableApiProps){
        this.listApi = this.addMethod({
            functionName: 'reviewable-list',
            handlerName: 'reviewable-list-handler.ts',
            verb: 'GET',
            resource: props.rootResource,
            environment: {
                TABLE: props.table.tableName
            },
            validateRequestBody: false,
            authorizationType: AuthorizationType.COGNITO,
            authorizer: props.authorizer
        })

        this.getApi = this.addMethod({
            functionName: 'reviewable-get',
            handlerName: 'reviewable-get-handler.ts',
            verb: 'GET',
            resource: props.idResource,
            environment: {
                TABLE: props.table.tableName
            },
            validateRequestBody: false,
            authorizationType: AuthorizationType.COGNITO,
            authorizer: props.authorizer
        })

        this.postApi = this.addMethod({
            functionName: 'reviewable-post',
            handlerName: 'reviewable-post-handler.ts',
            verb: 'POST',
            resource: props.rootResource,
            environment: {
                TABLE: props.table.tableName
            },
            validateRequestBody: true,
            bodySchema: postReviewableSchema,
            authorizationType: AuthorizationType.COGNITO,
            authorizer: props.authorizer
        })

        this.putApi = this.addMethod({
            functionName: 'reviewable-put',
            handlerName: 'reviewable-put-handler.ts',
            verb: 'PUT',
            resource: props.rootResource,
            environment: {
                TABLE: props.table.tableName
            },
            validateRequestBody: true,
            bodySchema: putReviewableSchema,
            authorizationType: AuthorizationType.COGNITO,
            authorizer: props.authorizer
        })

        this.deleteApi = this.addMethod({
            functionName: 'reviewable-delete',
            handlerName: 'reviewable-delete-handler.ts',
            verb: 'DELETE',
            resource: props.idResource,
            environment: {
                TABLE: props.table.tableName
            },
            validateRequestBody: false,
            authorizationType: AuthorizationType.COGNITO,
            authorizer: props.authorizer
        })

        props.table.grantFullAccess(this.listApi.grantPrincipal)
        props.table.grantFullAccess(this.getApi.grantPrincipal)
        props.table.grantFullAccess(this.postApi.grantPrincipal)
        props.table.grantFullAccess(this.putApi.grantPrincipal)
        props.table.grantFullAccess(this.deleteApi.grantPrincipal)
    }

    protected createAuthorizer(props: AuthorizerProps): CognitoUserPoolsAuthorizer{
        const userPool = UserPool.fromUserPoolArn(this,'userPoolId', props.userPoolArn)
        const authorizer = new CognitoUserPoolsAuthorizer(
            this,
            props.id,
            {
                cognitoUserPools: [userPool],
                authorizerName: props.authorizerName,
                identitySource: props.identitySource
            });
        authorizer._attachToApi(this.api)
        return authorizer
    }

}
