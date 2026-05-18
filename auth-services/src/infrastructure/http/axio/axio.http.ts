
import type IHttp from "@domain/http/Ihttp.http.js";
import axios, {
  Axios,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
export default class HttpClient implements IHttp {
  private client: AxiosInstance;

  constructor(baseUrl: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 5000,
      ...config,
    });

    this.setUpInteration()
  }

  setUpInteration(){
    this.client.interceptors.request.use((config)=>{
        return config
    })

    this.client.interceptors.response.use((response)=>{
        return response
    })
  }

  async del<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await this.client.delete(url, { data: body });
    return data;
  }
  async get<T>(url: string): Promise<T> {
    console.log(url)
    const { data } = await this.client.get(url);
    return data;
  }
  async post<T>(url: string, body: unknown): Promise<T> {
    const { data } = await this.client.post(url, body);
    return data;
  }
  async put<T>(url: string, body: unknown): Promise<T> {
    const { data } = await this.client.put(url, body);
    return data;
  }
}
