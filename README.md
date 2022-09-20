## AWS-CDK (lambda) 를 이용한 메이저리그 기록 조회용 backend

### Description

- 메이저리그 dataset 중 하나인 Lehman`s database(https://www.seanlahman.com/baseball-archive/statistics) 를 가공하여 elasticsearch에 bulk insert
- AWS-CDK를 이용하여 Lambda 함수(선수조회, 타격기록조회) 구현 및 Endpoint 설정
- Endpoint: https://xvv72dx6xb.execute-api.us-west-2.amazonaws.com/prod

### Routes 

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
