import type IConsumer from "@domain/message/consumer.message.js";
import type IUsecase from "@domain/usecase/usecase.domain.js";

class RemovePhotoUsecase implements IUsecase<void>{

    constructor(consumer:IConsumer){
        this.consumer = consumer
    }

    execute(...args: any[]): Promise<void> {
        

    }

}