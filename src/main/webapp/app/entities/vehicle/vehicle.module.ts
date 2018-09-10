import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { BrezaSharedModule } from 'app/shared';
import {
    VehicleComponent,
    VehicleDetailComponent,
    VehicleUpdateComponent,
    VehicleDeletePopupComponent,
    VehicleDeleteDialogComponent,
    vehicleRoute,
    vehiclePopupRoute
} from './';

const ENTITY_STATES = [...vehicleRoute, ...vehiclePopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES), Ng2SmartTableModule],
    declarations: [
        VehicleComponent,
        VehicleDetailComponent,
        VehicleUpdateComponent,
        VehicleDeleteDialogComponent,
        VehicleDeletePopupComponent
    ],
    entryComponents: [VehicleComponent, VehicleUpdateComponent, VehicleDeleteDialogComponent, VehicleDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaVehicleModule {}
