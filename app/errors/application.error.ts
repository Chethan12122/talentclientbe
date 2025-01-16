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
};
