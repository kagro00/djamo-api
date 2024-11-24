import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from './datasource/typeorm.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [TypeOrmModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
