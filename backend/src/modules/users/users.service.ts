import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './users.dto';
import { UsersQuery } from './users.query';


@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private readonly userQuery: UsersQuery
    ){}

    async getAll(page:string, limit:string){
        try {
            const npage = Number(page)  
            const nlimit = Number(limit)
            if(npage<=0 || nlimit<=0) throw new Error();

            const users = await this.userRepository.find({
                take: nlimit,
                skip: (npage-1)*nlimit,
                where:{
                    is_deleted:false
                }
            });

            const publicUsers = users.map((user)=>{
                const {password, ...userInfoPublic} = user;
                return userInfoPublic   
            })
            return publicUsers;

        } catch (error) {
            throw new BadRequestException('Page and limit must be positive integers')
        }
        
    }

    async getById(id:string){
        const user = await this.userQuery.getUser(id)
        if(!user) throw new BadRequestException(`No se encontro usario con ${id}`)
        const {password, isAdmin, isSuperAdmin, ...userInfoPublic} = user;
        return userInfoPublic;
    }

    async getByEmail(email:string){
        return  await this.userRepository.findOneBy({email,is_deleted:false});       
    }

    async updateUser(id:string,newUser: Partial<Users>){
        const oldUser = await this.userRepository.findOneBy({id});
        if(!oldUser) throw new BadRequestException(`No se encontro usario con ${id}`)
    
        if(newUser.password){
            const hashedPass = await bcrypt.hash(newUser.password,10);
            newUser = {...newUser,password:hashedPass}
        }

        await this.userRepository.update(id,newUser);
        const updatedUser = await this.userRepository.findOneBy({id});
        const {password, ...userInfoPublic} = updatedUser;

        return userInfoPublic;
    }

    async createUser(user:CreateUserDto){
        const newUser = await this.userRepository.save(user)
        const dbUser = await this.userRepository.findOneBy({id:newUser.id})
        const {password, isAdmin, isSuperAdmin, ...userInfoPublic} = dbUser;
        return userInfoPublic;
    }

    async deleteUser(id:string){

        const user = await this.userRepository.findOneBy({id})
        console.log(!user)
        if(!user) throw new BadRequestException(`No se encontro usario con ${id}`)
        await this.userRepository.update(id,{is_deleted:true})
        return {
            message:`Usuario ${id} eliminado con exito`
        }
    }

    async makeAdmin(id:string){
        const user = await this.userRepository.findOneBy({id,is_deleted:false})
        if(!user) new BadRequestException(`No se encontro usario con ${id}`)
        await this.userRepository.update(id,{isAdmin:true,isSuperAdmin:false})
        return {
            message:"Usuario Admin actualizado con exito"
        }
    }

    async makeSuperAdmin(id:string){
        const user = await this.userRepository.findOneBy({id,is_deleted:false})
        if(!user) new BadRequestException(`No se encontro usario con ${id}`)
        await this.userRepository.update(id,{isSuperAdmin:true,isAdmin:true})
        return{
            message:"Usuario SuperAdmin actualizado con exito"
        }
    }

}
