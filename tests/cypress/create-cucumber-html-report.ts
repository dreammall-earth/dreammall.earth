import report from 'multiple-cucumber-html-reporter'

const reportTitle = 'DreamMall End-to-End Test Report'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
report.generate({
  jsonDir: './reports/',
  reportPath: './reports/dreammall-e2e_html_report',
  pageTitle: reportTitle,
  reportName: reportTitle,
  pageFooter: '<div></div>',
  hideMetadata: true,
})
