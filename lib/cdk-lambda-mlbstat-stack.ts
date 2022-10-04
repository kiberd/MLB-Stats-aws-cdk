

import * as cdk from "@aws-cdk/core";
import * as ssm from "@aws-cdk/aws-ssm";
import * as lambda from "@aws-cdk/aws-lambda";

const apigateway = require("@aws-cdk/aws-apigateway");

export class CdkLambdaMlbstatStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getBattingStats = new lambda.Function(this, "getBattingStatsLambda", {
      code: new lambda.AssetCode("src"),
      handler: "battingStats.getBattingStats",
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(100),
      environment: {
        ELASTICSEARCH_IP: ssm.StringParameter.valueFromLookup(
          this,
          "ELASTIC_BASEBALL_IP"
        ),
        ELASTICSEARCH_USERNAME: ssm.StringParameter.valueFromLookup(
          this,
          "ELASTIC_BASEBALL_USERNAME"
        ),
        ELASTICSEARCH_PASSWORD: ssm.StringParameter.valueFromLookup(
          this,
          "ELASTIC_BASEBALL_PASSWORD"
        ),
      },
    });

    const searchPlayers = new lambda.Function(this, "searchPlayers", {
      code: new lambda.AssetCode("src"),
      handler: "search.searchPlayers",
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(100),
      environment: {
        ELASTICSEARCH_IP: ssm.StringParameter.valueFromLookup(
          this,
          "ELASTIC_BASEBALL_IP"
        ),
        ELASTICSEARCH_USERNAME: ssm.StringParameter.valueFromLookup(
          this,
          "ELASTIC_BASEBALL_USERNAME"
        ),
        ELASTICSEARCH_PASSWORD: ssm.StringParameter.valueFromLookup(
          this,
          "ELASTIC_BASEBALL_PASSWORD"
        ),
      },
    });

    
    const api = new apigateway.RestApi(this, "baseballAPI", {
      restApiName: "Baseball Stats REST API",
    });

    const batting = api.root.addResource("batting");
    const getBatting = batting.addResource("{playerId}");
    addCorsOptions(batting);
    addCorsOptions(getBatting);
    
    const search = api.root.addResource("search");
    addCorsOptions(search);

    const getBattingIntegration = new apigateway.LambdaIntegration(
      getBattingStats
    );
    const searchPlayersIntegration = new apigateway.LambdaIntegration(
      searchPlayers
    );

    getBatting.addMethod("GET", getBattingIntegration);
    search.addMethod("POST", searchPlayersIntegration);
  }
}

export function addCorsOptions(apiResource: any) {
  apiResource.addMethod(
    "OPTIONS",
    new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
