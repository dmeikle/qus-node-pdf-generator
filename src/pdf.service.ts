import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class PdfService {
  async render(template: string, data: any): Promise<Uint8Array> {
    // Compile the Handlebars template
    const compiledTemplate: HandlebarsTemplateDelegate = Handlebars.compile(template);
    const htmlContent: string = compiledTemplate(data);

    // Generate PDF using Puppeteer
    const browser: Browser = await puppeteer.launch({ headless: 'shell' });
    const page: Page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer: Uint8Array = await page.pdf({ format: 'A4' });
    await browser.close();

    return pdfBuffer;
  }
}
