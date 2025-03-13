import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';

@WebSocketGateway({
  cors:{
    origin: '*',
  },
})
export class MessagesGateway {
  
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  // @SubscribeMessage('createMessage')
  // async create(
  //   @MessageBody() createMessageDto: CreateMessageDto, 
  //   @ConnectedSocket() client: Socket
  // ) {
  //   const message = await this.messagesService.create(
  //     createMessageDto,
  //     client.id,
  //     createMessageDto.chatId
  //   );

  //   this.server.to(createMessageDto.chatId).emit('message', message);
  //   return message;
  // }
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.create(createMessageDto, client.id);
    this.server.emit('message', message);
    this.server.emit('notification', { 
      chatId: createMessageDto.chatId, 
      text: `${createMessageDto.name} vừa bình luận: ${createMessageDto.text}` 
    });
    return message;
  }
  

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody('chatId') chatId: string) {
    console.log("chatId",chatId);
    
    return this.messagesService.findAll(chatId);
  }
  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  async remove(@MessageBody() { chatId, index }: { chatId: string; index: number }) {
    await this.messagesService.remove(chatId, index);
    this.server.emit('deleteMessage', { chatId, index });
  }
//_---------------------------------------------
  // @SubscribeMessage('join')
  // async joinRoom(
  //   @MessageBody('name') name:string, 
  //   @ConnectedSocket() client: Socket 
  // ){
  //   //TODO
  //   return this.messagesService.identify(name,client.id);
  // }
  @SubscribeMessage('joinRoom')
async joinRoom(
  @MessageBody('chatId') chatId: string,
  @MessageBody('name') name: string,
  @ConnectedSocket() client: Socket
) {
  client.join(chatId);
  this.messagesService.identify(name, client.id);
  return { success: true, chatId };
}
  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: Boolean, 
    @ConnectedSocket() client: Socket
  ){
    //TODO
    const name = await this.messagesService.getClientName(client.id);

    client.broadcast.emit('typing', {name,isTyping})
  }
}
