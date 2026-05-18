export default interface IFile{
    uploadFile(file:File,url:string):Promise<string>
    removeFile(fileUrl:string):Promise<void>
}