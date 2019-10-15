const handler = require('../handler');

let mockedPutPromise = () => {};
let mockedScanPromise = () => {};

jest.mock('aws-sdk', () => ({
  config: {
    setPromisesDependency: jest.fn()
  },
  DynamoDB: {
    DocumentClient: class {
      put() {
        return {
          promise: mockedPutPromise
        };
      }

      scan() {
        return {
          promise: mockedScanPromise
        }
      }
    }
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('test endpoints', () => {
  describe('selftest', () => {
    it('should return success', async () => {
      const res = await handler.selftest.get();
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body).success).toBe(true);
    });
  });

  describe('readings', () => {
    describe('POST', () => {
      it('should return 400 status code if the body is not a valid', async () => {
        const res = await handler.readings.post({ body: '{"test"}' });
        expect(res.statusCode).toBe(400);
      });

      it('should return 400 status code if the temperature is not provided', async () => {
        const res = await handler.readings.post({ body: JSON.stringify({ cough: true, feverInLast5Days: true }) });
        expect(res.statusCode).toBe(400);
      });

      it('should return 400 status code if the temperature is not a human temperature!', async () => {
        const res = await handler.readings.post({ body: JSON.stringify({ temperature: 10, cough: true, feverInLast5Days: true }) });
        expect(res.statusCode).toBe(400);
      });

      it('should return 500 status code if dynamoDB returns an error', async () => {
        mockedPutPromise = () => Promise.reject(new Error('Generic Error'));
        const res = await handler.readings.post({ body: JSON.stringify({ temperature: 37, cough: true, feverInLast5Days: true }) });
        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body)).toEqual({ message: 'Generic Error' });
      });

      it('should return 200 status code and the reading object if successful', async () => {
        mockedPutPromise = () => Promise.resolve();

        const res = await handler.readings.post({ body: JSON.stringify({ temperature: 37, cough: true, feverInLast5Days: true }) });
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual({
          id: expect.stringMatching(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/),
          temperature: 37,
          cough: true,
          feverInLast5Days: true,
          isFlu: false,
          createdAt: expect.any(Number)
        })
      });
    });

    describe('GET', () => {
      it('should return 500 status code if dynamoDB returns an error', async () => {
        mockedScanPromise = () => Promise.reject(new Error('Generic Error'));
        const res = await handler.readings.get();
        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body)).toEqual({ message: 'Generic Error' });
      });

      it('should return 200 status code and an array of readings if successful', async () => {
        const Items = [
          { id: 'item1', temperature: 36, cough: false, feverInLast5Days: false, isFLu: false },
          { id: 'item2', temperature: 38.5, cough: true, feverInLast5Days: true, isFLu: true }
        ];
        mockedScanPromise = () => Promise.resolve({ Items });
        const res = await handler.readings.get();
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual(Items);
      });
    });
  });
});
