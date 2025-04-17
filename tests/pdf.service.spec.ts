import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from '../src/pdf.service';
import * as Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
//mock puppeteer
jest.mock('puppeteer');

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should compile the Handlebars template correctly', async () => {
    const template = '<h1>{{title}}</h1>';
    const data = { title: 'Test PDF' };
    const compiledTemplate = Handlebars.compile(template);
    const result = compiledTemplate(data);

    expect(result).toBe('<h1>Test PDF</h1>');
  });

  it('should generate a PDF using Puppeteer', async () => {
    const mockPdfBuffer = new Uint8Array([1, 2, 3]);
    const mockPage = {
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(mockPdfBuffer),
      close: jest.fn(),
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const template = '<h1>{{title}}</h1>';
    const data = { title: 'Test PDF' };
    const pdfBuffer = await service.render(template, data);

    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: 'shell' });
    expect(mockBrowser.newPage).toHaveBeenCalled();
    expect(mockPage.setContent).toHaveBeenCalledWith('<h1>Test PDF</h1>', { waitUntil: 'networkidle0' });
    expect(mockPage.pdf).toHaveBeenCalledWith({ format: 'A4' });
    expect(mockBrowser.close).toHaveBeenCalled();
    expect(pdfBuffer).toEqual(mockPdfBuffer);
  });
});