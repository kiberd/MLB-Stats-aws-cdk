## AWS-CDK (lambda) 를 이용한 REST-API 

### Routes (https://xvv72dx6xb.execute-api.us-west-2.amazonaws.com/prod)

1. GET /batting/{playerid}

- 해당하는 player id 타격기록 조회

2. POST /search

- 해당하는 player 정보 조회

```json

{
    "name_input": "ChanHo Park", 
    "result_size": 20,
    "starting_index": 0
}


```
