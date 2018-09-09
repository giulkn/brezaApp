import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPosition } from 'app/shared/model/position.model';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IPosition>;
type EntityArrayResponseType = HttpResponse<IPosition[]>;

@Injectable({ providedIn: 'root' })
export class PositionService {
    private resourceUrl = SERVER_API_URL + 'api/positions';

    constructor(private http: HttpClient) {}

    create(position: IPosition): Observable<EntityResponseType> {
        return this.http.post<IPosition>(this.resourceUrl, position, { observe: 'response' });
    }

    update(position: IPosition): Observable<EntityResponseType> {
        return this.http.put<IPosition>(this.resourceUrl, position, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPosition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPosition[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
