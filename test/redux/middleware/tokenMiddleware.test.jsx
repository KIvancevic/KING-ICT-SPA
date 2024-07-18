import { describe, it, expect, vi, beforeEach } from "vitest";
import tokenMiddleware from "../../../src/redux/middleware/tokenMiddleware";
import { refreshToken } from "../../../src/redux/actions/userActions";
import { jwtDecode } from "jwt-decode";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));
vi.mock("../../../src/redux/actions/userActions", () => ({
  refreshToken: vi.fn(),
}));

describe("tokenMiddleware", () => {
  let next, dispatch, getState, mockJwtDecode, mockRefreshToken;

  beforeEach(() => {
    next = vi.fn();
    dispatch = vi.fn(() => Promise.resolve());
    getState = vi.fn(() => ({
      user: {
        token: "valid-token",
      },
    }));

    mockJwtDecode = jwtDecode;
    mockRefreshToken = refreshToken;

    mockJwtDecode.mockClear();
    mockRefreshToken.mockClear();
  });

  it("should call next if token is not expired", () => {
    mockJwtDecode.mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 10000,
    });
    const action = { type: "TEST_ACTION" };

    tokenMiddleware({ dispatch, getState })(next)(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("should dispatch refreshToken if token is expired", async () => {
    mockJwtDecode.mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 10000,
    });
    dispatch.mockReturnValue(Promise.resolve());

    const action = { type: "TEST_ACTION" };

    await tokenMiddleware({ dispatch, getState })(next)(action);

    expect(dispatch).toHaveBeenCalledWith(refreshToken());
    expect(next).toHaveBeenCalledWith(action);
  });

  it("should handle refresh token failure", async () => {
    mockJwtDecode.mockReturnValue({
      exp: Math.floor(Date.now() / 1000) - 10000,
    });
    dispatch.mockReturnValue(Promise.reject("Refresh failed"));

    const action = { type: "TEST_ACTION" };

    try {
      await tokenMiddleware({ dispatch, getState })(next)(action);
    } catch (error) {}

    expect(dispatch).toHaveBeenCalledWith(refreshToken());
    expect(next).not.toHaveBeenCalled();
  });

  it("should treat invalid tokens as expired", async () => {
    mockJwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const action = { type: "TEST_ACTION" };

    await tokenMiddleware({ dispatch, getState })(next)(action);

    expect(dispatch).toHaveBeenCalledWith(refreshToken());
    expect(next).toHaveBeenCalledWith(action);
  });
});
