import { jest } from "@jest/globals";
import clog from "../src/logger";

describe("clog logger", () => {
  let logSpy: ReturnType<typeof jest.spyOn>;
  let dirSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    dirSpy = jest.spyOn(console, "dir").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("logs label and object correctly", () => {
    const data = { name: "john" };

    clog.user(data);

    expect(logSpy).toHaveBeenCalledWith("\n[USER]");
    expect(dirSpy).toHaveBeenCalledWith(data, { depth: null });
  });

  it("logs primitive values correctly", () => {
    clog.status("success");

    expect(logSpy).toHaveBeenCalledWith("\n[STATUS]");
    expect(logSpy).toHaveBeenCalledWith("success");
  });

  it("handles numbers", () => {
    clog.count(123);

    expect(logSpy).toHaveBeenCalledWith("\n[COUNT]");
    expect(logSpy).toHaveBeenCalledWith(123);
  });

  it("handles null safely", () => {
    clog.test(null);

    expect(logSpy).toHaveBeenCalledWith("\n[TEST]");
    expect(logSpy).toHaveBeenCalledWith(null);
  });
});
