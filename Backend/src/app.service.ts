import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService, private env: ConfigService) {}

  getRoot(ip: string): any {
    return { ip: ip };
  }
  getTimeData(ip: string): Promise<any> {
    const timeApiUrl = this.env.get<string>('TIME_API_URL');
    return lastValueFrom(
      this.httpService.get<any>(`${timeApiUrl}/${ip}`).pipe(
        map((response) => response.data),
        map((data) => ({
          abbreviation: data.abbreviation,
          timezone: data.timezone,
          datetime: data.datetime,
          day_of_week: data.day_of_week,
          day_of_year: data.day_of_year,
          week_number: data.week_number,
        })),
      ),
    );
  }
  getGeoData(ip: string): Promise<any> {
    const geoApiUrl = this.env.get('GEO_API_URL');
    const geoApiKey = this.env.get('GEO_API_KEY');
    return lastValueFrom(
      this.httpService
        .get<any>(`${geoApiUrl}&ip=${ip}&apiKey=${geoApiKey}`)
        .pipe(
          map((response) => response.data),
          map((data) => ({
            city_name: data.city.name,
            country_name: data.country.name,
          })),
        ),
    );
  }
  getQuoteData(): Promise<any> {
    const quoteApiUrl = this.env.get('QUOTE_API_URL');
    return lastValueFrom(
      this.httpService.get<any>(`${quoteApiUrl}`).pipe(
        map((response) => response.data),
        map((data) => ({
          content: data.content,
          author: data.author,
        })),
      ),
    );
  }
}
