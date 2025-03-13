import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  // messages: Message[] = [{name: 'dan', text: 'helloworld',chatId: "Tech"}]
  messages: Message[] = []
  clientToUser = {};

  // create(createMessageDto: CreateMessageDto,clientId: string) {
  //   // return 'This action adds a new message';
  //   // const message = {...createMessageDto};
  //   const message = {
  //     name: this.clientToUser[clientId],
  //     text: createMessageDto.text,
  //   };
  //   //TODO: cải thiện
  //   this.messages.push(message);
  //   return message;
  // }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
      chatId: createMessageDto.chatId,
    };
    this.messages.push(message);
    return message;
  }

  identify(name: string, clientId: string) {
    // throw new Error('Method not implemented.');
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string){
    return this.clientToUser[clientId];
  }

  findAll(chatId: string) {
    // Lọc các tin nhắn theo chatId
    console.log(this.messages);
    
    return this.messages.filter((message) => message.chatId === chatId);
  }
  

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(chatId: string, index: number) {
    if (this.messages[chatId]) {
      this.messages[chatId].splice(index, 1);
    }
  }
}
