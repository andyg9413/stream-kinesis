import {handler} from "../handler";
import {KinesisStreamEvent, KinesisStreamRecord} from "aws-lambda";
import {UserLimitRepository} from "../db/user-limit.repository";
import {IUserLimit} from "../db/user-limit.interface";
import {UserLimit} from "../interfaces/user-limit";


describe('handler', () => {
    const events = require('../events.json');
    let userLimitService: IUserLimit;
    let event: KinesisStreamEvent;
    let record: KinesisStreamRecord;

    beforeEach(() => {
        userLimitService = new UserLimitRepository();

        event = {
            Records: []
        };
        events.forEach((e) => {
            record = {
                kinesis: {
                    data: Buffer.from(JSON.stringify(e)).toString('base64'),
                    partitionKey: '',
                    kinesisSchemaVersion: '',
                    sequenceNumber: '',
                    approximateArrivalTimestamp: 0
                },
                eventSource: '',
                eventVersion: '',
                eventID: '',
                eventName: '',
                invokeIdentityArn: '',
                awsRegion: '',
                eventSourceARN: '',
            }
            event.Records.push(record);
        });
    });

    it('should create a user limit', async () => {
        const testEvent: KinesisStreamEvent = {
            ...event,
            Records: [event.Records[2]],
        };

        await handler(testEvent);

        const userLimits = await userLimitService.getAll();
        expect(userLimits).toHaveLength(1);
            expect(userLimits[0]).toBeDefined();
            expect(userLimits[0].userLimitId).toEqual(events[2].payload.userLimitId);
            expect(userLimits[0].userId).toEqual(events[2].payload.userId);
            expect(userLimits[0].brandId).toEqual(events[2].payload.brandId);
            expect(userLimits[0].currencyCode).toEqual(events[2].payload.currencyCode);
            expect(userLimits[0].type).toEqual(events[2].payload.type);
            expect(userLimits[0].value).toEqual(events[2].payload.value);
            expect(userLimits[0].period).toEqual(events[2].payload.period);
            expect(userLimits[0].activeFrom).toEqual(events[2].payload.activeFrom);
            expect(userLimits[0].nextResetTime).toEqual(events[2].payload.nextResetTime);
            expect(userLimits[0].status).toEqual(events[2].payload.status);
    });

    it('should update a user limit progress', async () => {
        const testEvent: KinesisStreamEvent = {
            ...event,
            Records: [event.Records[5]],
        };
        await handler(testEvent);

        const userLimit = await userLimitService.get(events[5].payload.userLimitId);
        const percentage = (Number(events[5].payload.amount) / (Number(events[5].payload.amount) + Number(events[5].payload.remainingAmount))) * 100;
        expect(userLimit.progress).toEqual(percentage.toString());
    });

    it('should reset a user limit progress', async () => {
        const testEvent: KinesisStreamEvent = {
            ...event,
            Records: [event.Records[12]],
        };
        await handler(testEvent);

        const userLimit = await userLimitService.get(events[12].payload.userLimitId);
        expect(userLimit.progress).toEqual("2");
    });

    it('should log an unknown event type', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        const unknownEvent: KinesisStreamEvent = {
            ...event,
            Records: [event.Records[11]],
        }
        await handler(unknownEvent);

        expect(consoleSpy).toHaveBeenCalledWith('Unknown event type: ' + events[11].type);
    });
});

