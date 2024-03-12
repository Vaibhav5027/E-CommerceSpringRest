import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, of } from "rxjs";
import { Country } from "../common/country";
import { State } from "../common/state";

@Injectable({
  providedIn: "root",
})
export class FormsServices {
  constructor(private httpClient: HttpClient) {}

  getExpireMonth(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getExpireYear(): Observable<number[]> {
    let data: number[] = [];

    let startYear = new Date().getFullYear();
    let endYear = startYear + 10;

    for (let theYear = startYear; theYear < endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
  getCountries(): Observable<Country[]> {
    const coutryUrl = `http://localhost:8081/api/countries`;

    return this.httpClient
      .get<GetCountryResponse>(coutryUrl)
      .pipe(map((response) => response._embedded.countries));
  }
  getStates(countryCode: string): Observable<State[]> {
    const statesUrl = `http://localhost:8081/api/states`;
    return this.httpClient
      .get<GetStatesResponse>(
        `${statesUrl}/search/findByCountryCode?code=${countryCode}`
      )
      .pipe(map((response) => response._embedded.states));
  }
}
interface GetCountryResponse {
  _embedded: {
    countries: Country[];
  };
}
interface GetStatesResponse {
  _embedded: {
    states: State[];
  };
}
