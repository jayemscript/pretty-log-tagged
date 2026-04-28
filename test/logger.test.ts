import { jest } from "@jest/globals";
import { createLogger, clog, DEFAULT_TAGS } from "../src/index";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function captureConsole() {
  const calls: { method: string; args: unknown[] }[] = [];

  const methods = ["log", "info", "warn", "error", "debug"] as const;
  const originals = Object.fromEntries(
    methods.map((m) => [m, console[m]]),
  ) as Record<string, (...args: unknown[]) => void>;

  methods.forEach((m) => {
    jest.spyOn(console, m).mockImplementation((...args: unknown[]) => {
      calls.push({ method: m, args });
    });
  });

  return {
    calls,
    restore: () =>
      methods.forEach((m) => ((console[m] as unknown) = originals[m])),
  };
}

// ─── createLogger ─────────────────────────────────────────────────────────────

describe("createLogger()", () => {
  it("returns an object (proxy)", () => {
    const log = createLogger();
    expect(log).toBeDefined();
    expect(typeof log).toBe("object");
  });

  it("exposes log functions for any tag via dot notation", () => {
    const log = createLogger({ silent: true });
    expect(typeof log.user).toBe("function");
    expect(typeof log.error).toBe("function");
    expect(typeof log.anythingAtAll).toBe("function");
  });
});

// ─── silent mode ──────────────────────────────────────────────────────────────

describe("silent mode", () => {
  it("suppresses all output when silent: true", () => {
    const cap = captureConsole();
    const log = createLogger({ silent: true });
    log.user("test");
    log.error("test");
    log.info("test");
    expect(cap.calls).toHaveLength(0);
    cap.restore();
  });
});

// ─── Built-in tags ─────────────────────────────────────────────────────────

describe("built-in tags", () => {
  it("routes `warn` to console.warn", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.warn("watch out");
    expect(cap.calls.find((c) => c.method === "warn")).toBeDefined();
    cap.restore();
  });

  it("routes `error` to console.error", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.error("something broke");
    expect(cap.calls.find((c) => c.method === "error")).toBeDefined();
    cap.restore();
  });

  it("routes `info` to console.info", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.info("fyi");
    expect(cap.calls.find((c) => c.method === "info")).toBeDefined();
    cap.restore();
  });

  it("routes `debug` to console.debug", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.debug("verbose info");
    expect(cap.calls.find((c) => c.method === "debug")).toBeDefined();
    cap.restore();
  });
});

// ─── Dot notation / dynamic tags ────────────────────────────────────────────

describe("dot notation (dynamic tags)", () => {
  it("clog.user(data) logs without throwing", () => {
    const cap = captureConsole();
    expect(() => clog.user({ id: 1, name: "Jay" })).not.toThrow();
    expect(cap.calls.length).toBeGreaterThan(0);
    cap.restore();
  });

  it("clog.payment(data) works for domain-specific tags", () => {
    const cap = captureConsole();
    expect(() =>
      clog.payment({ amount: 99.99, currency: "USD" }),
    ).not.toThrow();
    expect(cap.calls.length).toBeGreaterThan(0);
    cap.restore();
  });

  it("any unknown tag still produces output (uses default style)", () => {
    const cap = captureConsole();
    const log = createLogger();
    expect(() => log.brandNewTag("hello")).not.toThrow();
    expect(cap.calls.length).toBeGreaterThan(0);
    cap.restore();
  });

  it("tag label appears uppercased in the output", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.user("test");
    const output = cap.calls[0]?.args[0] as string;
    expect(output).toContain("USER");
    cap.restore();
  });
});

// ─── Data formatting ─────────────────────────────────────────────────────────

describe("data formatting", () => {
  it("formats plain strings", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.info("hello world");
    const output = cap.calls[0]?.args[0] as string;
    expect(output).toContain("hello world");
    cap.restore();
  });

  it("formats numbers", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.debug(42);
    const output = cap.calls[0]?.args[0] as string;
    expect(output).toContain("42");
    cap.restore();
  });

  it("formats objects as JSON", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.db({ table: "users", rows: 5 });
    const output = cap.calls[0]?.args[0] as string;
    expect(output).toContain("users");
    cap.restore();
  });

  it("formats multiple args in one call", () => {
    const cap = captureConsole();
    const log = createLogger();
    log.server("Request from", "127.0.0.1", "port", 3000);
    const output = cap.calls[0]?.args[0] as string;
    expect(output).toContain("Request from");
    expect(output).toContain("127.0.0.1");
    cap.restore();
  });
});

// ─── Custom tags ──────────────────────────────────────────────────────────────

describe("custom tags via options.tags", () => {
  it("uses custom tag config for color/level", () => {
    const cap = captureConsole();
    const log = createLogger({
      tags: {
        stripe: { fg: "black", bg: "brightGreen", level: "log" },
      },
    });
    log.stripe({ amount: 9.99 });
    const output = cap.calls[0]?.args[0] as string;
    expect(output).toContain("STRIPE");
    cap.restore();
  });

  it("custom tag routes to the specified console level", () => {
    const cap = captureConsole();
    const log = createLogger({
      tags: {
        critical: { fg: "white", bg: "red", level: "error" },
      },
    });
    log.critical("system down");
    expect(cap.calls.find((c) => c.method === "error")).toBeDefined();
    cap.restore();
  });
});

// ─── DEFAULT_TAGS export ──────────────────────────────────────────────────────

describe("DEFAULT_TAGS", () => {
  it("is an object with at least the common tags", () => {
    const expected = [
      "info",
      "warn",
      "error",
      "debug",
      "user",
      "auth",
      "db",
      "api",
    ];
    expected.forEach((tag) => {
      expect(DEFAULT_TAGS).toHaveProperty(tag);
    });
  });
});