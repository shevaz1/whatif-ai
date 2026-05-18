import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // TODO: 앱인토스 콘솔에 생성한 앱 이름으로 변경하세요.
  appName: 'sample-miniapp',
  brand: {
    // TODO: 서비스 한글 이름으로 변경하세요.
    displayName: '샘플 미니앱',
    primaryColor: '#3182F6',
    // TODO: 아이콘 URL이 없다면 빈 문자열 유지
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --port 5173',
      build: 'vite build',
    },
  },
  outdir: 'dist',
  permissions: [],
  webViewProps: {
    type: 'partner',
  },
});
