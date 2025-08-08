export class UtilsService {

  static isUrlAbsolute = (url: string) => url.indexOf('://') > 0 || url.indexOf('//') === 0;

  static officeExtensions = new Set([
    'doc', 'docx', 'dot', 'dotx', // Word
    'xls', 'xlsx', 'xlsm', 'xltx', 'xltm',  // Excel
    'ppt', 'pptx', 'pps', 'ppsx', 'pot', 'potx', // PowerPoint
    'pub', // Publisher
    'vsd', 'vsdx', // Visio
    'odt', 'ods', 'odp', // OpenDocument Text/Spreadsheet/Presentation
    'rtf' // Rich Text Format
  ]);

  static isOfficeFileExtension = (url: string) => {
    const extension = url.split('.').pop().toLowerCase().split(/#|\?/)[0];
    return UtilsService.officeExtensions.has(extension);
  }

  static stringifyError(err: any) {
  if (typeof err === 'string')
    return err;
  if (typeof err === 'object') {
    if (typeof err.error === 'object') {
      return UtilsService.stringifyError(err.error);
    } else if (typeof err.response === 'object' && typeof err.response.toJSON === 'function') {
      return UtilsService.stringifyError(err.response.toJSON()?.body);
    } else {
      return err?.['odata.error']?.message?.value
        ?? err.error_description
        ?? err.error_message
        ?? err.message
        ?? err.error
        ?? JSON.stringify(err);
    }
  }
}
}
