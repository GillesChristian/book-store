// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findPasswordByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // User service unit tests

  // Test for getUsers method
  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User One',
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User Two',
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const users = await service.getUsers();

      expect(users).toEqual(mockUsers);
    });

    it('should return null if no users found', async () => {
      mockPrismaService.user.findMany.mockResolvedValue(null);

      const users = await service.getUsers();

      expect(users).toBeNull();
    });
  });

  // Test for getUserById method
  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: '1',
        email: 'user1@example.com',
        password: 'hashedpassword',
        name: 'User One',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const user = await service.getUserById('1');

      expect(user).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const user = await service.getUserById('nonexistent-id');

      expect(user).toBeNull();
    });
  });
});
