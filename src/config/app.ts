export interface AppConfig {
  API_URL: string;
}

const appConfig: AppConfig = {
  API_URL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://league-in-houses.herokuapp.com',
};

export default appConfig;
