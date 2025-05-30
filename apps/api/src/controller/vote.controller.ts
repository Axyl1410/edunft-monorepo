import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { DatabaseFailure, NotFoundFailure } from 'src/core/failure';
import { Vote } from 'src/schema/vote.schema';
import { VoteService } from 'src/service/vote.service';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  private handleResult<T>(result: {
    isSuccess: () => boolean;
    value?: T;
    error?: any;
  }): T {
    if (result.isSuccess()) {
      return result.value;
    }
    this.handleError(result.error);
  }

  private handleError(error: any): never {
    if (error instanceof NotFoundFailure) {
      throw new NotFoundException(error.message);
    } else if (error instanceof DatabaseFailure) {
      throw new InternalServerErrorException('A database error occurred.');
    } else {
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @Post('addVote')
  async addVote(
    @Body('walletAddress') walletAddress: string,
    @Body('voteType') voteType: 'upvote' | 'downvote',
    @Body('hash') hash: string,
  ): Promise<void> {
    const result = await this.voteService.handleVote(
      walletAddress,
      voteType,
      hash,
    );
    this.handleResult(result);
  }

  @Get('hash/:hash')
  async getVoteByHash(@Param('hash') hash: string): Promise<Vote[]> {
    const result = await this.voteService.getVoteByHash(hash);
    return this.handleResult(result);
  }

  @Get('user/:walletAddress')
  async getVoteByWalletAddress(
    @Param('walletAddress') walletAddress: string,
  ): Promise<Vote[]> {
    const result = await this.voteService.getVoteByWalletAddress(walletAddress);
    return this.handleResult(result);
  }
}
