import { Moment } from 'moment';
import { IEmployee } from 'app/shared/model//employee.model';
import { IOnlineOrder } from 'app/shared/model//online-order.model';
import { IVehicle } from 'app/shared/model//vehicle.model';

export interface IDeliveryOrder {
    id?: number;
    deliveryDate?: Moment;
    status?: string;
    warehouseClerk?: IEmployee;
    driver?: IEmployee;
    onlineOrder?: IOnlineOrder;
    vehicle?: IVehicle;
}

export class DeliveryOrder implements IDeliveryOrder {
    constructor(
        public id?: number,
        public deliveryDate?: Moment,
        public status?: string,
        public warehouseClerk?: IEmployee,
        public driver?: IEmployee,
        public onlineOrder?: IOnlineOrder,
        public vehicle?: IVehicle
    ) {}
}
