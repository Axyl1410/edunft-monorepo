import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DatabaseFailure,
  NotFoundFailure,
  ValidationFailure,
} from 'src/core/failure';
import { Fail, Result, Success } from 'src/core/types';
import { User } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(
    user: User,
  ): Promise<Result<User, DatabaseFailure | ValidationFailure>> {
    if (!user.walletAddress) {
      return new Fail(new ValidationFailure('User', user.walletAddress));
    }

    try {
      const newUser = new this.userModel(user);
      const savedUser = await newUser.save();

      return new Success(savedUser);
    } catch {
      return new Fail(new DatabaseFailure('Failed to create new user.'));
    }
  }

  // login user when connecting wallet
  async loginUser(
    user: User,
  ): Promise<
    Result<User, NotFoundFailure | DatabaseFailure | ValidationFailure>
  > {
    if (!user.walletAddress) {
      return new Fail(new ValidationFailure('User', user.walletAddress));
    }

    try {
      const foundUser = await this.userModel
        .findOne({
          walletAddress: user.walletAddress,
        })
        .lean()
        .exec();

      if (foundUser) {
        return new Success(foundUser);
      }
      return new Fail(new NotFoundFailure('User', user.walletAddress));
    } catch (error) {
      console.error('Error logging in user:', error);
      return new Fail(new DatabaseFailure('Failed to login user.'));
    }
  }

  async getUserByWalletAddress(
    walletAddress: string,
  ): Promise<
    Result<User, NotFoundFailure | DatabaseFailure | ValidationFailure>
  > {
    if (!walletAddress) {
      return new Fail(new ValidationFailure('User', walletAddress));
    }

    try {
      const user = await this.userModel
        .findOne({ walletAddress: walletAddress })
        .lean()
        .exec();

      if (!user) {
        return new Fail(new NotFoundFailure('User', walletAddress));
      }

      return new Success(user);
    } catch (error) {
      console.error('Error fetching user by wallet address:', error);
      return new Fail(
        new DatabaseFailure('Failed to fetch user by wallet address.'),
      );
    }
  }

  async getUserIdByWalletAddress(
    walletAddress: string,
  ): Promise<{ _id: string }> {
    try {
      const user = await this.userModel
        .findOne({
          walletAddress: walletAddress,
        })
        .select('_id')
        .lean()
        .exec();

      if (!user) {
        throw new Error(`User with wallet address ${walletAddress} not found.`);
      }

      return { _id: user._id.toString() };
    } catch (error) {
      console.error('Error fetching user ID by wallet address:', error);
      throw new Error(`Failed to fetch user ID by wallet address: `);
    }
  }

  async updateUser(
    walletAddress: string,
    update: Partial<User>,
  ): Promise<
    Result<User, NotFoundFailure | DatabaseFailure | ValidationFailure>
  > {
    if (!walletAddress) {
      return new Fail(new ValidationFailure('User', walletAddress));
    }
    try {
      const user = await this.userModel
        .findOneAndUpdate({ walletAddress: walletAddress }, update, {
          new: true,
        })
        .lean()
        .exec();

      if (!user) {
        return new Fail(new NotFoundFailure('User', walletAddress));
      }
      return new Success(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return new Fail(new DatabaseFailure('Failed to update user.'));
    }
  }

  async getUserAvatar(
    walletAddress: string,
  ): Promise<
    Result<
      { avatar: string | null },
      NotFoundFailure | DatabaseFailure | ValidationFailure
    >
  > {
    if (!walletAddress) {
      return new Fail(new ValidationFailure('User', walletAddress));
    }

    try {
      const user = await this.userModel
        .findOne({ walletAddress })
        .select('profilePicture')
        .lean()
        .exec();

      if (!user) {
        return new Success({ avatar: null });
      }

      return new Success({ avatar: user.profilePicture || null });
    } catch (error) {
      console.error('Error fetching user avatar:', error);
      return new Fail(new DatabaseFailure('Failed to fetch user avatar.'));
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userModel
      .find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
          { walletAddress: { $regex: query, $options: 'i' } },
          { role: { $regex: query, $options: 'i' } },
        ],
      })
      .lean()
      .exec();
  }

  async getAllUsersRandom(limit = 20): Promise<User[]> {
    // Lấy random user, mặc định 20 user
    const users = await this.userModel
      .aggregate([{ $sample: { size: limit } }])
      .exec();
    return users as User[];
  }
}
