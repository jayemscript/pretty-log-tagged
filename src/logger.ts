type LogValue = unknown;

type Logger = Record<string, (data: LogValue) => void>;

const clog: Logger = new Proxy(
  {},
  {
    get(_, key: string) {
      return (data: LogValue) => {
        const label = key.toUpperCase();

        console.log(`\n[${label}]`);

        if (typeof data === "object" && data !== null) {
          console.dir(data, { depth: null });
        } else {
          console.log(data);
        }
      };
    },
  },
);

export default clog;
