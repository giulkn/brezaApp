import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IClient } from 'app/shared/model/client.model';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IClient>;
type EntityArrayResponseType = HttpResponse<IClient[]>;

@Injectable({ providedIn: 'root' })
export class ClientService {
    private resourceUrl = SERVER_API_URL + 'api/clients';

    constructor(private http: HttpClient) {}

    create(client: IClient): Observable<EntityResponseType> {
        return this.http.post<IClient>(this.resourceUrl, client, { observe: 'response' });
    }

    update(client: IClient): Observable<EntityResponseType> {
        return this.http.put<IClient>(this.resourceUrl, client, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IClient>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IClient[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
