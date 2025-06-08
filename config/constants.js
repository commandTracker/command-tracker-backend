const MESSAGES = {
  SUCCESS: {
    VIDEO_LOAD: "영상 불러오기에 성공하였습니다.",
    VIDEO_REQUEST: "커맨드 분석 요청 성공",
    VIDEO_ANALYSIS: "커맨드 분석 성공",
  },
  ERROR: {
    NOT_FOUND_PAGE: "페이지를 찾을 수 없습니다.",
    SERVER_ERROR: "서버 내부 오류가 발생했습니다.",
    MISSING_REQUIRED_FIELD: "필수 필드가 누락되었습니다.",
    INVALID_URL: "유튜브 링크만 입력이 가능합니다.",
    INVALID_EMAIL: "잘못된 이메일 형식입니다.",
    VIDEO_NOT_FOUND: "해당 영상이 존재하지 않습니다.",
    VIDEO_ANALYSIS: "영상 분석에 실패했습니다.",
    INVALID_TRIM: "trim 범위가 잘못되었습니다.",
  },
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export { MESSAGES, HTTP_STATUS };
