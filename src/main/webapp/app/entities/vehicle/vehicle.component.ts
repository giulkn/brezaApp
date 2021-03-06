import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IVehicle, Vehicle } from 'app/shared/model/vehicle.model';
import { Principal } from 'app/core';
import { VehicleService } from './vehicle.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-vehicle',
    templateUrl: './vehicle.component.html'
})

export class VehicleComponent implements OnInit, OnDestroy {
    vehicles: IVehicle[];
    currentAccount: any;
    eventSubscriber: Subscription;

    settings = {
        mode: 'inline',
        actions: {
            columnTitle: '',
            add: true,
            edit: true,
            delete: false,
            custom: [
                {
                    name: 'view',
                    title: 'View '
                },
                {
                    name: 'delete',
                    title: 'Delete '
                }
            ]
        },
        add: {
            confirmCreate: true, // triggers createConfirm event
        },
        edit: {
            confirmSave: true, // triggers editConfirm event
        },
        columns: {
            id: {
                title: 'ID',
                editable: false,
                addable: false
            },
            vehicle_number: {
                title: 'Vehicle Number'
            },
            brand: {
                title: 'Brand'
            },
            model: {
                title: 'Model'
            }
        },
        attr: {
            class: 'table table-bordered table-success'
        }
    };

    data: LocalDataSource;

    constructor(
        private vehicleService: VehicleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) { }

    loadAll() {
        this.vehicleService.query().subscribe(
            (res: HttpResponse<IVehicle[]>) => {
                this.vehicles = res.body;
                this.data = new LocalDataSource(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInVehicles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IVehicle) {
        return item.id;
    }

    registerChangeInVehicles() {
        this.eventSubscriber = this.eventManager.subscribe('vehicleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    onCustom(event) {
        if (event.action === 'view') {
            this.router.navigate(['vehicle/' + event.data.id + '/view']);
        } else if (event.action === 'delete') {
            this.router.navigate([{ outlets: { popup: 'vehicle/' + event.data.id + '/delete' } }]);
        }
    }
    onAdd(event) {
        console.log('test VehicleComponent onAdd() event:', event);
        const item: Vehicle = event.newData;
        if (!this.isInputValid(item)) {
            event.confirm.reject(); // cannot save and must click the cancel button
        } else {
            this.save(item);
            event.confirm.resolve(item); // updates table and localDataSource
        }
    }
    onEdit(event) {
        console.log('test VehicleComponent onEdit() event:', event);
        const item: Vehicle = event.newData;
        if (!this.isInputValid(item)) {
            event.confirm.reject();
        } else {
            this.save(item);
            event.confirm.resolve(item);
        }
    }

    isInputValid(item): boolean {
        console.log('test VehicleComponent isInputValid() vehicle:', item);
        if (!item.vehicleNumber || !item.brand || !item.model) {
            console.log('input is invalid');
            return false;
        } else if (item.brand.charAt(0) !== item.brand.charAt(0).toUpperCase()) {
            return false;
        } else if (item.model.charAt(0) !== item.model.charAt(0).toUpperCase()) {
            return false;
        }
        for (let i = item.vehicleNumber.length - 1; i > item.vehicleNumber.length - 4; i--) {
            if (isNaN(item.vehicleNumber.charAt(i))) {
                return false;
            }
        }
        console.log('input is valid');
        return true;
    }

    save(item: Vehicle) {
        if (item.id) {
            this.subscribeToSaveResponse(this.vehicleService.update(item));
        } else {
            this.subscribeToSaveResponse(this.vehicleService.create(item));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVehicle>>) {
        result.subscribe((res: HttpResponse<IVehicle>) => {
            this.onSaveSuccess(res.body);
        }, (err: HttpErrorResponse) => this.onSaveError(err));
    }

    private onSaveSuccess(item: IVehicle) {
        console.log('test VehicleComponent onSaveSuccess() item:', item);
    }

    private onSaveError(err: HttpErrorResponse) {
        console.log('test VehicleComponent onSaveError() ERROR:', err);
    }

}
