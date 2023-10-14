import {KinesisStreamEvent, KinesisStreamRecord} from 'aws-lambda';
import {EventPayload, PayloadType} from "./interfaces/event-payload";
import {IUserLimit} from "./db/user-limit.interface";
import {inject} from './container';

const userLimitService: IUserLimit = inject('userLimitService');

export const handler = async (event: KinesisStreamEvent): Promise<void> => {

  event.Records.forEach((record: KinesisStreamRecord) => {
    const eventPayload: EventPayload = JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString('utf-8'));
    switch (eventPayload.type) {
      case PayloadType.USER_LIMIT_CREATED:
        userLimitService.create({...eventPayload.payload, progress: '0'});
        break;
      case PayloadType.USER_LIMIT_PROGRESS_CHANGED:
        const amount: string = eventPayload.payload.amount;
        const remainingAmount: string = eventPayload.payload.remainingAmount;
        const percentage: number = (Number(amount) / (Number(amount) + Number(remainingAmount))) * 100;
        userLimitService.update(eventPayload.payload.userLimitId, { progress: percentage.toString() });
        break;
      case PayloadType.USER_LIMIT_RESET:
        const resetPercentage: string = eventPayload.payload.resetPercentage;
        const progress: string = userLimitService.get(eventPayload.payload.userLimitId).progress;
        const percentageReset: number = Number(progress) - Number(resetPercentage);
        userLimitService.update(eventPayload.payload.userLimitId, { progress: percentageReset.toString() });
        break;
      default:
        console.log(`Unknown event type: ${eventPayload.type}`);
    }
  });
};
