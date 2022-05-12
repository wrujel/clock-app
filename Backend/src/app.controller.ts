import { Controller, Post, Body, Header, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get() {
    return { name: 'Clock App API in nestjs', author: 'wrujel' };
  }

  @Post()
  getRoot(@Body('ip') ip: string): any {
    return this.appService.getRoot(ip);
  }

  @Post('api')
  @Header('Content-Type', 'application/json')
  public async getData(@Body('ip') ip: string): Promise<any> {
    const timeData = await this.appService.getTimeData(ip);
    const geoData = await this.appService.getGeoData(ip);
    const quoteData = await this.appService.getQuoteData();
    const res = { ...timeData, ...geoData, ...quoteData };
    console.log(`New query from: ${ip}`);
    console.log('Response data:', res);
    return res;
  }

  @Get('quote')
  @Header('Content-Type', 'application/json')
  public async getQuote(): Promise<any> {
    const quoteData = await this.appService.getQuoteData();
    console.log('New quote query');
    console.log('Response data:', quoteData);
    return quoteData;
  }
}
