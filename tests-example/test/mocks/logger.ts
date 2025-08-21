import { AppLogger } from '../../src/logger/logger.service';

const loggerMock: AppLogger = {
  log: jest.fn(),
  error: jest.fn(),
};

export { loggerMock };
