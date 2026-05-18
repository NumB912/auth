import type IUUID from "@domain/service/uuid.service.js";
import { randomUUID } from "crypto";
export default class UUID implements IUUID {
 async randomUUID(): Promise<string> {
    return randomUUID()
 }
}
