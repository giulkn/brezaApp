import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from 'app/entities/city';
import { ClientService } from 'app/entities/client';
import { ICity } from 'app/shared/model/city.model';
import { IClient } from 'app/shared/model/client.model';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable, Subscription } from 'rxjs';

import { OnlineOrderService } from './online-order.service';

@Component({
    selector: 'jhi-online-order-update',
    templateUrl: './online-order-update.component.html'
})
export class OnlineOrderUpdateComponent implements OnInit, OnDestroy {
    private _onlineOrder: IOnlineOrder;
    isSaving: boolean;
    isNewForm: boolean;
    eventSubscriber: Subscription;
    eventSubscriber2: Subscription;

    cities: ICity[];
    clients: IClient[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderService: OnlineOrderService,
        private cityService: CityService,
        private clientService: ClientService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager

    ) { }

    ngOnInit() {
        this.eventSubscriber = this.eventManager.subscribe('changeOnlineOrderItem', response => this.save());
        this.eventSubscriber2 = this.eventManager.subscribe('onlineOrderTotalPrice', response => this.onlineOrder.totalPrice = response.content);
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ onlineOrder }) => {
            this.onlineOrder = onlineOrder;
        });
        console.log('test OnlineOrderUpdate ngOnInit() this.router.url:', this.router.url);
        this.isNewForm = this.router.url.includes('new');
        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.cities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.clientService.query().subscribe(
            (res: HttpResponse<IClient[]>) => {
                this.clients = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderService.update(this.onlineOrder));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderService.create(this.onlineOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrder>>) {
        result.subscribe((res: HttpResponse<IOnlineOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.router.navigate(['online-orderr/']);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCityById(index: number, item: ICity) {
        return item.id;
    }

    trackClientById(index: number, item: IClient) {
        return item.id;
    }

    get onlineOrder() {
        return this._onlineOrder;
    }

    set onlineOrder(onlineOrder: IOnlineOrder) {
        this._onlineOrder = onlineOrder;
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.eventManager.destroy(this.eventSubscriber2);
    }
}
