import {
  Controller,
  Body,
  Post,
  HttpStatus,
  Get,
  HttpCode,
  Param,
  Put,
  Delete,
  Query,
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { PayableDto } from './DTOs/payable';
import { AssignorDto } from './DTOs/assignor';
import { PayableRepo } from './repositories/payable-repo';
import { AssignorRepo } from './repositories/assignor-repo';
import { UserDto } from './DTOs/user';
import { UserRepo } from './repositories/user-repo';

@Controller('integrations')
export class AppController {
  constructor(
    private receivable: PayableRepo,
    private assignor: AssignorRepo,
    private user: UserRepo,
  ) {}

  @Post('auth')
  async auth(@Body() body: UserDto) {
    try {
      const userExist = await this.user.getUserByLogin(body.login);

      if (userExist) {
        throw new BadRequestException('User already exists');
      }

      const createUser = await this.user.createUser(body);
      // Não verifico se o usuário foi criado pois qualquer erro que ocorrer aqui será tratado no catch
      return createUser;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('auth/:id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: number) {
    try {
      const user = await this.user.getUserById(+id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('auth/login/search')
  @HttpCode(HttpStatus.OK)
  async getUserByLogin(@Query('login') login: string) {
    try {
      const user = await this.user.getUserByLogin(login);

      if (!user) {
        throw new NotFoundException(`User with login ${login} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('auth')
  @HttpCode(HttpStatus.OK)
  async getUserAll() {
    try {
      const users = await this.user.getUsersAll();

      if (!users) {
        throw new NotFoundException('Users not found');
      }

      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('auth/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: number, @Body() body: UserDto) {
    try {
      const userExist = await this.user.getUserById(+id);

      if (!userExist) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const user = await this.user.updateUser(+id, body);
      // Qualquer erro de update será tratado no catch. Assim evita verificação redundante
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('auth/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: number) {
    try {
      const userExist = await this.user.getUserById(+id);

      if (!userExist) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.user.deleteUser(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('payable')
  async createReceivable(@Body() body: PayableDto) {
    try {
      const payableExist = await this.receivable.getPayableById(body.id);

      if (payableExist) {
        throw new BadRequestException('Payable already exists');
      }

      const newReceived = await this.receivable.createPayable(body);

      return newReceived;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('payable/:id')
  @HttpCode(HttpStatus.OK)
  async getReceivables(@Param('id') id: string) {
    try {
      const payable = await this.receivable.getPayableById(id);

      if (!payable) {
        throw new NotFoundException(`Payable with ID ${id} not found`);
      }

      return payable;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('payable')
  @HttpCode(HttpStatus.OK)
  async getReceivablesAll() {
    try {
      const payables = await this.receivable.getAllPayables();

      if (!payables) {
        throw new NotFoundException('Payables not found');
      }

      return payables;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('payable/:id')
  @HttpCode(HttpStatus.OK)
  async updatePayable(@Param('id') id: string, @Body() body: PayableDto) {
    try {
      const payableExist = await this.receivable.getPayableById(id);

      if (!payableExist) {
        throw new NotFoundException(`Payable with ID ${id} not found`);
      }

      const payableUpdated = await this.receivable.updatePayable(id, body);

      return payableUpdated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('payable/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePayable(@Param('id') id: string) {
    try {
      const payableExist = await this.receivable.getPayableById(id);

      if (!payableExist) {
        throw new NotFoundException(`Payable with ID ${id} not found`);
      }

      await this.receivable.deletePayable(id);

      return null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('assignor')
  async createAssignor(@Body() body: AssignorDto) {
    try {
      const assignorExist = await this.assignor.getAssignorById(body.id);

      if (assignorExist) {
        throw new BadRequestException('Assignor already exists');
      }

      const newAssignor = await this.assignor.createAssignor(body);

      return newAssignor;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('assignor/:id')
  @HttpCode(HttpStatus.OK)
  async getAssignors(@Param('id') id: string) {
    try {
      const assignors = await this.assignor.getAssignorById(id);

      if (!assignors) {
        throw new NotFoundException(`Assignor with ID ${id} not found`);
      }

      return assignors;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('assignor')
  @HttpCode(HttpStatus.OK)
  async getAssignorsAll() {
    try {
      const assignors = await this.assignor.getAllAssignors();

      if (!assignors) {
        throw new NotFoundException('Assignors not found');
      }

      return assignors;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('assignor/:id')
  @HttpCode(HttpStatus.OK)
  async updateAssignor(@Param('id') id: string, @Body() body: AssignorDto) {
    try {
      const assignorExist = await this.assignor.getAssignorById(id);

      if (!assignorExist) {
        throw new NotFoundException(`Assignor with ID ${id} not found`);
      }

      const assignorUpdated = await this.assignor.updateAssignor(id, body);

      return assignorUpdated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('assignor/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAssignor(@Param('id') id: string) {
    try {
      const assignorExist = await this.assignor.getAssignorById(id);

      if (!assignorExist) {
        throw new NotFoundException(`Assignor with ID ${id} not found`);
      }

      await this.assignor.deleteAssignor(id);

      return null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
