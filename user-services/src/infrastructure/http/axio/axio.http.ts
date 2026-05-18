import type IHttp from "@domain/http/Ihttp.http.js";
import type IUpload from "@domain/interface/upload.interface.js";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import FormData from "form-data";
export default class HttpClient implements IHttp {
  private client: AxiosInstance;

  constructor(baseUrl: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    });
    this.setUpInteration();
  }

  setUpInteration() {
    this.client.interceptors.request.use((config) => {
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );
  }

  async del<T>(url: string,body:unknown,config?:AxiosRequestConfig): Promise<T> {
    const { data } = await this.client.delete(url,{...config,data:body});
    return data;
  }

  async get<T>(url: string): Promise<T> {
    const { data } = await this.client.get(url);
    return data;
  }

  async post<T>(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.client.post(url, body, config);
    return data;
  }

  async put<T>(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.client.put(url, body, config);
    return data;
  }

  async upload<T>(
    url: string,
    body: IUpload,
    config?: AxiosRequestConfig,
    fields?: Record<string, string>,
  ): Promise<T> {

    const formData = new FormData();

        if (fields) {
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    formData.append("file", Buffer.from(body.buffer), {
      filename: body.originalName,
      contentType: body.mimeType,
    });

    const { data } = await this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }
}
