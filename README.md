## MLB-stats backend by AWS cdk

### Application 전체 구조도
![diagram](https://user-images.githubusercontent.com/34852597/193076517-141717da-5656-41f7-adf1-b54768ecab72.png)

### Description

- 메이저리그 dataset 중 하나인 Lehman`s database(https://www.seanlahman.com/baseball-archive/statistics) 를 가공하여 elasticsearch에 bulk insert
- AWS-CDK를 이용하여 Lambda 함수(선수조회, 타격기록조회) 구현 및 Gateway 설정
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
