export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/assessment/index',
    'pages/result/index',
    'pages/atlas/index',
    'pages/compare/index',
    'pages/review/index',
    'pages/privacy/index',
  ],
  subPackages: [
    {
      root: 'content',
      pages: ['profile/index', 'method/index'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f7f3e9',
    navigationBarTitleText: 'TT16 交易人格十六型',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f7f3e9',
  },
  lazyCodeLoading: 'requiredComponents',
  sitemapLocation: 'sitemap.json',
})
