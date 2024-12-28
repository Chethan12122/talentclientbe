export const ApplicationDynamicErrors = {
  VALIDATION_FAILED: (message: string) => {
    return {
      errorCode: "TDD-100",
      statusCode: 400,
      description: `Validation Error -> ${message}`,
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
  }
};

