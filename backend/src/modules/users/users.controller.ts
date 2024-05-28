import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './users.dto';
import { AuthGuards } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/roles.enum';


@Controller('users')
export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuards, RolesGuard)
    getUsers(@Query('page') page:string, @Query('limit') limit:string){
        if(page && limit){
            return this.userService.getAll(page, limit)
        }
        return this.userService.getAll('1','10')
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuards,RolesGuard)
    getUser(@Param('id',ParseUUIDPipe) id:string){
        return this.userService.getById(id)
    }

    @Put('/makeAdmin/:id')
    @Roles(Role.SUPERADMIN)
    @UseGuards(AuthGuards,RolesGuard)
    makeUserAdmin(@Param('id',ParseUUIDPipe) id:string){
        this.userService.makeAdmin(id);
    }

    @Put('/makeSuperAdmin/:id')
    @Roles(Role.SUPERADMIN)
    @UseGuards(AuthGuards,RolesGuard)
    makeUserSuperAdmin(@Param('id',ParseUUIDPipe) id:string){
        this.userService.makeSuperAdmin(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuards,RolesGuard)
    updateUser(@Param('id',ParseUUIDPipe) id:string, @Body() user:UpdateUserDto){
        return this.userService.updateUser(id,user)
    }

    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    @UseGuards(AuthGuards,RolesGuard)
    DeleteUser(@Param('id',ParseUUIDPipe) id:string){
        return this.userService.deleteUser(id)
    }

    

}
