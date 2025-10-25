import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import {generateResult} from './services/ai.service.js'

const port = process.env.PORT || 3000;
const server = http.createServer(app);
// console.log("server is pport = "+process.env.PORT)



const io  = new Server(server,{
    cors:{
        origin: '*',
    }
});

io.use(async(socket, next) => {
    try{
          const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
            const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }


        socket.project = await projectModel.findById(projectId);

          if(!token) {
            return next(new Error('Authentication error: Token not provided'));
        }
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }


        socket.user = decoded;

        next();

    }catch(err){
        console.error('Socket authentication error:', err);
        next(err)
    }

    })



io.on('connection', socket => {
    socket.roomId =  socket.project._id.toString();
    console.log('New client connected'); 
    socket.join(socket.roomId);
    socket.on('project-message',async data=>{
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        if(aiIsPresentInMessage){
            //   io.to(socket.roomId).emit('project-message', {
            //     sender: { _id: 'ai', email: 'AI Bot' },
            //     message: 'AI is typing...',
            // });

            const prompt = message.replace('@ai','').trim();
            const result = await generateResult(prompt);
            io.to(socket.roomId).emit('project-message', {
                sender: { _id: 'ai', email: 'AI Bot' },
                message: result,
            });
            return;
                
        }
        socket.broadcast.to(socket.roomId).emit('project-message',data);
    })

  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { 
    console.log('User disconnected');
    socket.leave(socket.roomId);

   });
 
});




server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})