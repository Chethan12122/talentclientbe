export const ApplicationDynamicErrors = {
  VALIDATION_FAILED: (message: string) => {
    return {
      errorCode: "TDD-100",
      statusCode: 400,
      description: `Validation Error -> ${message}`,
    };
  },
  SDK_API_ERROR: (name: string, status: number, code: string) => {
    return {
      errorCode: `TDD-101-` + code,
      statusCode: status,
      description: name,
    };
  },
};

export const ApplicationStaticErrors = {
  SOMETHING_WENT_WRONG: {
    errorCode: "TDS-100",
    statusCode: 500,
    description: "Something went wrong, Please try again",
  },
  INVALID_REGISTER_REQUEST: {
    errorCode: "TDS-101",
    statusCode: 400,
    description: "Invalid register request",
  },
  INVALID_VERIFY_REQUEST: {
    errorCode: "TDS-102",
    statusCode: 400,
    description: "Invalid verify request",
  },
  UNAUTHORIZED: {
    errorCode: "TDS-103",
    statusCode: 401,
    description: "Unauthorized",
  },
  INVALID_LOGIN_REQUEST: {
    errorCode: "TDS-104",
    statusCode: 400,
    description: "Invalid login request",
  },
  USER_ALREADY_EXISTS: {
    errorCode: "TDS-105",
    statusCode: 400,
    description: "User already exists. Please login",
  },
  INVALID_SEASON_REQUEST: {
    errorCode: "TDS-106",
    statusCode: 400,
    description: "Invalid season request",
  },
  INVALID_TEAM_REQUEST: {
    errorCode: "TDS-107",
    statusCode: 400,
    description: "Invalid team request",
  },
  INVALID_GAME_REQUEST: {
    errorCode: "TDS-108",
    statusCode: 400,
    description: "Invalid game request",
  },
  INVALID_GAME_CATEGORY_REQUEST: {
    errorCode: "TDS-109",
    statusCode: 400,
    description: "Invalid game category request",
  },
  INVALID_INSTITUTE_REQUEST: {
    errorCode: "TDS-110",
    statusCode: 400,
    description: "Invalid institute request",
  },
  INVALID_SCORE_REQUEST: {
    errorCode: "TDS-111",
    statusCode: 400,
    description: "Invalid score request",
  },
  INVALID_MANUAL_FIXTURE_REQUEST: {
    errorCode: "TDS-112",
    statusCode: 400,
    description: "Invalid manual fixture request",
  },
  INVALID_FIXTURE_REQUEST: {
    errorCode: "TDS-113",
    statusCode: 400,
    description: "Invalid fixture request",
  },
  INVALID_VENUE_REQUEST: {
    errorCode: "TDS-114",
    statusCode: 400,
    description: "Invalid venue request",
  },
  INVALID_USER_LOGIN_REQUEST: {
    errorCode: "TDS-115",
    statusCode: 400,
    description:
      "Please check if you have required permission to login for this phone number",
  },
  INVALID_GOOGLE_SHEET_ID: {
    errorCode: "TDS-116",
    statusCode: 400,
    description: "Invalid google sheet id/ name",
  },
  NOT_ENOUGH_DATA_IN_GOOGLE_SHEET: {
    errorCode: "TDS-117",
    statusCode: 400,
    description: "Not enough data in google sheet",
  },
  TEAM_NOT_FOUND: {
    errorCode: "TDS-118",
    statusCode: 400,
    description: "Team not found",
  },
  USER_NOT_ASSOCIATED_WITH_INSTITUTE: {
    errorCode: "TDS-119",
    statusCode: 400,
    description:
      "User not associated with institute. Therby cant assign to team",
  },
  INVALID_GAME_CATEGORY: {
    errorCode: "TDS-120",
    statusCode: 400,
    description: "Invalid game category",
  },
  INVALID_FORGOT_PASSWORD_REQUEST: {
    errorCode: "TDS-121",
    statusCode: 400,
    description: "Invalid forgot password request",
  },
  INVALID_RESET_PASSWORD_REQUEST: {
    errorCode: "TDS-122",
    statusCode: 400,
    description: "Invalid reset password request",
  },
  USER_NOT_EXISTS: {
    errorCode: "TDS-123",
    statusCode: 400,
    description: "User not exists",
  },
};
