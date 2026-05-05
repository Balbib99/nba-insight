const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  info(message: string, ...optionalParams: unknown[]) {
    if (!isProduction) {
      console.log(message, ...optionalParams);
    }
  },
  warn(message: string, ...optionalParams: unknown[]) {
    console.warn(message, ...optionalParams);
  },
  error(message: string, ...optionalParams: unknown[]) {
    console.error(message, ...optionalParams);
  },
};
