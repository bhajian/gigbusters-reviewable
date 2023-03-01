#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ReviewableApiStack } from '../stack/reviewable-api-stack';
import {ReviewableStatefulStack} from "../stack/reviewable-stateful-stack";

const app = new cdk.App();

const reviewableStatefulStack = new ReviewableStatefulStack(
    app, 'ReviewableStatefulStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }})
new ReviewableApiStack(app, 'ReviewableApiStack', {
    reviewableApiStatefulStack: reviewableStatefulStack,
}, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
