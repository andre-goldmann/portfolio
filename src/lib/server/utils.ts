import { PDFLoader } from "langchain/document_loaders/fs/pdf";



export function loadPdf(fileName:string){
    const loader = new PDFLoader("C:\\Users\\agol\\workspace_private\\sms\\data_backupd\\medicine\\71763-gale-encyclopedia-of-medicine.-vol.-1.-2nd-ed");
    return loader.load();
}