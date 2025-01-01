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
      errorCode: "TDD-101",
      statusCode: status,
      description: `SDK API Error -> ${name} -> ${status} -> ${code}`,
    };
  }
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
};

