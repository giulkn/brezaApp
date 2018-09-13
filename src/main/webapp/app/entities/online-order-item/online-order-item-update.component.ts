import { OnlineOrder } from './../../shared/model/online-order.model';
import { OnlineOrderItem } from './../../shared/model/online-order-item.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'app/entities/article';
import { OnlineOrderService } from 'app/entities/online-order';
import { IArticle } from 'app/shared/model/article.model';
import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { OnlineOrderItemService } from './online-order-item.service';

@Component({
    selector: 'jhi-online-order-item-update',
    templateUrl: './online-order-item-update.component.html'
})
export class OnlineOrderItemUpdateComponent implements OnInit {
    private _onlineOrderItem: IOnlineOrderItem;
    isSaving: boolean;
    idd: number;

    onlineorders: IOnlineOrder[];
    articles: IArticle[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderItemService: OnlineOrderItemService,
        private onlineOrderService: OnlineOrderService,
        private articleService: ArticleService,
        private activatedRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ onlineOrderItem }) => {
            this.onlineOrderItem = onlineOrderItem;
        });
        this.route.params.subscribe(params => {
            this.idd = params['nekiId'];
            console.log(this.idd, 'IDD JE')
        });
        this.onlineOrderService.find(this.idd).subscribe(
            (res: HttpResponse<IOnlineOrder>) => {
                this.onlineOrderItem.onlineOrder = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    calculatePrice() {
        if (this.onlineOrderItem.orderedAmount && this.onlineOrderItem.article) {
            this.onlineOrderItem.itemPrice = this.onlineOrderItem.orderedAmount * this.onlineOrderItem.article.price;
        }
    }

    previousState() {
        window.history.back();
    }

    reloadRoute() {
        window.location.reload()
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderItemService.update(this.onlineOrderItem));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderItemService.create(this.onlineOrderItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrderItem>>) {
        result.subscribe((res: HttpResponse<IOnlineOrderItem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(event) {
        this.isSaving = false;
        //this.previousState();
        this.router.navigate(['online-orderr/' + this.idd +'/edit']);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private subscribeToSaveResponse1(result: Observable<HttpResponse<IOnlineOrderItem>>) {
        result.subscribe((res: HttpResponse<IOnlineOrderItem>) => this.onSaveSuccess1(), (res: HttpErrorResponse) => this.onSaveError1());
    }

    private onSaveSuccess1() {
        this.isSaving = false;
        this.router.navigateByUrl('', {skipLocationChange: true}).then(()=>
        this.router.navigate(['online-orderr/' + this.idd +'/online-order-item/new']));
    }

    private onSaveError1() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackOnlineOrderById(index: number, item: IOnlineOrder) {
        return item.id;
    }

    trackArticleById(index: number, item: IArticle) {
        return item.id;
    }

    get onlineOrderItem() {
        return this._onlineOrderItem;
    }

    set onlineOrderItem(onlineOrderItem: IOnlineOrderItem) {
        this._onlineOrderItem = onlineOrderItem;
    }

    next() {
        this.isSaving = true;
        if (this.onlineOrderItem.id !== undefined) {
            this.subscribeToSaveResponse1(this.onlineOrderItemService.update(this.onlineOrderItem));
        } else {
            this.subscribeToSaveResponse1(this.onlineOrderItemService.create(this.onlineOrderItem));
        }
    }

}
