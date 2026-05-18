export default interface IUpload{
    buffer:Uint8Array,
    originalName:string,
    mimeType:string,
    size:number
}