# DynamoDB 테이블 생성 스크립트

이 문서는 사다리 게임 애플리케이션에 필요한 DynamoDB 테이블을 생성하는 AWS CLI 스크립트를 제공합니다.

## 필수 요구사항

- AWS CLI가 로컬 시스템에 설치되어 있어야 합니다.
- AWS 계정에 대한 적절한 IAM 권한이 설정되어 있어야 합니다.

## AWS CLI 설치 (윈도우)

1. AWS CLI를 설치하지 않았다면 [AWS CLI 설치 페이지](https://aws.amazon.com/cli/)에서 설치 파일을 다운로드하여 설치합니다.
2. 설치 후 명령 프롬프트나 PowerShell을 열고 다음 명령어로 설치를 확인합니다:
   ```powershell
   aws --version
   ```
3. AWS 계정 정보를 구성합니다:
   ```powershell
   aws configure
   ```
   - AWS Access Key ID, Secret Access Key, 기본 지역(ap-northeast-2), 출력 형식(json) 순으로 입력합니다.

## DynamoDB 테이블 생성

아래 스크립트를 사용하여 `LadderGames` 테이블을 생성합니다. 이 스크립트는 PowerShell이나 명령 프롬프트에서 실행할 수 있습니다.

### PowerShell에서 실행

```powershell
aws dynamodb create-table `
--table-name LadderGames `
--attribute-definitions `
    AttributeName=id,AttributeType=S `
--key-schema `
    AttributeName=id,KeyType=HASH `
--billing-mode PAY_PER_REQUEST `
--region ap-northeast-2
```

### 명령 프롬프트(CMD)에서 실행

```cmd
aws dynamodb create-table ^
--table-name LadderGames ^
--attribute-definitions ^
    AttributeName=id,AttributeType=S ^
--key-schema ^
    AttributeName=id,KeyType=HASH ^
--billing-mode PAY_PER_REQUEST ^
--region ap-northeast-2
```

## 테이블 생성 확인

테이블이 성공적으로 생성되었는지 확인하려면 다음 명령을 실행합니다:

```powershell
aws dynamodb describe-table --table-name LadderGames --region ap-northeast-2
```

## 테이블 구조 설명

- **테이블 이름**: `LadderGames`
- **기본 키**: `id` (문자열) - 사다리 게임의 고유 식별자
- **데이터 모델**:
  ```json
  {
    "id": "123456789012",              // 사다리 게임 ID (문자열)
    "maxParticipants": 5,              // 최대 참가자 수 (숫자)
    "participants": [                  // 참가자 목록 (배열)
      {
        "name": "홍길동",               // 참가자 이름
        "position": 0                  // 참가자 위치
      }
    ],
    "status": "created",               // 게임 상태 (created, in-progress, complete)
    "createdAt": 1681234567890,        // 생성 시간 (타임스탬프)
    "results": [                       // 게임 결과 (배열)
      {
        "name": "홍길동",
        "startPosition": 0,
        "endPosition": 2
      }
    ]
  }
  ```

## 테이블 삭제 (필요시)

더 이상 테이블이 필요하지 않은 경우 다음 명령으로 삭제할 수 있습니다:

```powershell
aws dynamodb delete-table --table-name LadderGames --region ap-northeast-2
```
