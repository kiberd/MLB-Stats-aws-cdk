const fs = require("fs").promises;
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
    node: process.env.ELASTICSEARCH_IP,
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
    },
});

const getBattingStats = async (event) => {
    const { playerId } = event.pathParameters;

    const { body } = await client.search({
        index: "record",
        body: {
            query: {
                constant_score: {
                    filter: {
                        term: {
                            "player.playerid": playerId,
                        },
                    },
                },
            },
        },
    });

    let player = {};
    try {
        player = body.hits.hits[0];
    } catch (e) {
        player = { error: "error" };
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(player),
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
    };
    return response;
};

module.exports = { getBattingStats };